/**
 * OTP Service — Server-side only.
 *
 * Security design decisions:
 * - OTP is NEVER stored in plain text; we store a SHA-256 hash.
 * - A separate cryptographically secure reset token is issued after OTP
 *   verification so the OTP cannot be reused if captured in transit.
 * - All limits (expiry, retries, resend cooldown) are enforced server-side.
 * - MongoDB collection is used for OTP document storage.
 */

import crypto from 'crypto';
import dbConnect from './mongodb';
import OTPRecord, { IOTPRecord } from '@/models/OTPRecord';
import { logger } from '@/lib/logger';

// ─── Constants ────────────────────────────────────────────────────────────────
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MS: 5 * 60 * 1000,           // 5 minutes
  MAX_ATTEMPTS: 5,                     // before lockout
  RESEND_COOLDOWN_MS: 60 * 1000,       // 60 seconds between resends
  MAX_RESENDS: 3,                      // total resends per request
  LOCKOUT_MS: 15 * 60 * 1000,         // 15 minutes lockout
  RESET_TOKEN_EXPIRY_MS: 10 * 60 * 1000, // 10 minutes for reset token
} as const;

// ─── Hash helpers ─────────────────────────────────────────────────────────────

/** SHA-256 hex digest. Used for both OTP and reset token storage. */
export function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Constant-time string comparison to prevent timing attacks. */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// ─── OTP Generation ───────────────────────────────────────────────────────────

/**
 * Generates a cryptographically secure 6-digit OTP.
 * Uses crypto.randomInt for uniform distribution without modulo bias.
 */
export function generateOTP(): string {
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
}

/**
 * Generates a cryptographically secure reset token (32 random bytes → hex).
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ─── MongoDB Operations ─────────────────────────────────────────────────────

function getDocId(email: string): string {
  // Use a lowercase-normalised email as the document ID to prevent duplicates.
  return hashValue(email.toLowerCase().trim());
}

/**
 * Creates (or overwrites) an OTP record in MongoDB.
 * Called on every "Send OTP" request once the admin account is verified.
 */
export async function createOTPRecord(
  email: string,
  otp: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const now = Date.now();
  const id = getDocId(email);
  const record = {
    id,
    email: email.toLowerCase().trim(),
    otpHash: hashValue(otp),
    expiresAt: now + OTP_CONFIG.EXPIRY_MS,
    attempts: 0,
    verified: false,
    resendCount: 0,
    lastResendAt: now,
    lockedUntil: null,
    ipAddress,
    userAgent,
    resetToken: null,
    resetTokenExpiresAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await dbConnect();
  await OTPRecord.findOneAndUpdate({ id }, record, { upsert: true, new: true });
  logger.info('OTP record created', { action: 'OTP_CREATED', ip: ipAddress });
}

/**
 * Resends an OTP by rotating the hash on an existing record.
 * Enforces resend cooldown and max resend limits.
 */
export async function rotateOTP(
  email: string,
  newOtp: string,
  ipAddress: string
): Promise<{ success: boolean; error?: string }> {
  const now = Date.now();
  const id = getDocId(email);
  
  await dbConnect();
  const data = await OTPRecord.findOne({ id }).lean() as IOTPRecord | null;

  if (!data) return { success: false, error: 'No active reset request' };

  if (data.resendCount >= OTP_CONFIG.MAX_RESENDS) {
    return { success: false, error: 'Maximum resend limit reached. Please start over.' };
  }

  if (now - data.lastResendAt < OTP_CONFIG.RESEND_COOLDOWN_MS) {
    const remainingSec = Math.ceil(
      (OTP_CONFIG.RESEND_COOLDOWN_MS - (now - data.lastResendAt)) / 1000
    );
    return { success: false, error: `Please wait ${remainingSec}s before resending.` };
  }

  await OTPRecord.updateOne(
    { id },
    {
      otpHash: hashValue(newOtp),
      expiresAt: now + OTP_CONFIG.EXPIRY_MS,
      attempts: 0,
      verified: false,
      resendCount: data.resendCount + 1,
      lastResendAt: now,
      lockedUntil: null,
      updatedAt: now,
    }
  );

  logger.info('OTP rotated', { action: 'OTP_RESENT', ip: ipAddress });
  return { success: true };
}

/**
 * Validates a supplied OTP against the stored hash.
 * Manages attempt counter, expiry, and lockout logic.
 *
 * On success, writes a hashed reset token to the record and returns the
 * raw token so it can be set in a short-lived cookie.
 */
export async function verifyOTP(
  email: string,
  otp: string,
  ipAddress: string
): Promise<{ success: boolean; resetToken?: string; error?: string }> {
  const now = Date.now();
  const id = getDocId(email);

  await dbConnect();
  const data = await OTPRecord.findOne({ id }).lean() as IOTPRecord | null;

  if (!data) {
    logger.warn('OTP verify: no record found', { action: 'OTP_VERIFY_NO_RECORD', ip: ipAddress });
    return { success: false, error: 'Invalid or expired OTP.' };
  }

  // ── Lockout check ──
  if (data.lockedUntil && now < data.lockedUntil) {
    const remainMin = Math.ceil((data.lockedUntil - now) / 60000);
    return {
      success: false,
      error: `Too many attempts. Account locked for ${remainMin} more minute(s).`,
    };
  }

  // ── Already verified guard ──
  if (data.verified) {
    return { success: false, error: 'OTP already used.' };
  }

  // ── Expiry check ──
  if (now > data.expiresAt) {
    logger.warn('OTP expired', { action: 'OTP_EXPIRED', ip: ipAddress });
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  // ── Attempt guard ──
  if (data.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    const lockedUntil = now + OTP_CONFIG.LOCKOUT_MS;
    await OTPRecord.updateOne({ id }, { lockedUntil, updatedAt: now });
    logger.warn('OTP lockout triggered', { action: 'OTP_LOCKOUT', ip: ipAddress });
    return {
      success: false,
      error: 'Too many failed attempts. Your request has been locked for 15 minutes.',
    };
  }

  // ── Hash comparison (constant-time) ──
  const suppliedHash = hashValue(otp);
  const isValid = safeCompare(suppliedHash, data.otpHash);

  if (!isValid) {
    await OTPRecord.updateOne({ id }, { attempts: data.attempts + 1, updatedAt: now });
    const remaining = OTP_CONFIG.MAX_ATTEMPTS - (data.attempts + 1);
    logger.warn('OTP invalid attempt', { action: 'OTP_FAILED', ip: ipAddress, remaining });
    return {
      success: false,
      error: `Invalid OTP. ${remaining} attempt(s) remaining.`,
    };
  }

  // ── SUCCESS — issue reset token ──
  const rawResetToken = generateResetToken();
  await OTPRecord.updateOne(
    { id },
    {
      verified: true,
      attempts: data.attempts + 1,
      resetToken: hashValue(rawResetToken),
      resetTokenExpiresAt: now + OTP_CONFIG.RESET_TOKEN_EXPIRY_MS,
      updatedAt: now,
    }
  );

  logger.info('OTP verified', { action: 'OTP_VERIFIED', ip: ipAddress });
  return { success: true, resetToken: rawResetToken };
}

/**
 * Validates a reset token before allowing password update.
 * Returns the email associated with a valid, unexpired, single-use token.
 */
export async function validateResetToken(
  email: string,
  rawResetToken: string
): Promise<{ valid: boolean; error?: string }> {
  const now = Date.now();
  const id = getDocId(email);

  await dbConnect();
  const data = await OTPRecord.findOne({ id }).lean() as IOTPRecord | null;

  if (!data) return { valid: false, error: 'Invalid reset session.' };

  if (!data.verified) return { valid: false, error: 'OTP not verified.' };
  if (!data.resetToken) return { valid: false, error: 'No reset token issued.' };
  if (!data.resetTokenExpiresAt || now > data.resetTokenExpiresAt) {
    return { valid: false, error: 'Reset session expired. Please start over.' };
  }

  const isValid = safeCompare(hashValue(rawResetToken), data.resetToken);
  if (!isValid) return { valid: false, error: 'Invalid reset token.' };

  return { valid: true };
}

/**
 * Deletes the OTP record after a successful password reset (cleanup).
 */
export async function invalidateOTPRecord(email: string): Promise<void> {
  const id = getDocId(email);
  await dbConnect();
  await OTPRecord.deleteOne({ id });
  logger.info('OTP record invalidated post-reset', { action: 'OTP_INVALIDATED' });
}
