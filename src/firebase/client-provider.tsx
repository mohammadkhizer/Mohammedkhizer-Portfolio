'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // useEffect only runs in the browser (never during SSR/SSG).
    // This prevents Firebase from initializing at build time.
    try {
      const services = initializeFirebase();
      setFirebaseServices(services);
    } catch (e) {
      // Firebase env vars not available - app will work without Firebase features
      console.warn('Firebase could not be initialized:', e);
    }
  }, []);

  // Firebase not yet initialized (SSR or before first effect).
  // Render children without Firebase context - components must handle this gracefully.
  if (!firebaseServices) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}