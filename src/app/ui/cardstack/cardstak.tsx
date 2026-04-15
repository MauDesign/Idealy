"use client";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function CardStack() {
    // const t = useTranslations("CardStack"); // Uncomment if translations are needed
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        const cards = cardsRef.current;
        if (!cards || cards.length === 0) return;

        // Initial setup
        gsap.set(cards, {
            xPercent: (i) => i * 5,
            yPercent: (i) => i * 5,
            zIndex: (i) => cards.length - i,
            scale: (i) => 1 - i * 0.05,
            opacity: (i) => 1 - i * 0.2,
        });

        // Loop animation: Bring back card to front every few seconds
        const cycleCards = () => {
            const topCard = cards[0];
            const tl = gsap.timeline({
                onComplete: () => {
                    // Move the first element to the end of the array
                    cards.push(cards.shift()!);
                    // Reset positions for all cards
                    cards.forEach((card, i) => {
                        gsap.to(card, {
                            xPercent: i * 5,
                            yPercent: i * 5,
                            zIndex: cards.length - i,
                            scale: 1 - i * 0.05,
                            opacity: 1 - i * 0.2,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    });
                }
            });

            tl.to(topCard, {
                xPercent: 100,
                opacity: 0,
                rotate: 15,
                scale: 0.8,
                duration: 0.6,
                ease: "power2.in"
            });
        };

        const interval = setInterval(cycleCards, 3000);
        
        // Manual click to cycle
        const handleClick = () => {
             clearInterval(interval);
             cycleCards();
             // Restart interval after a delay
        };

        containerRef.current?.addEventListener("click", cycleCards);

        return () => {
            clearInterval(interval);
            containerRef.current?.removeEventListener("click", cycleCards);
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full h-[300px] flex items-center justify-center cursor-pointer perspective-1000">
            {/* Tech 1: Next.js */}
            <div 
                ref={(el) => { if (el) cardsRef.current[0] = el; }}
                className="absolute w-[200px] h-[200px] border-base-content card bg-white border text-center shadow-2xl flex items-center justify-center p-4 rounded-3xl"
            >
                <Image
                    src="/img/logo-tech/next.webp"
                    alt='Next.js'
                    width={150}
                    height={150}
                    className='object-contain w-full h-full'
                />
            </div>

            {/* Tech 2: Postgres */}
            <div 
                ref={(el) => { if (el) cardsRef.current[1] = el; }}
                className="absolute w-[200px] h-[200px] border-base-content card bg-white border text-center shadow-2xl flex items-center justify-center p-4 rounded-3xl"
            >
                <Image
                    src="/img/logo-tech/postgres.webp"
                    alt='PostgreSQL'
                    width={150}
                    height={150}
                    className='object-contain w-full h-full'
                />
            </div>

            {/* Tech 3: Tailwind */}
            <div 
                ref={(el) => { if (el) cardsRef.current[2] = el; }}
                className="absolute w-[200px] h-[200px] border-base-content card bg-white border text-center shadow-2xl flex items-center justify-center p-4 rounded-3xl"
            >
                <Image
                    src="/img/logo-tech/tailwind.webp"
                    alt='Tailwind CSS'
                    width={150}
                    height={150}
                    className='object-contain w-full h-full'
                />
            </div>
        </div>
    );
}