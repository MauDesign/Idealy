import type { Metadata } from "next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import type { Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, } from 'next-intl/server';
import "@/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "../ui/navbar/navbar";
import { ThemeProvider } from "../ui/ThemeProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.idealy.com.mx'),
  title: "Idea.ly | High-Performance Software, AI Automation & UX Design",
  description: "Top-tier Nearshore Strategic Studio. We build scalable software with Next.js & Go, implement custom AI agents, and design intuitive UX. Driving exponential growth for US & MX markets. Let's make it real.",
  keywords: [
    // --- Original & Base Keywords ---
    'desarrollo de software',
    'soluciones tecnológicas',
    'software a la medida',
    'aplicaciones web',
    'aplicaciones móviles',
    'transformación digital',
    'marketing digital',
    'Ideas y soluciones',
    'Diseño web',
    'Desarrollo web',
    '¿cuánto cuesta una página web?',
    '¿qué se necesita para crear una página web?',
    'diseño web responsivo',
    'creación de sitios web',
    'diseño de páginas web para pymes',
    'diseño de páginas web para empresas',
    'diseño de páginas web para startups',
    'diseño de páginas web para emprendedores',
    'Desarrollo de software a la medida',
    'Desarrollo de aplicaciones web',
    'Desarrollo de aplicaciones móviles',
    'Desarrollo de sitios web',
    'Desarrollo de sitios web responsivos',
    'Desarro web profesional',
    'Diseño UX',
    'Consultoria Diseño UX',
    'Diseño Web puebla',
    'Desarrollo Nearshoring',
    'Innovacion tecnologica',
    'desarrollo de software a la medida',
    'desarrollo de aplicaciones web',
    'desarrollo de aplicaciones móviles',
    'desarrollo de sitios web',
    'desarrollo de sitios web responsivos',
    'desarro web profesional',
    'diseño UX',
    'consultoria Diseño UX',
    'diseño Web puebla',
    'desarrollo Nearshoring',
    'innovacion tecnologica',
    'Idea.ly',
    'idealy',

    // --- New Strategic AI & Automation Keywords (ES) ---
    'automatización de procesos con IA',
    'agentes de inteligencia artificial para empresas',
    'consultoría de IA aplicada',
    'integración de modelos de lenguaje LLM',
    'eficiencia operativa con IA',
    'expertos en automatización inteligente',
    'desarrollo de software con inteligencia artificial',

    // --- New High-Performance & Growth Keywords (ES) ---
    'estrategia de crecimiento digital exponencial',
    'embudos de venta de alta conversión',
    'consultoría de negocios digitales',
    'desarrollo web con Next.js y Go',
    'arquitectura de software escalable',
    'diseño de productos digitales premium',
    'marketing basado en resultados ROI',

    // --- New International & Nearshore Keywords (EN) ---
    'nearshore software development Mexico',
    'custom AI agents for business',
    'AI-driven workflow automation',
    'premium UX/UI design agency',
    'full-stack development Next.js Go',
    'strategic digital growth funnels',
    'bilingual tech partner Mexico USA',
    'high-performance web engineering',
    'scalable cloud solutions',
    'digital transformation consultancy North America'
  ],
  openGraph: {
    title: 'Idea.ly | Turning Vision into Reality through Software & IA',
    description: 'Custom software engineering and AI-driven workflows for forward-thinking companies. Explore the Idea.ly method.',
    url: 'https://www.idealy.com.mx',
    siteName: 'Idea.ly',
    images: [
      {
        url: 'https://www.idealy.com.mx/img/Consulting-leo-idealy.jpg',
        width: 600,
        height: 300,
        alt: 'Desarrollo de software a la medida por Idea.ly',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Idea.ly - Soluciones Tecnológicas a Medida',
    description: 'Fusionamos tecnología y creatividad para desarrollar software que transforma desafíos en oportunidades.',
    images: ['https://www.idealy.com.mx/img/Consulting-leo-idealy.jpg'],
  },
};
export const viewport: Viewport = {
  themeColor: 'black',
}

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
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground transition-colors duration-300`}>
        <GoogleAnalytics gaId="G-GJBZY50Y93" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
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
