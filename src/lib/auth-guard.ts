import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { getAuthenticatedUser } from '@/lib/auth';

export interface AdminUser {
  email: string;
  name?: string | null;
  image?: string | null;
  isAdmin: boolean;
}

/**
 * Checks if the current request is from the authorized single owner.
 * Re-checked server-side on every route handler and server action.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!adminEmail) return null;

  try {
    const session = await auth();
    if (session?.user?.email && session.user.email.trim().toLowerCase() === adminEmail) {
      return {
        email: session.user.email.trim().toLowerCase(),
        name: session.user.name,
        image: session.user.image,
        isAdmin: true,
      };
    }
  } catch {
    // NextAuth session lookup fallback
  }

  try {
    const legacyUser = await getAuthenticatedUser();
    if (legacyUser?.email && legacyUser.email.trim().toLowerCase() === adminEmail) {
      return {
        email: legacyUser.email.trim().toLowerCase(),
        name: 'Mohammed Khizer Shaikh',
        image: null,
        isAdmin: true,
      };
    }
  } catch {
    // Legacy session lookup fallback
  }

  return null;
}

/**
 * Enforces admin authorization. Throws an error if not authorized.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Unauthorized: Restricted to administrator only');
  }
  return admin;
}

/**
 * Logs an action to the audit trail.
 */
export async function logAuditAction(
  action: string,
  email: string,
  metadata?: Record<string, any>,
  ipAddress: string = 'server-action',
  userAgent: string = 'internal'
): Promise<void> {
  try {
    await dbConnect();
    await AuditLog.create({
      action,
      email,
      adminId: email,
      ipAddress,
      userAgent,
      metadata: metadata || {},
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
