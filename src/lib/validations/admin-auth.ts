/**
 * Admin Auth Validation Schemas
 * All schemas follow OWASP ASVS V2 Authentication requirements.
 */

import { z } from 'zod';

// Common passwords that will be rejected (OWASP Top-100 check subset)
const COMMON_PASSWORDS = [
  'password123456',
  'qwerty123456',
  'admin123456',
  '123456789012',
  'letmein12345',
  'welcome12345',
  'monkey123456',
  'master123456',
  'dragon123456',
  'pass1234word',
];

/**
 * Client-side schema for the reset-password form.
 * resetToken and email are intentionally excluded — the API reads them
 * from httpOnly cookies, not from the request body.
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      )
      .refine(
        (val) => !COMMON_PASSWORDS.includes(val.toLowerCase()),
        'Password is too common. Please choose a stronger password.'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
