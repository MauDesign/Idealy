import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import type { Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, } from 'next-intl/server';
import "@/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "../ui/navbar/navbar";
import { ThemeProvider } from "../ui/ThemeProvider";
import StructuredData from "../ui/StructuredData";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getKeywordsForLocale } from '@/config/keywords';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    metadataBase: new URL('https://www.idealy.com.mx'),
    title: isEn 
      ? "Idea.ly | High-Performance Solutions & Custom AI" 
      : "Idea.ly | Soluciones de Alto Rendimiento y Automatización de IA",
    description: isEn
      ? "Scale your business with Next.js & Go software. Experts in custom AI, intelligent automation & high-impact UX for US & MX markets."
      : "Escala tu negocio con software de Next.js y Go. Expertos en agentes de IA personalizados, automatización de flujos y UX de alto impacto para mercados de EE.UU. y México.",
    keywords: getKeywordsForLocale(locale as 'es' | 'en'),
    openGraph: {
      title: isEn 
        ? 'Idea.ly | Turning Vision into Reality through Software & AI' 
        : 'Idea.ly | De la Idea a la Realidad con Software e Inteligencia Artificial',
      description: isEn
        ? 'Custom software engineering and AI-driven workflows for forward-thinking companies. Explore the Idea.ly method.'
        : 'Ingeniería de software a la medida y flujos automatizados con IA para empresas innovadoras. Conoce el método Idea.ly.',
      url: 'https://www.idealy.com.mx',
      siteName: 'Idea.ly',
      images: [
        {
          url: 'https://www.idealy.com.mx/img/Consulting-leo-idealy.jpg',
          width: 600,
          height: 300,
          alt: isEn 
            ? 'Custom software development by Idea.ly' 
            : 'Desarrollo de software a la medida por Idea.ly',
        },
      ],
      locale: isEn ? 'en_US' : 'es_MX',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn 
        ? 'Idea.ly - Custom Technological Solutions' 
        : 'Idea.ly - Soluciones Tecnológicas a Medida',
      description: isEn
        ? 'We blend technology and creativity to build software that transforms challenges into opportunities.'
        : 'Fusionamos tecnología y creatividad para desarrollar software que transforma desafíos en oportunidades.',
      images: ['https://www.idealy.com.mx/img/Consulting-leo-idealy.jpg'],
    },
  };
}

export const viewport: Viewport = {
  themeColor: 'black',
};

type Props = {
  children: React.ReactNode,
  params: Promise<{ locale: string }>;
};


export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <StructuredData locale={locale} />
        {/* Resource hints — shorten TCP handshake for any Google-origin asset */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <GoogleAnalytics gaId="G-GJBZY50Y93" />
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18107657847" strategy="afterInteractive" />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18107657847');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground transition-colors duration-300`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navbar locale={locale} />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
