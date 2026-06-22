// ─── Hero — Server Component ─────────────────────────────────────────────────
// No 'use client' directive: next/image renders the LCP <img> tag directly in
// the server-streamed HTML, making it immediately discoverable by the browser
// without waiting for React hydration. This is the fix for:
//   "LCP request discovery — make the LCP image detectable from HTML immediately"
//
// The only interactive child (Typewriter animation) is a separate Client
// Component imported below.
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Typewriter from './Typewriter';

export default async function Hero() {
    const t = await getTranslations('Hero');
    const switcherWords = t('switcher').split(',').map((word) => word.trim());

    return (
        <section
            aria-labelledby="hero-heading"
            className="hero min-h-screen bg-[#011b27] overflow-hidden"
        >
            <div className="hero-content flex-col lg:flex-row w-full max-w-none p-0 gap-0">

                {/* LCP Image — Server-rendered, no lazy loading, fetchpriority=high
                    next/image with priority=true emits:
                      <img loading="eager" fetchpriority="high" ...>
                    Combined with the <link rel="preload"> in layout.tsx, the
                    browser starts fetching this image as the very first resource. */}
                <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen">
                    <Image
                        src="/img/idea-transform.webp"
                        alt=""
                        aria-hidden="true"
                        fill
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
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
                        {t('title')}
                    </h1>

                    <div className="min-h-[120px] lg:min-h-[180px] flex items-start justify-center lg:justify-start">
                        <p className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                            {t('title2')}{' '}
                            {/* Typewriter is a Client Component — only this subtree hydrates */}
                            <span className="text-primary">
                                <Typewriter words={switcherWords} />
                            </span>
                        </p>
                    </div>

                    <p className="py-8 text-lg lg:text-xl text-slate-300 max-w-xl">
                        {t('description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            type="button"
                            className="btn btn-primary btn-lg px-12 rounded-full shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {t('button')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-lg px-12 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300"
                        >
                            {t('button2')}
                        </button>
                    </div>

                    <p className="text-md lg:text-lg text-slate-300 max-w-xl mt-6">
                        {t('description2')}
                    </p>
                    <p className="text-md lg:text-lg text-slate-300 max-w-xl">
                        {t('description3')}
                    </p>
                </div>
            </div>
        </section>
    );
}