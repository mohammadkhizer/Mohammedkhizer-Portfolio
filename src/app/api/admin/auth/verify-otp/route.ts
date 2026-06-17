/**
 * POST /api/admin/auth/verify-otp
 *
 * Step 2 — Verifies the submitted OTP.
 *
 * On success:
 *   - Issues a short-lived, httpOnly `admin_reset_token` cookie.
 *   - Returns { success: true } — the UI redirects to /admin/auth/reset-password.
 *
 * Security:
 *   - All OTP logic (expiry, attempts, lockout) is inside otp-service.ts.
 *   - Reset token is stored hashed in Firestore; raw value lives only in
 *     the httpOnly cookie (not accessible to JS).
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { verifyOTP } from '@/lib/otp-service';
import { writeAuditLog } from '@/lib/audit-logger';
import { logger } from '@/lib/logger';

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d{6}$/),
});

// ─── In-memory per-email rate limiter ─────────────────────────────────────────
const verifyAttemptMap = new Map<string, { count: number; windowStart: number }>();
const VERIFY_RATE = { maxRequests: 10, windowMs: 15 * 60 * 1000 };

function checkVerifyRate(email: string): boolean {
  const now = Date.now();
  const entry = verifyAttemptMap.get(email);
  if (!entry || now - entry.windowStart > VERIFY_RATE.windowMs) {
    verifyAttemptMap.set(email, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= VERIFY_RATE.maxRequests) return true;
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = headerList.get('user-agent') ?? 'unknown';

  let email: string, otp: string;
  try {
    const body = await req.json();
    ({ email, otp } = schema.parse(body));
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  email = email.toLowerCase().trim();

  if (checkVerifyRate(email)) {
    return NextResponse.json(
      { message: 'Too many verification attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const result = await verifyOTP(email, otp, ip);

    if (!result.success || !result.resetToken) {
      await writeAuditLog('OTP_FAILED', email, ip, userAgent);
      return NextResponse.json(
        { message: result.error ?? 'Invalid OTP.' },
        { status: 401 }
      );
    }

    await writeAuditLog('OTP_VERIFIED', email, ip, userAgent);

    // ── Issue reset token as a secure httpOnly cookie ──
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set('admin_reset_token', result.resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60, // 10 minutes — matches OTP_CONFIG.RESET_TOKEN_EXPIRY_MS
      path: '/admin/auth/reset-password',
    });
    // Store email in a separate short-lived cookie for the reset page
    response.cookies.set('admin_reset_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60,
      path: '/admin/auth/reset-password',
    });

    return response;
  } catch (err) {
    logger.error('Verify OTP handler error', { error: String(err), ip });
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
