"use server";

/**
 * Server-only security utilities.
 * These functions access Next.js server-only APIs (headers, cookies).
 * DO NOT import this file from Client Components unless you mean to use them as Server Actions.
 */

import { headers, cookies } from 'next/headers';

// Simple in-memory rate limiter for server actions
// In a real production environment, use Redis or a similar persistent store.
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

const RATE_LIMIT_THRESHOLD = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // Per 1 minute window
const MAX_MAP_SIZE = 10000; // Prevent memory bloat

/**
 * Checks if a request should be rate limited based on the client's IP.
 * @returns {Promise<boolean>} True if limited, false if allowed.
 */
export async function isRateLimited(): Promise<boolean> {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();

  const record = rateLimitMap.get(ip);

  // Clean up old entries periodically to prevent memory bloat
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    rateLimitMap.clear();
  }

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return false;
  }

  if (now - record.lastRequest < RATE_LIMIT_WINDOW) {
    if (record.count >= RATE_LIMIT_THRESHOLD) {
      return true;
    }
    record.count += 1;
  } else {
    record.count = 1;
    record.lastRequest = now;
  }

  return false;
}

/**
 * Validates that a request is made over HTTPS.
 * In production, should always use secure connections.
 */
export async function isSecureConnection(): Promise<boolean> {
  const headerList = await headers();
  const xForwardedProto = headerList.get('x-forwarded-proto');
  return xForwardedProto === 'https' || process.env.NODE_ENV === 'development';
}

/**
 * Sets a secure cookie with httpOnly and secure flags.
 * Use this for sensitive data like session tokens.
 */
export async function setSecureCookie(
  name: string,
  value: string,
  maxAge: number = 3600
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Use lax for session cookies to avoid issues with some redirects
    maxAge,
    path: '/',
  });
}

/**
 * Gets a cookie value (for server-side use only).
 */
export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

/**
 * Deletes a cookie securely.
 */
export async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

/**
 * Generates a cryptographically secure CSRF token.
 */
export async function generateServerCsrfToken(): Promise<string> {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validates a CSRF token against a stored cookie.
 */
export async function validateServerCsrfToken(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const storedToken = cookieStore.get('csrf_token')?.value;
  
  if (!storedToken || !token) return false;
  return storedToken === token;
}

/**
 * Sets a CSRF token cookie.
 */
export async function setCsrfCookie(): Promise<string> {
  const token = await generateServerCsrfToken();
  await setSecureCookie('csrf_token', token, 3600); // 1 hour
  return token;
}

/**
 * Verifies if the current request is from an authenticated admin.
 * USES SERVER-SIDE COOKIE VERIFICATION with Firebase Admin SDK.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  if (!user) return false;

  const { ADMIN_CONFIG } = await import('./constants');
  const { dbAdmin } = await import('./firebase-admin');

  // Master UID bypass
  if (user.uid === ADMIN_CONFIG.MASTER_UID) return true;

  try {
    const adminDoc = await dbAdmin.collection(ADMIN_CONFIG.COLLECTION_NAME).doc(user.uid).get();
    return adminDoc.exists && adminDoc.data()?.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Safely retrieves the authenticated user from the session cookie.
 */
export async function getAuthenticatedUser(): Promise<{ uid: string; email?: string } | null> {
  const sessionCookie = await getCookie('fb_session');
  if (!sessionCookie) return null;

  const { authAdmin } = await import('./firebase-admin');
  
  try {
    // Verify the session cookie. This is a server-side only check.
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    return { 
      uid: decodedClaims.uid,
      email: decodedClaims.email
    };
  } catch (error) {
    // Session cookie is invalid or expired
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Sets the session cookie after a successful client-side login.
 * This function creates a Firebase session cookie from an ID token.
 */
export async function setSessionCookie(idToken: string): Promise<boolean> {
  const { authAdmin } = await import('./firebase-admin');
  
  try {
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie. This will also verify the ID token.
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });
    
    await setSecureCookie('fb_session', sessionCookie, expiresIn / 1000);
    return true;
  } catch (error) {
    console.error('Failed to create session cookie:', error);
    return false;
  }
}


