'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/gtag';

interface NeedCardLinkProps {
  id: string;
  href: string;
  className: string;
  children: ReactNode;
}

export default function NeedCardLink({ id, href, className, children }: NeedCardLinkProps) {
  const handleClick = () => {
    trackEvent('click_necesidad', { tarjeta: id });
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

