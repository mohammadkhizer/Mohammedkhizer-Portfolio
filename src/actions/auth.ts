'use server';

import { setSessionCookie, clearSessionCookie } from '@/lib/auth';

/**
 * Creates a server-side session.
 * @param email User email
 * @param uid User ID
 * @param isAdmin Admin status
 */
export async function createSession(email: string, uid: string, isAdmin: boolean) {
  if (!email || !uid) return { success: false };
  const success = await setSessionCookie(email, uid, isAdmin);
  return { success };
}

/**
 * Clears the server-side session.
 */
export async function logoutAction() {
  await clearSessionCookie();
  return { success: true };
}
