'use server';

import { setCsrfCookie, validateServerCsrfToken, isRateLimited } from '@/lib/security';
import { sanitizeInput } from '@/lib/utils';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * Initializes Firebase for Server Actions.
 */
function getFirebaseServer() {
  const apps = getApps();
  const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
  return getFirestore(app);
}

/**
 * Refreshes or sets the CSRF token cookie and returns the token to the client.
 */
export async function refreshCsrfToken() {
  return await setCsrfCookie();
}

/**
 * Handles Contact Form submissions securely on the server.
 */
export async function submitContactForm(formData: FormData) {
  // 1. Rate Limiting
  const limited = await isRateLimited();
  if (limited) {
    return { success: false, error: 'Too many requests. Please try again in a minute.' };
  }

  // 2. CSRF Validation
  const clientToken = formData.get('csrfToken') as string;
  const isCsrfValid = await validateServerCsrfToken(clientToken);
  
  if (!isCsrfValid) {
    return { success: false, error: 'Security validation failed. Please refresh the page.' };
  }

  // 3. Extract and Sanitize Inputs
  const name = sanitizeInput(formData.get('name') as string);
  const email = sanitizeInput(formData.get('email') as string);
  const subject = sanitizeInput(formData.get('subject') as string);
  const message = sanitizeInput(formData.get('message') as string);

  // 4. Basic Validation
  if (!name || !email || !message) {
    return { success: false, error: 'Missing required fields.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email address.' };
  }

  if (name.length > 100 || email.length > 255 || subject.length > 200 || message.length > 2000) {
    return { success: false, error: 'Input exceeds maximum allowed length.' };
  }

  // 5. Database Write (on server)
  try {
    const db = getFirebaseServer();
    const submissionsRef = collection(db, 'contactSubmissions');
    
    await addDoc(submissionsRef, {
      id: crypto.randomUUID(),
      senderName: name,
      senderEmail: email,
      subject: subject || 'No Subject',
      message: message,
      submissionDate: new Date().toISOString(),
      isRead: false,
      apiVersion: 2 // Updated to server-side action
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}
