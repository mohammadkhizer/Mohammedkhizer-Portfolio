"use server";

/**
 * Server-only security utilities.
 * These functions access Next.js server-only APIs (headers, cookies).
 * DO NOT import this file from Client Components unless you mean to use them as Server Actions.
 */

import { headers, cookies } from 'next/headers';
import crypto from 'crypto';

// Simple in-memory rate limiter for server actions
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

const RATE_LIMIT_THRESHOLD = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // Per 1 minute window
const MAX_MAP_SIZE = 10000; // Prevent memory bloat

/**
 * Checks if a request should be rate limited based on the client's IP.
 */
export async function isRateLimited(): Promise<boolean> {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();

  const record = rateLimitMap.get(ip);

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
 */
export async function isSecureConnection(): Promise<boolean> {
  const headerList = await headers();
  const xForwardedProto = headerList.get('x-forwarded-proto');
  return xForwardedProto === 'https' || process.env.NODE_ENV === 'development';
}

/**
 * Sets a secure cookie with httpOnly, secure, and SameSite flags.
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
  await setSecureCookie('csrf_token', token, 3600);
  return token;
}

/**
 * SSRF Protection: Validates URLs before server-side fetching to block private/internal IP ranges.
 */
export async function validateSafeUrl(urlInput: string): Promise<boolean> {
  try {
    const parsed = new URL(urlInput);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    const hostname = parsed.hostname.toLowerCase();
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '169.254.169.254', // Cloud metadata service
      '::1',
    ];

    if (blockedHosts.includes(hostname)) return false;

    // Block private IPv4 ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipPattern);
    if (match) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      if (p1 === 10) return false;
      if (p1 === 172 && p2 >= 16 && p2 <= 31) return false;
      if (p1 === 192 && p2 === 168) return false;
      if (p1 === 127) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Webhook Signature Verification: Verifies HMAC SHA-256 webhook signatures using constant-time comparison.
 */
export async function verifyWebhookSignature(
  payload: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
  if (!payload || !signatureHeader || !secret) return false;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature);
    const actualBuf = Buffer.from(signatureHeader);

    if (expectedBuf.length !== actualBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

/**
 * File Upload Security Validation: Verifies MIME type, extension, and file size.
 */
export async function validateFileUpload(file: File, options?: { maxSizeMb?: number; allowedMimeTypes?: string[] }): Promise<{ valid: boolean; error?: string }> {
  const maxSizeMb = options?.maxSizeMb || 5;
  const allowedMimeTypes = options?.allowedMimeTypes || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];

  if (file.size > maxSizeMb * 1024 * 1024) {
    return { valid: false, error: `File size exceeds the ${maxSizeMb}MB limit.` };
  }

  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: `Invalid file type (${file.type}). Allowed: ${allowedMimeTypes.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Mongo Query Sanitization: Strips `$` prefixed keys to prevent query operator injection attacks.
 */
export async function sanitizeMongoQuery(val: unknown): Promise<unknown> {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) {
      return val.map((item) => sanitizeMongoQuery(item));
    }
    const cleanObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(val as Record<string, unknown>)) {
      if (!key.startsWith('$')) {
        cleanObj[key] = sanitizeMongoQuery(value);
      }
    }
    return cleanObj;
  }
  return val;
}

/**
 * Verifies if the current request is from an authenticated admin.
 */
export async function isAdmin(): Promise<boolean> {
  const { isAdmin: checkIsAdmin } = await import('./auth');
  return checkIsAdmin();
}

/**
 * Safely retrieves the authenticated user from the session cookie.
 */
export async function getAuthenticatedUser(): Promise<{ uid: string; email?: string; isAdmin?: boolean } | null> {
  const { getAuthenticatedUser: getAuthUser } = await import('./auth');
  return getAuthUser();
}

/**
 * Sets the session cookie after a successful login.
 */
export async function setSessionCookie(email: string, uid: string, isAdminUser: boolean): Promise<boolean> {
  const { setSessionCookie: setSession } = await import('./auth');
  return setSession(email, uid, isAdminUser);
}
