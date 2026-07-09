/**
 * Admin Auth — Password Schema Unit Tests
 *
 * Run: npx vitest src/lib/__tests__/admin-auth.test.ts
 */

import { describe, it, expect } from 'vitest';
import { resetPasswordSchema } from '../validations/admin-auth';

// ─── Reset Password Schema ────────────────────────────────────────────────────

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
