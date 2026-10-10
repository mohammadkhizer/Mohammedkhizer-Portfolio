/**
 * Email Service — Gmail SMTP via Nodemailer
 *
 * Environment variables required:
 *   GMAIL_USER=work.mkhizer@gmail.com
 *   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  (Google App Password)
 *   NEXT_PUBLIC_APP_NAME=Mohammed Khizer Shaikh Portfolio
 */

import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Mohammed Khizer Shaikh Portfolio';

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

// ─── Contact Form Notification Email Template ─────────────────────────────────

function buildContactNotificationEmailHTML(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionDate?: string;
}): string {
  const { name, email, subject, message, submissionDate } = opts;
  const dateStr = submissionDate
    ? new Date(submissionDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString();
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">📩 New Contact Form Message</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${APP_NAME}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;padding:20px;border:1px solid #1e293b;margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;">
                    <span style="color:#94a3b8;font-size:13px;font-weight:600;">From:</span>
                    <strong style="color:#f8fafc;font-size:14px;float:right;">${name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;">
                    <span style="color:#94a3b8;font-size:13px;font-weight:600;">Email:</span>
                    <a href="mailto:${email}" style="color:#60a5fa;font-size:14px;float:right;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;">
                    <span style="color:#94a3b8;font-size:13px;font-weight:600;">Subject:</span>
                    <span style="color:#f8fafc;font-size:14px;float:right;">${subject}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="color:#94a3b8;font-size:13px;font-weight:600;">Date:</span>
                    <span style="color:#cbd5e1;font-size:13px;float:right;">${dateStr}</span>
                  </td>
                </tr>
              </table>

              <div style="background:#0f172a;border-left:4px solid #3b82f6;border-radius:6px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 10px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Message Content</p>
                <div style="color:#e2e8f0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</div>
              </div>

              <div style="text-align:center;margin-top:28px;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="background:#3b82f6;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">
                  ✉️ Reply to ${name}
                </a>
              </div>
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

function buildContactAutoReplyEmailHTML(name: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank you for your message</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">
          <tr>
            <td style="background:linear-gradient(135deg,#10b981 0%,#3b82f6 100%);padding:32px 40px;text-align:center;">
              <span style="font-size:48px;">👋</span>
              <h1 style="margin:12px 0 0;color:#ffffff;font-size:22px;font-weight:700;">Thank You for Reaching Out!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#cbd5e1;font-size:15px;line-height:1.6;">Hi <strong style="color:#e2e8f0;">${name}</strong>,</p>
              <p style="margin:0 0 20px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                Thank you for sending a message through my portfolio. I have received your submission and will get back to you within 24-48 hours.
              </p>
              <div style="background:#0f172a;border-left:4px solid #10b981;border-radius:6px;padding:16px 20px;margin:24px 0;">
                <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">
                  Need an immediate response? Connect with me directly on <a href="https://in.linkedin.com/in/mohammed-khizer-shaikh" style="color:#60a5fa;text-decoration:none;">LinkedIn</a> or email <a href="mailto:work.mkhizer@gmail.com" style="color:#60a5fa;text-decoration:none;">work.mkhizer@gmail.com</a>.
                </p>
              </div>
              <p style="margin:24px 0 0;color:#cbd5e1;font-size:15px;line-height:1.6;">
                Best regards,<br />
                <strong style="color:#f8fafc;">Mohammed Khizer Shaikh</strong><br />
                <span style="color:#94a3b8;font-size:13px;">Full-Stack Web Developer & AI/ML Engineer</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#0f172a;padding:24px 40px;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">© ${year} Mohammed Khizer Shaikh</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Send Functions (Gmail SMTP via Nodemailer) ─────────────────────────────────

async function sendViaNodemailer(
  to: string | string[],
  subject: string,
  html: string,
  replyTo?: string
): Promise<boolean> {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER || process.env.EMAIL_FROM || 'work.mkhizer@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || process.env.GMAIL_PASS;

  if (!pass) {
    logger.error('GMAIL_APP_PASSWORD (or EMAIL_PASS) is not configured in .env file');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"${APP_NAME}" <${user}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      replyTo: replyTo || user,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email delivered via Gmail Nodemailer', { messageId: info.messageId });
    return true;
  } catch (err) {
    logger.error('Gmail SMTP send error', { error: String(err) });
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
  return sendViaNodemailer(to, `[${APP_NAME}] Your Password Reset OTP`, html);
}

/**
 * Sends a post-reset confirmation email.
 */
export async function sendPasswordChangedConfirmation(to: string): Promise<boolean> {
  const html = buildPasswordChangedEmailHTML(to);
  return sendViaNodemailer(to, `[${APP_NAME}] Your Password Has Been Changed`, html);
}

/**
 * Sends a notification email to the website owner when a contact form is submitted.
 */
export async function sendContactFormNotificationEmail(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionDate?: string;
}): Promise<boolean> {
  const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL ?? 'work.mkhizer@gmail.com';
  const html = buildContactNotificationEmailHTML(opts);
  const subjectLine = `[Portfolio Contact] Message from ${opts.name}: ${opts.subject || 'No Subject'}`;
  
  return sendViaNodemailer(recipientEmail, subjectLine, html, opts.email);
}

/**
 * Sends an auto-reply confirmation email to the person who submitted the contact form.
 */
export async function sendContactAutoReplyEmail(name: string, email: string): Promise<boolean> {
  const html = buildContactAutoReplyEmailHTML(name);
  return sendViaNodemailer(email, `Thank you for contacting Mohammed Khizer Shaikh`, html);
}


