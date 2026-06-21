'use client';
import { useState, useEffect } from 'react';

/**
 * Typewriter — isolated Client Component.
 * By extracting only the animation logic here, the parent Hero can remain a
 * Server Component. This allows next/image to emit the LCP <img> tag directly
 * in the server-rendered HTML — making it discoverable without waiting for JS.
 */
const Typewriter = ({ words }: { words: string[] }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
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
            } else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
                setSpeed(500);
            }
        };

        const timer = setTimeout(handleTyping, speed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentWordIndex, words, speed]);

    return (
        <>
            {/* Static text for screen readers — full word list, no animation noise */}
            <span className="sr-only">{words.join(', ')}</span>
            {/* Visual animation hidden from assistive technology */}
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

export default Typewriter;
