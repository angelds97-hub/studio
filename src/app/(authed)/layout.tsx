'use client';

import { AppShell } from '@/components/layout/app-shell';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      router.replace('/login');
    }
  }, [router]);

  if (!isClient) {
    // Render nothing or a loading spinner on the server/first-pass
    return null; 
  }

  return <AppShell>{children}</AppShell>;
}
