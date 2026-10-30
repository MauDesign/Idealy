'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/gtag';

interface PricingCtaButtonProps {
  href: string;
  plan: string;
  preselectedNeed?: string;
  className: string;
  children: ReactNode;
}

export default function PricingCtaButton({
  href,
  plan,
  preselectedNeed,
  className,
  children,
}: PricingCtaButtonProps) {
  const handleClick = () => {
    trackEvent('click_precio', { plan });
    if (preselectedNeed && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('idealy-select-need', { detail: preselectedNeed })
      );
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

