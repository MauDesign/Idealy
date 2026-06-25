import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import PageSchema from '@/app/ui/PageSchema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });
  const isEn = locale === 'en';

  return {
    alternates: {
      canonical: `/${locale}/privacy-policy`,
      languages: {
        'en-US': '/en/privacy-policy',
        'es-MX': '/es/privacy-policy',
        'x-default': '/es/privacy-policy',
      },
    },
    title: `${t('title')} | Idea.ly`,
    description: t('intro'),
    keywords: isEn ? [
      'privacy policy',
      'data privacy',
      'terms of service',
      'Idea.ly privacy',
      'user data protection'
    ] : [
      'política de privacidad',
      'privacidad de datos',
      'términos y condiciones',
      'privacidad Idea.ly',
      'protección de datos personales'
    ]
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('PrivacyPolicy');
  const isEn = locale === 'en';

  const BASE_URL = 'https://www.idealy.com.mx';
  const pageUrl = `${BASE_URL}/${locale}/privacy-policy`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${t('title')} | Idea.ly`,
    description: t('intro'),
    inLanguage: isEn ? 'en' : 'es',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    about: { '@id': `${BASE_URL}/#organization` },
  };

  return (
    <>
      <PageSchema schemas={[webPageSchema]} />
      <div className="min-h-screen bg-[#334B5F] pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
           <h1 className="text-4xl md:text-5xl font-extrabold text-[#00B5A7] mb-6">
            {t('title')}
          </h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-[#00B5A7] to-cyan-400 rounded-full mb-10"></div>
          <p className="text-xl text-white/90 leading-relaxed italic">
            {t('intro')}
          </p>
        </div>

        <div className="space-y-16">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <section key={num} className="relative pl-8 border-l-2 border-white/10 hover:border-[#00B5A7] transition-colors duration-300">
              <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-white/20 group-hover:bg-[#00B5A7]"></div>
              <h2 className="text-2xl font-bold text-[#00B5A7] mb-4">
                {t(`section${num}_title`)}
              </h2>
              <p className="text-white/80 leading-relaxed text-lg text-justify">
                {t(`section${num}_content`)}
              </p>
            </section>
          ))}
        </div>
        
        <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Idea.ly. {t('title')}
          </p>
          <div className="h-px flex-grow bg-white/5 mx-4 hidden sm:block"></div>
        </div>
      </div>
    </div>
    </>
  );
}
