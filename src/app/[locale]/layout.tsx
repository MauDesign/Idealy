import type { Metadata } from "next";
import type {Viewport} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale,} from 'next-intl/server';
import "@/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "../ui/navbar/navbar";


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
  title: "Idea.ly - Soluciones Tecnológicas a Medida",
  description: "Convertimos grandes ideas en soluciones excepcionales, Desarrollo de software, aplicaciones web y móviles, y marketing digital.",
  keywords: [
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
    'Idea.ly'
  ],
  openGraph: {
    title: 'Idea.ly - Soluciones Tecnológicas a Medida',
    description: 'Fusionamos tecnología y creatividad para desarrollar software que transforma desafíos en oportunidades.',
    url: 'https://www.idealy.com.mx', // Reemplaza con tu dominio final
    siteName: 'Idea.ly',
    images: [
      {
        url: '/img/Consulting-leo-idealy.jpg', // URL absoluta de tu imagen
        width: 600,
        height: 300,
        alt: 'Desarrollo de software a la medida por Idea.ly',
      },
    ],
    
    locale: 'es_ES',
    type: 'website',
  },
};
export const viewport: Viewport = {
  themeColor: 'black',
}

type Props = {
  children: React.ReactNode,
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale}/>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
