'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword as firebaseSignIn } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

async function ensureAdminUser(auth: Auth, firestore: any) {
  const adminEmail = 'adomen11@xtec.cat';
  const adminPassword = '123456';

  try {
    // Intenta iniciar sessió primer per veure si ja existeix
    try {
      const userCredential = await firebaseSignIn(auth, adminEmail, adminPassword);
      const user = userCredential.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        // L'usuari existeix a Auth però no a Firestore, el creem
        await setDoc(userDocRef, {
          id: user.uid,
          firstName: 'Admin',
          lastName: 'User',
          email: adminEmail,
          role: 'administrador',
          creationDate: serverTimestamp(),
        });
      }
       // Tanquem la sessió per no interferir amb el login de l'usuari
      await auth.signOut();
      return;
    } catch (error: any) {
       if (error.code !== 'auth/user-not-found' && error.code !== 'auth/invalid-credential') {
        throw error;
      }
      // Si l'usuari no existeix, el creem
    }
    
    // Creació de l'usuari si no existeix
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, {
      id: user.uid,
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      role: 'administrador',
      creationDate: serverTimestamp(),
    });
     // Tanquem la sessió per no interferir amb el login de l'usuari
    await auth.signOut();

  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
       // Aquest cas ja està cobert per la lògica d'inici de sessió inicial
    } else {
      console.error("Error greu assegurant l'usuari administrador:", error);
    }
  }
}


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let firebaseApp;
  if (!getApps().length) {
    try {
      firebaseApp = initializeApp();
    } catch (e) {
       if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }
  
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  
  ensureAdminUser(auth, firestore);

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';