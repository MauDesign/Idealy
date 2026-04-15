'use client';

import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useRef } from 'react';

export default function GSAPInitializer({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate sections on scroll
     const sections = gsap.utils.toArray<HTMLElement>('section, .w-full.mb-15, #services, #portfolio');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { 
          opacity: 0, 
          y: 50,
          filter: 'blur(10px)'
        },
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
          }
        }
      );
    });

    // Animate images with a slight scale effect
    const images = gsap.utils.toArray<HTMLElement>('.hover-3d');
    images.forEach((img) => {
        gsap.from(img, {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: img,
                start: 'top 90%',
            }
        });
    });

  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
