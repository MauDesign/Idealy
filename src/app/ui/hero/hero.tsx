"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

// ─── Typewriter — accessible live region ────────────────────────────────────
// aria-live="polite" + aria-atomic="true" announces the full word to screen
// readers once the animation completes, without spamming character by character.
const Typewriter = ({ words }: { words: string[] }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [speed, setSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const currentWord = words[currentWordIndex];
            if (isDeleting) {
                setCurrentText(currentWord.substring(0, currentText.length - 1));
                setSpeed(50);
            } else {
                setCurrentText(currentWord.substring(0, currentText.length + 1));
                setSpeed(150);
            }

            if (!isDeleting && currentText === currentWord) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && currentText === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
                setSpeed(500);
            }
        };

        const timer = setTimeout(handleTyping, speed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentWordIndex, words, speed]);

    return (
        // aria-hidden on the visual animation; the full word list is available
        // as a visually-hidden static text for screen readers.
        <>
            {/* Visually hidden full word list for screen readers */}
            <span className="sr-only">{words.join(", ")}</span>

            {/* Visual animation — hidden from the AT to avoid character spam */}
            <span aria-hidden="true" className="relative">
                {currentText}
                <span
                    className="inline-block w-[3px] h-[0.8em] bg-primary ml-1 animate-pulse align-middle"
                    aria-hidden="true"
                />
            </span>
        </>
    );
};

// ─── Hero Section ────────────────────────────────────────────────────────────
export default function Hero() {
    const t = useTranslations("Hero");
    const switcherWords = t("switcher").split(",").map((word) => word.trim());

    return (
        <section
            aria-labelledby="hero-heading"
            className="hero min-h-screen bg-[#011b27] overflow-hidden"
        >
            <div className="hero-content flex-col lg:flex-row w-full max-w-none p-0 gap-0">
                {/* Hero image — decorative, the text conveys all information */}
                <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen">
                    <Image
                        src="/img/idea-transform.webp"
                        alt=""
                        aria-hidden="true"
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-l from-[#011b27]/40 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left p-8 lg:p-24 z-10">
                    <h1
                        id="hero-heading"
                        className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight"
                    >
                        {t("title")}
                    </h1>
                    {/* h2 is a visual sub-heading — part of the same heading group */}
                    <p className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight min-h-[1.2em]">
                        {t("title2")}{" "}
                        <span className="text-primary">
                            <Typewriter words={switcherWords} />
                        </span>
                    </p>

                    <p className="py-8 text-lg lg:text-xl text-slate-300 max-w-xl">
                        {t("description")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* Buttons need type="button" to prevent accidental form submission */}
                        <button
                            type="button"
                            className="btn btn-primary btn-lg px-12 rounded-full shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {t("button")}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-lg px-12 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300"
                        >
                            {t("button2")}
                        </button>
                    </div>

                    <p className="text-md lg:text-lg text-slate-300 max-w-xl mt-6">
                        {t("description2")}
                    </p>
                    <p className="text-md lg:text-lg text-slate-300 max-w-xl">
                        {t("description3")}
                    </p>
                </div>
            </div>
        </section>
    );
}