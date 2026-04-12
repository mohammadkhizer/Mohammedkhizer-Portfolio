'use server';

import { isRateLimited, validateServerCsrfToken } from '@/lib/security';
import { sanitizeInput } from '@/lib/utils';
import { dbAdmin } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

/**
 * Handles Certification creation or update securely on the server.
 */
export async function manageCertification(formData: FormData, editingId: string | null = null) {
  // 1. Rate Limiting
  const limited = await isRateLimited();
  if (limited) {
    return { success: false, error: 'Too many requests. Please try again in a minute.' };
  }

  // 2. Extra Security: CSRF Validation
  const clientToken = formData.get('csrfToken') as string;
  const isCsrfValid = await validateServerCsrfToken(clientToken);
  if (!isCsrfValid) {
    return { success: false, error: 'Security validation failed.' };
  }

  // 3. Extract and Sanitize Inputs
  const name = sanitizeInput(formData.get('name') as string);
  const issuer = sanitizeInput(formData.get('issuingBody') as string);
  const credentialUrl = sanitizeInput(formData.get('credentialUrl') as string);
  const imageUrl = sanitizeInput(formData.get('imageUrl') as string);
  
  // 4. Basic Validation
  if (!name || !issuer) {
    return { success: false, error: 'Name and Issuing Body are required.' };
  }

  const certData = {
    name,
    issuingBody: issuer,
    credentialUrl: credentialUrl || "#",
    imageUrl: imageUrl || "",
    issueDate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    if (editingId) {
      await dbAdmin.collection('certifications').doc(editingId).update(certData);
    } else {
      const newId = crypto.randomUUID();
      await dbAdmin.collection('certifications').doc(newId).set({
        ...certData,
        id: newId,
        createdAt: new Date().toISOString()
      });
    }

    revalidatePath('/admin/certifications');
    return { success: true };
  } catch (error) {
    console.error('Error managing certification:', error);
    return { success: false, error: 'Failed to save achievement. Please try again.' };
  }
}

/**
 * Deletes a certification securely on the server.
 */
export async function deleteCertification(id: string) {
  const limited = await isRateLimited();
  if (limited) {
    return { success: false, error: 'Too many requests.' };
  }

  try {
    await dbAdmin.collection('certifications').doc(id).delete();
    revalidatePath('/admin/certifications');
    return { success: true };
  } catch (error) {
    console.error('Error deleting certification:', error);
    return { success: false, error: 'Failed to delete certification.' };
  }
}
