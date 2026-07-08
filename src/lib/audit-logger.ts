/**
 * Admin Security Audit Logger
 *
 * Writes immutable audit records to MongoDB `adminSecurityLogs`.
 * Records are append-only; we never update or delete them.
 *
 * Security decisions:
 * - Uses MongoDB timestamps for tamper-resistant ordering.
 * - Keeps IP + user-agent for forensics.
 * - Action enum prevents free-text injection.
 */

import dbConnect from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { logger } from '@/lib/logger';

export type AuditAction =
  | 'OTP_REQUESTED'
  | 'OTP_RESENT'
  | 'OTP_VERIFIED'
  | 'OTP_FAILED'
  | 'OTP_EXPIRED'
  | 'OTP_LOCKOUT'
  | 'PASSWORD_RESET_COMPLETED'
  | 'PASSWORD_RESET_FAILED'
  | 'SESSION_REVOKED';

export interface AuditEntry {
  action: AuditAction;
  email: string;            // redacted in non-error logs via logger
  adminId: string | null;   // Admin ID if available
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: Date;
}

export async function writeAuditLog(
  action: AuditAction,
  email: string,
  ipAddress: string,
  userAgent: string,
  adminId: string | null = null,
  metadata?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    const entry: AuditEntry = {
      action,
      email,
      adminId,
      ipAddress,
      userAgent,
      metadata,
      timestamp: new Date(),
    };

    await dbConnect();
    await AuditLog.create(entry);
  } catch (err) {
    // Audit failures must never break the main flow — log internally only.
    logger.error('Audit log write failed', { action, error: String(err) });
  }
}
