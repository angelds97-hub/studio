'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // In a static export, we can't check for a real user.
  // This layout assumes access is granted if the page is visited.
  // The logic to "protect" these routes would be to not link to them
  // from public pages if a user isn't meant to see them.

  // The below logic is for a dynamic app and would cause issues in static export.
  // For now, we allow access and rely on role-based UI rendering in child components.

  // const { user, isUserLoading } = useUser();
  // const firestore = useFirestore();

  // const profileRef = useMemoFirebase(() => {
  //   if (!firestore || !user) return null;
  //   return doc(firestore, 'users', user.uid);
  // }, [firestore, user]);

  // const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef);

  // useEffect(() => {
  //   const totalLoading = isUserLoading || isProfileLoading;
  //   if (!totalLoading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, isUserLoading, isProfileLoading, router]);

  // if (isUserLoading || isProfileLoading || !user || !profile) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center">
  //       <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
  //     </div>
  //   );
  // }
  
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const profileRole = 'administrador'; // Mock role for static site

  if (profileRole !== 'administrador' && pathname.startsWith('/dashboard/usuaris')) {
     return (
       <AppShell>
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Accés Denegat</AlertTitle>
            <AlertDescription>
              No tens permisos per accedir a aquesta pàgina.
            </AlertDescription>
          </Alert>
       </AppShell>
     );
  }
   if (profileRole === 'extern' && pathname !== '/configuracio') {
     router.push('/configuracio');
     return null;
   }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
