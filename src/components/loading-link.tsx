'use client';

import Link, { type LinkProps } from 'next/link';
import { useLoading } from '@/context/loading-context';
import { usePathname } from 'next/navigation';
import React from 'react';

type LoadingLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

export function LoadingLink({
  children,
  href,
  onClick,
  ...props
}: LoadingLinkProps) {
  const { showLoader } = useLoading();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the link is to the current page, don't show the loader
    if (href.toString() === pathname) {
      onClick?.(e);
      return;
    }

    showLoader();
    onClick?.(e);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

    