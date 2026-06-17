'use server';

import { setSessionCookie, deleteCookie } from '@/lib/security';
import { cookies } from 'next/headers';

/**
 * Creates a server-side session after a successful client-side Firebase login.
 * @param idToken The Firebase ID token of the authenticated user.
 */
export async function createSession(idToken: string) {
  if (!idToken) return { success: false };
  const success = await setSessionCookie(idToken);
  return { success };
}


/**
 * Clears the server-side session.
 */
export async function logoutAction() {
  await deleteCookie('fb_session');
  return { success: true };
}
