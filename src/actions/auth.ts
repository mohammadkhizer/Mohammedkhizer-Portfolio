'use server';

import { clearSessionCookie } from '@/lib/auth';



/**
 * Clears the server-side session.
 */
export async function logoutAction() {
  await clearSessionCookie();
  return { success: true };
}
