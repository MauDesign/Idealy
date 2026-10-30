import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import type { Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import "@/app/globals.css";
import { Geist, Geist_Mono, Sora } from "next/font/google";

import Navbar from "../ui/navbar/navbar";
import { ThemeProvider } from "../ui/ThemeProvider";
import StructuredData from "../ui/StructuredData";
import WhatsAppFab from "../ui/components/WhatsAppFab";
import { getKeywordsForLocale } from '@/config/keywords';
import { locales } from '@/i18n/routing';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

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

  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <GoogleTagManager gtmId="GTM-WDB3RSDZ" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <GoogleAnalytics gaId="G-GJBZY50Y93" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18107657847" strategy="lazyOnload" />
        <Script id="google-ads-tag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18107657847');

            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-18107657847/-BzNCLXUzsUcEPfcs7pD',
                  'value': 1.0,
                  'currency': 'MXN',
                  'event_callback': callback
              });
              return false;
            }
          `}
        </Script>

        {/* Microsoft Clarity */}
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}

        {/* Meta Pixel (Facebook) */}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} bg-background text-foreground transition-colors duration-300`}
      >
        <StructuredData locale={locale} />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WDB3RSDZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {metaPixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
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
            <WhatsAppFab />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
