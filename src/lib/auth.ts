import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from './mongodb';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-dev-secret-key-12345';
const COOKIE_NAME = 'admin_session';

export interface JWTPayload {
  uid: string;
  email: string;
  isAdmin: boolean;
}

/**
 * Generate a JWT token for the admin session.
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5d' });
}

/**
 * Verifies a JWT token.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Helper to check if current request has admin privileges.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  if (!user) return false;

  await dbConnect();
  const admin = await Admin.findOne({ email: user.email.toLowerCase().trim() });
  return !!(admin && admin.isAdmin);
}

/**
 * Retrieves the authenticated user from the JWT cookie.
 */
export async function getAuthenticatedUser(): Promise<{ uid: string; email: string; isAdmin: boolean } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return {
    uid: payload.uid,
    email: payload.email,
    isAdmin: !!payload.isAdmin,
  };
}

/**
 * Sets the admin session cookie.
 */
export async function setSessionCookie(email: string, uid: string, isAdminUser: boolean): Promise<boolean> {
  try {
    const token = generateToken({
      uid,
      email,
      isAdmin: isAdminUser,
    });

    const cookieStore = await cookies();
    const expiresIn = 60 * 60 * 24 * 5; // 5 days in seconds

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/',
    });

    return true;
  } catch (error) {
    console.error('Failed to set admin session cookie:', error);
    return false;
  }
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
