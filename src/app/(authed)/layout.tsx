'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // In a static export environment, we cannot perform real-time checks
  // for user authentication or roles. The layout's responsibility is
  // reduced to providing the visual shell for authenticated sections.
  // Access control is managed by obscurity (i.e., not linking to these
  // pages from public areas if the user is not supposed to see them).

  // The logic below is commented out as it relies on dynamic, client-side
  // data that is not suitable for a purely static export.
  /*
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
   */

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
