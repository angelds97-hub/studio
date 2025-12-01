'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/context/loading-context';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hideLoader } = useLoading();

  useEffect(() => {
    // Hide loader whenever the path changes (which means navigation is complete).
    hideLoader();
  }, [pathname, searchParams, hideLoader]);

  return null;
}

    