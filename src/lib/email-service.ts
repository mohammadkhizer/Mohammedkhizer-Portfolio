/**
 * Email Service — Admin Password Reset OTP
 *
 * Uses Resend (https://resend.com) as the primary delivery provider.
 * To switch to SendGrid or Nodemailer, replace only the `sendViaResend`
 * implementation — the rest of the module stays the same.
 *
 * Environment variables required:
 *   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
 *   EMAIL_FROM=noreply@yourdomain.com
 *   NEXT_PUBLIC_APP_NAME=Your Portfolio
 */

import { logger } from '@/lib/logger';

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'work.mkhizer@gmail.com';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Admin Portal';

// ─── HTML Email Template ──────────────────────────────────────────────────────

function buildOTPEmailHTML(opts: {
  otp: string;
  email: string;
  ipAddress: string;
  expiryMinutes: number;
}): string {
  const { otp, email, ipAddress, expiryMinutes } = opts;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Password Reset OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 40px;text-align:center;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="font-size:28px;">🔐</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                Password Reset Request
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">${APP_NAME}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                A password reset was requested for the admin account associated with
                <strong style="color:#e2e8f0;">${email}</strong>.
              </p>

              <!-- OTP Block -->
              <div style="background:#0f172a;border:1px solid #4f46e5;border-radius:10px;padding:28px;text-align:center;margin:24px 0;">
                <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Your One-Time Password</p>
                <div style="font-size:40px;font-weight:800;letter-spacing:10px;color:#818cf8;font-family:'Courier New',monospace;">
                  ${otp}
                </div>
                <p style="margin:16px 0 0;color:#64748b;font-size:13px;">
                  ⏱ Valid for <strong style="color:#94a3b8;">${expiryMinutes} minutes</strong> only
                </p>
              </div>

              <!-- Security Warning -->
              <div style="background:#1a1a2e;border-left:4px solid #ef4444;border-radius:6px;padding:16px 20px;margin:24px 0;">
                <p style="margin:0 0 8px;color:#fca5a5;font-size:13px;font-weight:700;">🛡 Security Notice</p>
                <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">
                  If you did <strong>NOT</strong> request this password reset, please contact your
                  system administrator immediately and do not share this code with anyone.
                  Our team will never ask for your OTP.
                </p>
              </div>

              <!-- Request Metadata -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;padding:16px;border:1px solid #1e293b;">
                <tr>
                  <td style="padding:6px 0;">
                    <span style="color:#64748b;font-size:12px;">Request IP:</span>
                    <span style="color:#94a3b8;font-size:12px;float:right;">${ipAddress}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="color:#64748b;font-size:12px;">Time:</span>
                    <span style="color:#94a3b8;font-size:12px;float:right;">${new Date().toUTCString()}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px 40px;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;line-height:1.6;">
                This email was sent automatically by ${APP_NAME}.<br />
                Do not reply to this email. © ${year} ${APP_NAME}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Confirmation Email Template ──────────────────────────────────────────────

function buildPasswordChangedEmailHTML(email: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Password Changed</title></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">
          <tr>
            <td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:32px 40px;text-align:center;">
              <span style="font-size:48px;">✅</span>
              <h1 style="margin:12px 0 0;color:#ffffff;font-size:22px;font-weight:700;">Password Changed Successfully</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                The password for your admin account (<strong style="color:#e2e8f0;">${email}</strong>) was updated successfully.
                All existing sessions have been revoked.
              </p>
              <div style="background:#1a1a2e;border-left:4px solid #ef4444;border-radius:6px;padding:16px 20px;">
                <p style="margin:0;color:#fca5a5;font-size:13px;">
                  If you did <strong>NOT</strong> make this change, contact your system administrator immediately.
                </p>
              </div>
              <p style="margin:24px 0 0;color:#64748b;font-size:13px;">Time: ${new Date().toUTCString()}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#0f172a;padding:24px 40px;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">© ${year} ${APP_NAME}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Send Functions ───────────────────────────────────────────────────────────

async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.error('RESEND_API_KEY is not configured');
    return false;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error('Resend delivery failed', { status: response.status, body });
      return false;
    }

    return true;
  } catch (err) {
    logger.error('Email send error', { error: String(err) });
    return false;
  }
}

/**
 * Sends the OTP email to the admin.
 * Returns true on successful handoff to the mail provider.
 */
export async function sendAdminPasswordResetOTP(opts: {
  to: string;
  otp: string;
  ipAddress: string;
  expiryMinutes?: number;
}): Promise<boolean> {
  const { to, otp, ipAddress, expiryMinutes = 5 } = opts;
  const html = buildOTPEmailHTML({ otp, email: to, ipAddress, expiryMinutes });
  return sendViaResend(to, `[${APP_NAME}] Your Password Reset OTP`, html);
}

/**
 * Sends a post-reset confirmation email.
 */
export async function sendPasswordChangedConfirmation(to: string): Promise<boolean> {
  const html = buildPasswordChangedEmailHTML(to);
  return sendViaResend(to, `[${APP_NAME}] Your Password Has Been Changed`, html);
}
