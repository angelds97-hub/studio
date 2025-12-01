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
    if (href.toString() !== pathname) {
      showLoader();
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
