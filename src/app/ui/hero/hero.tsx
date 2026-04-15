"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

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
                setTimeout(() => setIsDeleting(true), 2000); // Pause at the end of word
            } else if (isDeleting && currentText === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
                setSpeed(500); // Pause before next word
            }
        };

        const timer = setTimeout(handleTyping, speed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentWordIndex, words, speed]);

    return (
        <span className="relative">
            {currentText}
            <span className="inline-block w-[3px] h-[0.8em] bg-primary ml-1 animate-pulse align-middle" />
        </span>
    );
};

export default function Header() {
    const t = useTranslations("Hero");
    const switcherWords = t("switcher").split(",").map(word => word.trim());

    return (
        <div className="hero min-h-screen bg-[#011b27] overflow-hidden">
            <div className="hero-content flex-col lg:flex-row w-full max-w-none p-0 gap-0">
                {/* Image Container - 50% width on Desktop */}
                <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen">
                    <Image
                        src="/img/idea-transform.webp"
                        alt="Idea.ly Transformation"
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Subtle Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-l from-[#011b27]/40 to-transparent pointer-events-none" />
                </div>

                {/* Content Container - 50% width on Desktop */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left p-8 lg:p-24 z-10">
                    <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                        {t("title")}
                    </h1>
                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight min-h-[1.2em]">
                        {t("title2")} <span className="text-primary"><Typewriter words={switcherWords} /></span>
                    </h2>
                    <p className="py-8 text-lg lg:text-xl text-slate-300 max-w-xl">
                        {t("description")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="btn btn-primary btn-lg px-12 rounded-full shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1">
                            {t("button")}
                        </button>
                        <button className="btn btn-ghost btn-lg px-12 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300">
                            {t("button2")}
                        </button>
                    </div>
                    <p className="text-md lg:text-lg text-slate-300 max-w-xl center">
                        {t("description2")}
                    </p>
                    <p className="text-md lg:text-lg text-slate-300 max-w-xl center">
                        {t("description3")}
                    </p>
                </div>
            </div>
        </div>
    );
}