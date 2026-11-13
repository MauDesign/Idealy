'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // 1. Google Tag Manager DataLayer event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });

    // 2. Google Analytics (gtag) si ya inicializó
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'page_view', {
          page_path: url,
          page_location: window.location.href,
          page_title: document.title,
        });
      } catch {
        // Ignorar si aún no está listo
      }
    }

    // 3. Meta Pixel (Facebook)
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'PageView');
      } catch {
        // Ignorar si fbq aún no está listo
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}

