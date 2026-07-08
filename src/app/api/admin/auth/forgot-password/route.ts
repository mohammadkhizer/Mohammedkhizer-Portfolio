/**
 * POST /api/admin/auth/forgot-password
 *
 * Step 1 of the password reset flow.
 *
 * Security design:
 * - Response is ALWAYS generic ("If an account exists, an OTP has been sent")
 *   to prevent account enumeration attacks.
 * - Admin account existence and status are checked server-side only.
 * - OTP is generated, hashed, and stored — never returned in the response.
 * - Rate limited per IP address.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { generateOTP, createOTPRecord } from '@/lib/otp-service';
import { sendAdminPasswordResetOTP } from '@/lib/email-service';
import { writeAuditLog } from '@/lib/audit-logger';
import { logger } from '@/lib/logger';
import { ADMIN_CONFIG, OTP_CONFIG } from '@/lib/constants-admin-auth';

// ─── Input schema ─────────────────────────────────────────────────────────────
const schema = z.object({
  email: z.string().email(),
});

// ─── In-memory IP rate limiter (replace with Redis for multi-instance) ────────
const ipRequestMap = new Map<string, { count: number; windowStart: number }>();
const EMAIL_REQUEST_MAP = new Map<string, { count: number; windowStart: number }>();

const RATE_LIMIT = { maxRequests: 5, windowMs: 15 * 60 * 1000 }; // 5 per 15 min

function checkRateLimit(key: string, map: Map<string, { count: number; windowStart: number }>): boolean {
  const now = Date.now();
  const entry = map.get(key);

  if (!entry || now - entry.windowStart > RATE_LIMIT.windowMs) {
    map.set(key, { count: 1, windowStart: now });
    return false; // not limited
  }

  if (entry.count >= RATE_LIMIT.maxRequests) return true; // limited

  entry.count += 1;
  return false;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = headerList.get('user-agent') ?? 'unknown';

  // ── Rate limit by IP ──
  if (checkRateLimit(ip, ipRequestMap)) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let email: string;
  try {
    const body = await req.json();
    ({ email } = schema.parse(body));
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  email = email.toLowerCase().trim();

  // ── Rate limit by email ──
  if (checkRateLimit(email, EMAIL_REQUEST_MAP)) {
    // Still return generic message — don't confirm the email exists
    return NextResponse.json(
      { message: 'If an account exists, an OTP has been sent.' },
      { status: 200 }
    );
  }

  try {
    await dbConnect();

    // ── 1. Look up admin account in MongoDB ──
    const admin = await Admin.findOne({ email });

    if (!admin) {
      logger.info('Password reset request for unknown email', { ip });
      return NextResponse.json(
        { message: 'If an account exists, an OTP has been sent.' },
        { status: 200 }
      );
    }

    // ── 2. Verify account has admin access ──
    if (!admin.isAdmin) {
      logger.warn('Password reset blocked: not an admin', { ip });
      await writeAuditLog('OTP_REQUESTED', email, ip, userAgent, admin._id.toString(), {
        blocked: true,
        reason: 'not_admin',
      });
      return NextResponse.json(
        { message: 'If an account exists, an OTP has been sent.' },
        { status: 200 }
      );
    }

    // ── 3. Generate OTP and store hashed ──
    const otp = generateOTP();
    await createOTPRecord(email, otp, ip, userAgent);

    // ── 4. Send OTP email ──
    const sent = await sendAdminPasswordResetOTP({
      to: email,
      otp,
      ipAddress: ip,
      expiryMinutes: OTP_CONFIG.EXPIRY_MS / 60000,
    });

    if (!sent) {
      logger.error('OTP email delivery failed', { ip });
    }

    // ── 5. Audit log ──
    await writeAuditLog('OTP_REQUESTED', email, ip, userAgent, admin._id.toString());

    return NextResponse.json(
      { message: 'If an account exists, an OTP has been sent.' },
      { status: 200 }
    );
  } catch (err) {
    logger.error('Forgot password handler error', { error: String(err), ip });
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
