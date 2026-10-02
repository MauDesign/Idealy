'use client';

import { useEffect, useRef } from 'react';

export default function ExpressGSAPInitializer({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const schedule = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(cb, { timeout: 1500 });
      } else {
        setTimeout(cb, 100);
      }
    };

    schedule(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (typeof window === 'undefined') return;
      gsap.registerPlugin(ScrollTrigger);

      requestAnimationFrame(() => {
        const el = container.current;
        if (!el) return;

        // 1. HERO ANIMATION TIMELINE
        const heroBadge = el.querySelector('.hero-badge');
        const heroTitle = el.querySelector('.hero-title');
        const heroSubtitle = el.querySelector('.hero-subtitle');
        const heroCta = el.querySelector('.hero-cta');
        const heroTrust = el.querySelector('.hero-trust');
        const heroForm = el.querySelector('.hero-form-card');

        // Pre-set Hero states for clean entrance
        if (heroBadge) gsap.set(heroBadge, { opacity: 0, y: -30, scale: 0.9 });
        if (heroTitle) gsap.set(heroTitle, { opacity: 0, y: 35, filter: 'blur(8px)' });
        if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 0, y: 20 });
        if (heroCta) gsap.set(heroCta, { opacity: 0, y: 20 });
        if (heroTrust) gsap.set(heroTrust, { opacity: 0, y: 20 });
        if (heroForm) gsap.set(heroForm, { opacity: 0, x: 40, scale: 0.96 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (heroBadge) tl.to(heroBadge, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
        if (heroTitle) tl.to(heroTitle, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, '-=0.3');
        if (heroSubtitle) tl.to(heroSubtitle, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
        if (heroCta) tl.to(heroCta, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
        if (heroTrust) tl.to(heroTrust, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
        if (heroForm) tl.to(heroForm, { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'back.out(1.2)' }, '-=0.8');

        // 2. SCROLL TRIGGER ANIMATIONS FOR SECTIONS & CARDS
        const sections = gsap.utils.toArray<HTMLElement>('.gsap-section', el);
        sections.forEach((sec) => {
          gsap.set(sec, { opacity: 0, y: 45, filter: 'blur(6px)' });
          gsap.to(sec, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });

        // 3. CARD STAGGER ANIMATIONS
        const cardGrids = gsap.utils.toArray<HTMLElement>('.gsap-card-grid', el);
        cardGrids.forEach((grid) => {
          const cards = grid.querySelectorAll('.gsap-card');
          if (cards.length > 0) {
            gsap.set(cards, { opacity: 0, y: 30, scale: 0.95 });
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
              },
            });
          }
        });

        // 4. GUARANTEE POP ANIMATION
        const guarantee = el.querySelector('.gsap-guarantee');
        if (guarantee) {
          gsap.set(guarantee, { opacity: 0, scale: 0.8 });
          gsap.to(guarantee, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.8)',
            scrollTrigger: {
              trigger: guarantee,
              start: 'top 85%',
            },
          });
        }
      });
    });

    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return <div ref={container}>{children}</div>;
}
