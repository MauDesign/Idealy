import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '../../../i18n/routing';
import DiagnosticoForm from './DiagnosticoForm';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: (typeof locales)[number] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.idealy.com.mx';

  return {
    metadataBase: new URL(baseUrl),
    title: 'Diagnóstico Digital Gratis para PyMEs | Idealy',
    description:
      'Descubre en 2 minutos cuánto dinero pierde tu empresa en tareas manuales y recibe un plan de acción gratis.',
    alternates: {
      canonical: `${baseUrl}/${locale}/diagnostico`,
      languages: {
        en: `${baseUrl}/en/diagnostico`,
        es: `${baseUrl}/es/diagnostico`,
        'x-default': `${baseUrl}/es/diagnostico`,
      },
    },
    openGraph: {
      title: 'Diagnóstico Digital Gratis para PyMEs | Idealy',
      description:
        'Descubre en 2 minutos cuánto dinero pierde tu empresa en tareas manuales y recibe un plan de acción gratis.',
      url: `${baseUrl}/${locale}/diagnostico`,
      siteName: 'Idealy',
      locale: locale === 'en' ? 'en_US' : 'es_MX',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/img/email/hero_idealy_email.jpg`,
          width: 1200,
          height: 630,
          alt: 'Diagnóstico Digital Express Idealy',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Diagnóstico Digital Gratis para PyMEs | Idealy',
      description:
        'Descubre en 2 minutos cuánto dinero pierde tu empresa en tareas manuales y recibe un plan de acción gratis.',
      images: [`${baseUrl}/img/email/hero_idealy_email.jpg`],
    },
  };
}

export default async function DiagnosticoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <Suspense
        fallback={
          <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-12 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#00b4a6] rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Cargando diagnóstico…</p>
          </div>
        }
      >
        <DiagnosticoForm />
      </Suspense>
    </main>
  );
}

