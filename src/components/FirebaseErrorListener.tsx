'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { ERROR_MESSAGES } from '@/lib/constants';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * SECURITY: Logs minimal info to prevent session/UID leakage.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // SECURITY: Don't expose internal paths or UIDs in console
      // Only log generic error message
      console.warn(ERROR_MESSAGES.AUTH_UNAUTHORIZED);

      // In production, log to monitoring service without sensitive data
      if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with your error monitoring service
        // Log minimal info - no UIDs or paths
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
