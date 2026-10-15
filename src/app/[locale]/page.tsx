import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { keywordsByPage } from '@/config/keywords';
import GSAPInitializer from '@/app/ui/components/GSAPInitializer';

// 14 Blocks
import Hero from '@/app/ui/hero/hero';
import TrustBar from '@/app/ui/home/TrustBar';
import NeedsGrid from '@/app/ui/home/NeedsGrid';
import Differentiator from '@/app/ui/home/Differentiator';
import CaseStudies from '@/app/ui/home/CaseStudies';
import ProcessSteps from '@/app/ui/home/ProcessSteps';
import PricingTiers from '@/app/ui/home/PricingTiers';
import OwnProducts from '@/app/ui/home/OwnProducts';
import FounderBlock from '@/app/ui/home/FounderBlock';
import Testimonials from '@/app/ui/home/Testimonials';
import FAQSection from '@/app/ui/FAQsection/FAQSection';
import Contact from '@/app/ui/contact/contact';
import Footer from '@/app/ui/Footer/Footer';

import type { locales } from '../../i18n/routing';
type Props = { params: Promise<{ locale: typeof locales[number] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const baseUrl = 'https://www.idealy.com.mx';

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'en-US': `${baseUrl}/en`,
        'es-MX': `${baseUrl}/es`,
        'x-default': `${baseUrl}/es`,
      },
    },
    title: isEn
      ? 'Idea.ly | High-Performance Solutions & AI Automation'
      : 'Diseño web y software a la medida en Puebla | Idea.ly',
    description: isEn
      ? 'Scale your business with Next.js & Go software. Experts in custom AI agents, workflow automation & high-impact UX for US & MX markets.'
      : 'Sitios web, sistemas a la medida y automatización con IA para PyMEs. Diseñamos, construimos y promocionamos tu proyecto. Landing desde $5,000 MXN.',
    keywords: isEn
      ? [...keywordsByPage['home-en']]
      : [
        'diseño de páginas web en Puebla',
        'desarrollo de software a la medida Puebla',
        'agencia de marketing digital Puebla',
        'automatización con IA para PyMEs',
        'chatbot de WhatsApp para negocios',
      ],
    openGraph: {
      title: isEn
        ? 'Idea.ly | High-Performance Solutions & AI Automation'
        : 'Idea.ly — Sitios y sistemas que te traen clientes',
      description: isEn
        ? 'Scale your business with Next.js & Go software. Experts in custom AI agents, workflow automation & high-impact UX for US & MX markets.'
        : 'Diseño, desarrollo y marketing en un solo equipo. Agenda tu diagnóstico gratis.',
      url: `${baseUrl}/${locale}`,
      siteName: 'Idea.ly',
      images: [
        {
          url: `${baseUrl}/img/Consulting-leo-idealy.jpg`,
          width: 1200,
          height: 630,
          alt: 'Idea.ly',
        },
      ],
      locale: isEn ? 'en_US' : 'es_MX',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn
        ? 'Idea.ly | High-Performance Solutions & AI Automation'
        : 'Idea.ly — Sitios y sistemas que te traen clientes',
      description: isEn
        ? 'Scale your business with Next.js & Go software.'
        : 'Diseño, desarrollo y marketing en un solo equipo. Agenda tu diagnóstico gratis.',
      images: [`${baseUrl}/img/Consulting-leo-idealy.jpg`],
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === 'en';
  const t = await getTranslations('Home');

  return (
    <GSAPInitializer>
      <div className="w-full flex flex-col min-h-screen">
        <main className="w-full flex flex-col">
          {/* 1. Hero (#inicio) */}
          <Hero locale={locale} />

          {/* H2 SEO (Línea de ubicación / H2 SEO) */}
          <div className="w-full bg-base-100/50 dark:bg-[#011621] py-4 border-b border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
            <h2 className="text-center text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 max-w-5xl mx-auto px-4 tracking-wide">
              {isEn
                ? t('hero-subtitle')
                : 'Agencia de diseño web y desarrollo de software en Puebla, México.'}
            </h2>
          </div>

          {/* 2. Barra de confianza */}
          <TrustBar locale={locale} />

          {/* 3. ¿Qué necesitas? (#servicios) */}
          <NeedsGrid locale={locale} />

          {/* 4. Un solo equipo */}
          <Differentiator locale={locale} />

          {/* 5. Casos reales (#casos) */}
          <CaseStudies locale={locale} />

          {/* 6. Cómo trabajamos (#proceso) */}
          <ProcessSteps locale={locale} />

          {/* 7. Precios (#precios) */}
          <PricingTiers locale={locale} />

          {/* 8. Productos propios */}
          <OwnProducts locale={locale} />

          {/* 9. Quién está detrás (#nosotros) */}
          <FounderBlock locale={locale} />

          {/* 10. Testimonios (Render condicional: oculto si items < 2) */}
          <Testimonials locale={locale} items={[]} />

          {/* 11. Preguntas frecuentes (#faq) */}
          <FAQSection language={locale} />

          {/* 12. Contacto (#contacto) */}
          <Contact locale={locale} />
        </main>

        {/* 13. Footer */}
        <Footer locale={locale} />
      </div>
    </GSAPInitializer>
  );
}