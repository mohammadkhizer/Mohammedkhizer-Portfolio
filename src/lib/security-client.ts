/**
 * Client-compatible security utilities.
 * These functions can be safely imported by Client Components.
 */

/**
 * Sanitizes user input to prevent XSS attacks.
 * Removes potentially dangerous HTML characters.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Generates a CSRF token for form protection.
 * Note: This generates a client-side token. For server-side validation,
 * use the server action that validates against server-stored tokens.
 */
export function generateCsrfToken(): string {
  const buffer = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validates a CSRF token format.
 * This only validates the token format, not its authenticity.
 * For full validation, use server-side validation.
 */
export function validateCsrfToken(token: string | undefined): boolean {
  if (!token || token.length !== 64) {
    return false;
  }
  return /^[0-9a-f]{64}$/.test(token);
}

/**
 * Sanitizes AI input to prevent prompt injection attacks.
 * Removes patterns that could manipulate AI behavior.
 */
export function sanitizeAiInput(input: string): string {
  const patterns = [
    /ignore\s+(previous|above|prior)/gi,
    /forget\s+(everything|all|instructions)/gi,
    /you\s+are\s+(now|no\s+longer)/gi,
    /system\s*(prompt|instruction)/gi,
    /override\s+(your|the)\s+(rules|instructions)/gi,
    /bypass\s+(security|filters|restrictions)/gi,
    /act\s+as\s+(a|an)/gi,
    /disable\s+(your|the)\s+(safety|filters)/gi,
  ];

  let sanitized = input;
  patterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized.trim();
}
