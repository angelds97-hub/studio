'use client';

import { AppShell } from '@/components/layout/app-shell';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef);

  useEffect(() => {
    const totalLoading = isUserLoading || isProfileLoading;
    if (!totalLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, isProfileLoading, router]);

  if (isUserLoading || isProfileLoading || !user || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Si l'usuari no té un rol d'administrador i intenta accedir a la pàgina d'usuaris, redirigeix-lo.
  // Es podria fer una lògica més complexa per a altres rutes.
  const pathname = window.location.pathname;
  if (profile.role !== 'administrador' && pathname.startsWith('/dashboard/usuaris')) {
     router.push('/dashboard'); // O a una pàgina d'accés denegat
     return null;
  }
   if (profile.role === 'extern' && pathname !== '/configuracio') {
     router.push('/configuracio');
     return null;
   }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
