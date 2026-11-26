/**
 * Content guard helpers — used throughout the app to prevent placeholder text
 * from rendering on public-facing pages.
 */

/**
 * Returns true only if `value` is a non-empty string that contains no
 * placeholder markers ({{ or TODO).
 */
export function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value !== 'string') return true; // non-string truthy values pass
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.includes('{{')) return false;
  if (trimmed.toLowerCase().includes('todo')) return false;
  return true;
}
