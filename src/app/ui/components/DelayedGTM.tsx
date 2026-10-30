'use client';

import { useEffect } from 'react';

interface DelayedGTMProps {
  id: string;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __gtmLoaded?: boolean;
  }
}

export default function DelayedGTM({ id }: DelayedGTMProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || window.__gtmLoaded) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const eventOptions: AddEventListenerOptions = { once: true, passive: true };

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      window.removeEventListener('scroll', loadGTM);
      window.removeEventListener('pointerdown', loadGTM);
      window.removeEventListener('keydown', loadGTM);
      window.removeEventListener('touchstart', loadGTM);
    };

    const loadGTM = () => {
      if (window.__gtmLoaded) return;
      window.__gtmLoaded = true;

      cleanup();

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': Date.now(),
        event: 'gtm.js',
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
      document.head.appendChild(script);
    };

    window.addEventListener('scroll', loadGTM, eventOptions);
    window.addEventListener('pointerdown', loadGTM, eventOptions);
    window.addEventListener('keydown', loadGTM, eventOptions);
    window.addEventListener('touchstart', loadGTM, eventOptions);

    timeoutId = setTimeout(loadGTM, 4000);

    return () => {
      cleanup();
    };
  }, [id]);

  return null;
}

