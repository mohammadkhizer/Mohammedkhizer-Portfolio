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
 * Note: httpOnly cookies are not accessible from client-side JavaScript.
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
    sameSite: 'strict',
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
 * @param token The token provided by the client.
 * @returns {Promise<boolean>} True if valid.
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
