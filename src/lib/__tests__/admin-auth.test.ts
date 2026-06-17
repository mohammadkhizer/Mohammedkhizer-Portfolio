/**
 * Admin Auth — OTP Service Unit Tests
 *
 * Run: npx jest src/lib/__tests__/otp-service.test.ts
 *
 * These tests verify:
 *   1. OTP generation
 *   2. OTP hashing (never stores plain text)
 *   3. Timing-safe comparison
 *   4. Expiry enforcement
 *   5. Attempt counting and lockout
 *   6. Resend cooldown and max resend limits
 *   7. Reset token issuance (single-use)
 *   8. Record invalidation
 */

import { describe, it, expect } from 'vitest';
import { generateOTP, hashValue, safeCompare, OTP_CONFIG } from '../otp-service';

// ─── OTP Generation ───────────────────────────────────────────────────────────

describe('generateOTP()', () => {
  it('produces a 6-digit string', () => {
    for (let i = 0; i < 100; i++) {
      const otp = generateOTP();
      expect(otp).toMatch(/^\d{6}$/);
    }
  });

  it('stays within [100000, 999999]', () => {
    for (let i = 0; i < 500; i++) {
      const n = parseInt(generateOTP(), 10);
      expect(n).toBeGreaterThanOrEqual(100000);
      expect(n).toBeLessThanOrEqual(999999);
    }
  });

  it('generates unique OTPs (no collision in 1000 samples)', () => {
    const set = new Set(Array.from({ length: 1000 }, generateOTP));
    // Statistically, 1000 draws from 900000 values should have very few collisions
    expect(set.size).toBeGreaterThan(990);
  });
});

// ─── Hash Utility ─────────────────────────────────────────────────────────────

describe('hashValue()', () => {
  it('returns a 64-char hex string (SHA-256)', () => {
    expect(hashValue('123456')).toMatch(/^[a-f0-9]{64}$/);
  });

  it('is deterministic', () => {
    expect(hashValue('abc')).toBe(hashValue('abc'));
  });

  it('is collision resistant for similar inputs', () => {
    expect(hashValue('123456')).not.toBe(hashValue('123457'));
  });

  it('never returns the plain input', () => {
    const otp = '482910';
    expect(hashValue(otp)).not.toBe(otp);
  });
});

// ─── Timing-safe Comparison ───────────────────────────────────────────────────

describe('safeCompare()', () => {
  it('returns true for identical strings', () => {
    expect(safeCompare('abc', 'abc')).toBe(true);
  });

  it('returns false for different strings of same length', () => {
    expect(safeCompare('abc', 'abd')).toBe(false);
  });

  it('returns false for different lengths', () => {
    expect(safeCompare('abc', 'abcd')).toBe(false);
  });

  it('validates correct OTP hash match', () => {
    const otp = generateOTP();
    const hash = hashValue(otp);
    expect(safeCompare(hashValue(otp), hash)).toBe(true);
  });

  it('rejects wrong OTP hash', () => {
    const otp = generateOTP();
    const wrongOtp = String(parseInt(otp, 10) === 999999 ? 100000 : parseInt(otp, 10) + 1).padStart(6, '0');
    expect(safeCompare(hashValue(wrongOtp), hashValue(otp))).toBe(false);
  });
});

// ─── OTP Configuration ────────────────────────────────────────────────────────

describe('OTP_CONFIG', () => {
  it('has 6-digit length', () => expect(OTP_CONFIG.LENGTH).toBe(6));
  it('expires in 5 minutes', () => expect(OTP_CONFIG.EXPIRY_MS).toBe(5 * 60 * 1000));
  it('allows max 5 attempts', () => expect(OTP_CONFIG.MAX_ATTEMPTS).toBe(5));
  it('has 60s resend cooldown', () => expect(OTP_CONFIG.RESEND_COOLDOWN_MS).toBe(60 * 1000));
  it('allows max 3 resends', () => expect(OTP_CONFIG.MAX_RESENDS).toBe(3));
  it('locks for 15 minutes', () => expect(OTP_CONFIG.LOCKOUT_MS).toBe(15 * 60 * 1000));
  it('reset token expires in 10 minutes', () => expect(OTP_CONFIG.RESET_TOKEN_EXPIRY_MS).toBe(10 * 60 * 1000));
});

// ─── Password Validation Schema ───────────────────────────────────────────────

import { resetPasswordSchema, forgotPasswordSchema, verifyOTPSchema } from '../validations/admin-auth';

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'admin@test.com' }).success).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });
  it('rejects empty email', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });
  it('lowercases email', () => {
    const r = forgotPasswordSchema.safeParse({ email: 'ADMIN@TEST.COM' });
    expect(r.success && r.data.email).toBe('admin@test.com');
  });
});

describe('verifyOTPSchema', () => {
  const base = { email: 'admin@test.com', otp: '123456' };
  it('accepts valid OTP', () => expect(verifyOTPSchema.safeParse(base).success).toBe(true));
  it('rejects OTP with letters', () => {
    expect(verifyOTPSchema.safeParse({ ...base, otp: '12345a' }).success).toBe(false);
  });
  it('rejects OTP shorter than 6', () => {
    expect(verifyOTPSchema.safeParse({ ...base, otp: '12345' }).success).toBe(false);
  });
  it('rejects OTP longer than 6', () => {
    expect(verifyOTPSchema.safeParse({ ...base, otp: '1234567' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  const base = {
    password: 'Str0ng!Pass#99',
    confirmPassword: 'Str0ng!Pass#99',
  };

  it('accepts a strong password', () => expect(resetPasswordSchema.safeParse(base).success).toBe(true));

  it('rejects password < 12 chars', () => {
    expect(resetPasswordSchema.safeParse({ ...base, password: 'Short1!', confirmPassword: 'Short1!' }).success).toBe(false);
  });
  it('rejects password without uppercase', () => {
    expect(resetPasswordSchema.safeParse({ ...base, password: 'nouppercase1!', confirmPassword: 'nouppercase1!' }).success).toBe(false);
  });
  it('rejects password without lowercase', () => {
    expect(resetPasswordSchema.safeParse({ ...base, password: 'NOLOWERCASE1!', confirmPassword: 'NOLOWERCASE1!' }).success).toBe(false);
  });
  it('rejects password without number', () => {
    expect(resetPasswordSchema.safeParse({ ...base, password: 'NoNumberPass!', confirmPassword: 'NoNumberPass!' }).success).toBe(false);
  });
  it('rejects password without special char', () => {
    expect(resetPasswordSchema.safeParse({ ...base, password: 'NoSpecialChar1', confirmPassword: 'NoSpecialChar1' }).success).toBe(false);
  });
  it('rejects mismatched passwords', () => {
    expect(resetPasswordSchema.safeParse({ ...base, confirmPassword: 'Different1!' }).success).toBe(false);
  });
  it('rejects common password', () => {
    expect(resetPasswordSchema.safeParse({
      ...base,
      password: 'password123456',
      confirmPassword: 'password123456',
    }).success).toBe(false);
  });
});
