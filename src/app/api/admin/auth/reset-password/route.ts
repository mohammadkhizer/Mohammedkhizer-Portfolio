/**
 * POST /api/admin/auth/reset-password
 *
 * Step 3 — Updates the admin password.
 *
 * Security:
 *   - Reset token read from httpOnly cookie (never from body).
 *   - Token validated against hashed value in Firestore.
 *   - Firebase Admin SDK used to update password (server-side only).
 *   - All refresh tokens revoked immediately after update.
 *   - OTP record deleted (single-use guarantee).
 *   - Confirmation email sent.
 *   - Reset cookies cleared after use.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { authAdmin } from '@/lib/firebase-admin';
import { validateResetToken, invalidateOTPRecord } from '@/lib/otp-service';
import { sendPasswordChangedConfirmation } from '@/lib/email-service';
import { writeAuditLog } from '@/lib/audit-logger';
import { logger } from '@/lib/logger';

const schema = z.object({
  password: z
    .string()
    .min(12)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export async function POST(req: NextRequest) {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = headerList.get('user-agent') ?? 'unknown';

  // ── Read reset cookies (httpOnly — not in request body) ──
  const rawResetToken = req.cookies.get('admin_reset_token')?.value;
  const email = req.cookies.get('admin_reset_email')?.value;

  if (!rawResetToken || !email) {
    return NextResponse.json(
      { message: 'Invalid or expired reset session. Please start over.' },
      { status: 401 }
    );
  }

  let password: string;
  try {
    const body = await req.json();
    ({ password } = schema.parse(body));
  } catch {
    return NextResponse.json({ message: 'Password does not meet requirements.' }, { status: 400 });
  }

  try {
    // ── 1. Validate reset token ──
    const tokenCheck = await validateResetToken(email, rawResetToken);
    if (!tokenCheck.valid) {
      await writeAuditLog('PASSWORD_RESET_FAILED', email, ip, userAgent, null, {
        reason: tokenCheck.error ?? 'invalid_token',
      });
      return NextResponse.json(
        { message: tokenCheck.error ?? 'Invalid reset session.' },
        { status: 401 }
      );
    }

    // ── 2. Look up admin UID ──
    const userRecord = await authAdmin.getUserByEmail(email);

    // ── 3. Update password via Firebase Admin SDK ──
    await authAdmin.updateUser(userRecord.uid, { password });

    // ── 4. Revoke ALL refresh tokens → forces logout on all devices ──
    await authAdmin.revokeRefreshTokens(userRecord.uid);

    // ── 5. Invalidate OTP record (single-use) ──
    await invalidateOTPRecord(email);

    // ── 6. Audit log ──
    await writeAuditLog('PASSWORD_RESET_COMPLETED', email, ip, userAgent, userRecord.uid);
    await writeAuditLog('SESSION_REVOKED', email, ip, userAgent, userRecord.uid);

    // ── 7. Confirmation email ──
    await sendPasswordChangedConfirmation(email);

    // ── 8. Clear reset cookies ──
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set('admin_reset_token', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/admin/auth/reset-password',
    });
    response.cookies.set('admin_reset_email', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/admin/auth/reset-password',
    });

    return response;
  } catch (err) {
    logger.error('Reset password handler error', { error: String(err), ip });
    await writeAuditLog('PASSWORD_RESET_FAILED', email, ip, userAgent, null, {
      reason: 'server_error',
    });
    return NextResponse.json(
      { message: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
