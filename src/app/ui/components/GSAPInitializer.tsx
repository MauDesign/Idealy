'use client';

import { useEffect, useRef } from 'react';

/**
 * GSAPInitializer — lazy-loads GSAP and ScrollTrigger only AFTER the browser
 * has finished painting the first frame (requestIdleCallback / setTimeout fallback).
 *
 * Why: GSAP is ~80 KB and is never needed for the initial render.
 * Loading it eagerly blocks the main thread and delays LCP/FCP.
 * Deferring to idle time removes it from the critical rendering path entirely.
 */
export default function GSAPInitializer({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Idle callback fires after first paint — zero impact on LCP
    const schedule = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(cb, { timeout: 2000 });
      } else {
        setTimeout(cb, 200);
      }
    };

    schedule(async () => {
      // Dynamic import — GSAP bundle is split from the main chunk
      const [{ gsap }, { ScrollTrigger }, { useGSAP: _useGSAP }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('@gsap/react'),
      ]);

      if (typeof window === 'undefined') return;
      gsap.registerPlugin(ScrollTrigger);

      requestAnimationFrame(() => {
        const el = container.current;
        if (!el) return;

        // ── Animate sections on scroll ───────────────────────────────────────
        const sections = gsap.utils.toArray<HTMLElement>(
          'section, .w-full.mb-15, #services, #portfolio',
          el,
        );

        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 50, filter: 'blur(10px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 50%',
                scrub: false,
                toggleActions: 'play none none none',
              },
            },
          );
        });

        // ── Animate 3D-hover images ──────────────────────────────────────────
        const images = gsap.utils.toArray<HTMLElement>('.hover-3d', el);
        images.forEach((img) => {
          gsap.from(img, {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: img,
              start: 'top 90%',
            },
          });
        });
      });
    });

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return <div ref={container}>{children}</div>;
}
