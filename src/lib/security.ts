
'use server';

/**
 * @fileOverview Security utilities for rate limiting and input sanitization.
 * Note: Uses 'use server' to ensure sensitive checks happen on the backend.
 */

import { headers } from 'next/headers';

// Simple in-memory rate limiter for server actions
// In a real production environment, use Redis or a similar persistent store.
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

const RATE_LIMIT_THRESHOLD = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // Per 1 minute window

/**
 * Checks if a request should be rate limited based on the client's IP.
 * This is a Server Action.
 * @returns {Promise<boolean>} True if limited, false if allowed.
 */
export async function isRateLimited(): Promise<boolean> {
  const headerList = await headers();
  // Get IP from headers (standard practice for proxied environments like Netlify/Firebase)
  const ip = headerList.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();

  const record = rateLimitMap.get(ip);

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
    // Window has passed, reset the counter
    record.count = 1;
    record.lastRequest = now;
  }

  return false;
}
