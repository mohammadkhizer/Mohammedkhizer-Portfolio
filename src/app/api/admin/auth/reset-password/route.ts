/**
 * POST /api/admin/auth/reset-password
 *
 * Step 3 — Updates the admin password in MongoDB.
 *
 * Security:
 *   - Reset token read from httpOnly cookie (never from body).
 *   - Token validated against hashed value in MongoDB.
 *   - bcryptjs used to hash and store the new password.
 *   - OTP record deleted (single-use guarantee).
 *   - Confirmation email sent.
 *   - Reset cookies cleared after use.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
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
    await dbConnect();

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

    // ── 2. Look up admin account ──
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json({ message: 'Admin account not found.' }, { status: 404 });
    }

    // ── 3. Hash and update password in MongoDB ──
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    admin.passwordHash = passwordHash;
    admin.updatedAt = new Date();
    await admin.save();

    // ── 4. Invalidate OTP record (single-use) ──
    await invalidateOTPRecord(email);

    // ── 5. Audit log ──
    await writeAuditLog('PASSWORD_RESET_COMPLETED', email, ip, userAgent, admin._id.toString());
    await writeAuditLog('SESSION_REVOKED', email, ip, userAgent, admin._id.toString());

    // ── 6. Confirmation email ──
    await sendPasswordChangedConfirmation(email);

    // ── 7. Clear reset cookies ──
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
