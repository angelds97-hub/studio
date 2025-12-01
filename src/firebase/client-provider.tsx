'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { firebaseConfig } from './config';
import { getSdks } from '.';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Aquesta lògica garanteix que la inicialització es fa una sola vegada
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return getSdks(app);
  }, []); // El array de dependències buit assegura que només s'executi una vegada

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
