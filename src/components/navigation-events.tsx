'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/context/loading-context';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoading();
  const previousPath = useRef(pathname + searchParams.toString());

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    if (previousPath.current !== currentPath) {
      showLoader();
    }
    previousPath.current = currentPath;

    // The loader will be hidden by a global layout effect or similar
    // once the new page content has loaded. For now, a timeout is a simple way
    // to ensure the loader is hidden even if the content loads instantly.
    // In a real app, you might use a more sophisticated system.
    const timer = setTimeout(() => {
      hideLoader();
    }, 500); // Adjust timeout as needed

    return () => clearTimeout(timer);
  }, [pathname, searchParams, showLoader, hideLoader]);

  useEffect(() => {
    // Hide loader on initial load or when component mounts
    hideLoader();
  }, [hideLoader]);

  return null;
}
