import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Script from 'next/script';
import type { Metadata } from 'next';
import LeoClient from '@/app/ui/leo/LeoClient';
import Footer from '@/app/ui/Footer/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const baseUrl = 'https://www.idealy.com.mx';

  return {
    title: isEn ? "Meet LEO | AI Strategic Consultant | Idea.ly" : "Conoce a LEO | Consultor Estratégico de IA | Idea.ly",
    description: isEn
      ? "LEO is Idea.ly's applied intelligence system. An AI strategic consultant that analyzes your business to automate processes and reduce costs."
      : "LEO es el sistema de inteligencia aplicada de Idea.ly. Un consultor estratégico de IA que analiza tu negocio para automatizar procesos y reducir costos.",
    alternates: {
      canonical: `${baseUrl}/${locale}/leo`,
      languages: {
        'en': `${baseUrl}/en/leo`,
        'es': `${baseUrl}/es/leo`,
        'x-default': `${baseUrl}/es/leo`,
      },
    },
  };
}

export default async function LeoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('LeoPage');
  const homeT = await getTranslations('Home');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LEO - Idea.ly Applied Intelligence",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": t("what_is_leo_desc"),
    "provider": {
      "@type": "Organization",
      "name": "Idea.ly",
      "url": "https://www.idealy.com.mx"
    }
  };

  const texts = {
    agency_subtitle: homeT("hero-subtitle"),
    hero_title: t("hero_title"),
    hero_subtitle: t("hero_subtitle"),
    what_is_leo: t("what_is_leo"),
    what_is_leo_desc: t("what_is_leo_desc"),
    process_title: t("process_title"),
    process_1: t("process_1"),
    process_1_desc: t("process_1_desc"),
    process_2: t("process_2"),
    process_2_desc: t("process_2_desc"),
    process_3: t("process_3"),
    process_3_desc: t("process_3_desc"),
    benefits_title: t("benefits_title"),
    benefit_1: t("benefit_1"),
    benefit_1_desc: t("benefit_1_desc"),
    benefit_2: t("benefit_2"),
    benefit_2_desc: t("benefit_2_desc"),
    benefit_3: t("benefit_3"),
    benefit_3_desc: t("benefit_3_desc"),
    cta_title: t("cta_title"),
    cta_desc: t("cta_desc"),
    cta_button: t("cta_button"),
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Script
        id="leo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <main className="flex-grow mt-20">
        <LeoClient texts={texts} />
      </main>
      <Footer />
    </div>
  );
}
