/**
 * @fileOverview Security utilities for rate limiting and input sanitization.
 */

import { headers } from 'next/headers';

// Simple in-memory rate limiter for server actions
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

const RATE_LIMIT_THRESHOLD = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // Per 1 minute

/**
 * Checks if a request should be rate limited based on the client's IP.
 * @returns {Promise<boolean>} True if limited, false if allowed.
 */
export async function isRateLimited(): Promise<boolean> {
  const headerList = await headers();
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
    record.count = 1;
    record.lastRequest = now;
  }

  return false;
}

/**
 * Simple sanitization to prevent XSS by escaping HTML tags.
 * @param {string} input The raw string input.
 * @returns {string} The sanitized string.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}
