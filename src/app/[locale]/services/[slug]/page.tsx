import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Terminal, Cpu, Layers, TrendingUp, Lightbulb, CheckCircle2, ChevronRight, MessageSquare, Play } from 'lucide-react';
import Contact from "@/app/ui/contact/contact";
import Footer from "@/app/ui/Footer/Footer";
import GSAPInitializer from "@/app/ui/components/GSAPInitializer";
import PageSchema from "@/app/ui/PageSchema";
import type { Metadata } from 'next';
import { keywordsByPage } from '@/config/keywords';
import type { locales } from '../../../../i18n/routing';

const validSlugs = [
  'software-development',
  'ai-automation',
  'ux-ui-design',
  'digital-marketing',
  'consulting'
] as const;

type ValidSlug = typeof validSlugs[number];

type Props = {
  params: Promise<{
    locale: typeof locales[number];
    slug: string;
  }>;
};

const serviceKeywords: Record<ValidSlug, { es: string[]; en: string[] }> = {
  'software-development': {
    es: [
      'diseño y desarrollo web para empresas en México',
      'desarrollo de aplicaciones móviles a la medida',
      'software a la medida para empresas',
      'desarrollo web con Next.js para empresas en México',
      'arquitectura de software escalable para startups y PyMEs'
    ],
    en: [
      'custom software development with AI Mexico',
      'full-stack development Next.js and Go',
      'high-performance web engineering Mexico',
      'scalable cloud solutions for growing companies'
    ]
  },
  'ai-automation': {
    es: [
      'automatización de procesos con inteligencia artificial',
      'integración de LLMs en procesos empresariales México',
      'implementación de chatbots con IA para atención al cliente',
      '¿cómo automatizar procesos empresariales con inteligencia artificial en México?',
      '¿qué son los agentes de IA autónomos y para qué sirven en empresas mexicanas?'
    ],
    en: [
      'custom AI agents for business automation',
      'AI-driven workflow automation for enterprises',
      'LLM integration and RAG systems for business',
      'what are autonomous AI agents and how can they help my business?'
    ]
  },
  'ux-ui-design': {
    es: [
      'diseño UX/UI para aplicaciones empresariales en México',
      'diseño web puebla',
      'desarrollo web profesional puebla',
      'agencia de diseño web responsivo para pymes México'
    ],
    en: [
      'premium UX/UI design agency Mexico',
      'UX/UI design agency Mexico USA',
      'human-centered product design nearshore'
    ]
  },
  'digital-marketing': {
    es: [
      '¿cuánto retorno de inversión genera una estrategia de marketing digital con IA?',
      '¿cómo crear un embudo de ventas digital para empresas B2B en México?',
      'consultoría de negocios digitales para emprendedores'
    ],
    en: [
      'how to build a high-converting B2B digital sales funnel with AI?',
      'strategic digital growth funnels for B2B SaaS',
      'nearshore digital growth partner'
    ]
  },
  'consulting': {
    es: [
      'consultoría de transformación digital para empresas',
      'agencia de transformación digital Puebla México',
      'consultoría de inteligencia artificial para PyMEs en México 2026'
    ],
    en: [
      'digital transformation consultancy North America',
      'AI consulting agency Mexico for US companies',
      'nearshore AI development team Mexico 2026'
    ]
  }
};

// Generate dynamic metadata for each service page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug as any)) return {};

  const activeService = slug as ValidSlug;
  const tDetails = await getTranslations({ locale, namespace: 'ServicesDetails' });
  const isEn = locale === 'en';

  const title = tDetails(`${activeService}.title`);
  const subtitle = tDetails(`${activeService}.subtitle`);
  const description = tDetails(`${activeService}.description`);

  const keywords = isEn
    ? [...serviceKeywords[activeService].en, 'idealy', 'idealy AI consulting']
    : [...serviceKeywords[activeService].es, 'idealy', 'idealy mexico'];

  return {
    alternates: {
      canonical: locale === 'en' ? `/en/services/${slug}` : `/services/${slug}`,
      languages: {
        'en-US': `/en/services/${slug}`,
        'es-MX': `/services/${slug}`,
        'x-default': `/services/${slug}`,
      },
    },
    title: `${title} | Idea.ly`,
    description: `${subtitle}. ${description.substring(0, 120)}...`,
    keywords
  };
}

// Static params generation for static export optimization
export async function generateStaticParams() {
  const locales = ['en', 'es'];
  const params = [];
  for (const locale of locales) {
    for (const slug of validSlugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

const serviceConfig: Record<ValidSlug, {
  icon: any;
  image: string;
  technologies: string[];
  gradient: string;
}> = {
  'software-development': {
    icon: Terminal,
    image: '/img/idealy-dev.webp',
    technologies: ['Next.js', 'Go (Golang)', 'TypeScript', 'PostgreSQL', 'Docker', 'REST & GraphQL', 'CI/CD'],
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent'
  },
  'ai-automation': {
    icon: Cpu,
    image: '/img/idealy-ai-automate.webp',
    technologies: ['OpenAI GPT', 'Claude (Anthropic)', 'Python', 'LangChain', 'Make & Zapier', 'Vector Databases', 'RAG Systems'],
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent'
  },
  'ux-ui-design': {
    icon: Layers,
    image: '/img/idealy-ux-ui.webp',
    technologies: ['Figma', 'User Research', 'Wireframing', 'High-Fi Prototyping', 'Design Systems', 'Usability Testing', 'A/B Testing'],
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent'
  },
  'digital-marketing': {
    icon: TrendingUp,
    image: '/img/idealy-marketing.webp',
    technologies: ['Google Analytics 4', 'SEO Strategy', 'SEM (Google Ads)', 'Conversion Funnels', 'HubSpot / CRM', 'Email Marketing', 'Performance Tracking'],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
  },
  'consulting': {
    icon: Lightbulb,
    image: '/img/Consulting-leo-idealy.jpg',
    technologies: ['LEO AI Engine', 'Strategic Roadmap', 'Enterprise IT Architecture', 'Process Automation', 'Digital ROI Analysis', 'Tech Adoption Training'],
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
  }
};

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  
  if (!validSlugs.includes(slug as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const activeService = slug as ValidSlug;
  const config = serviceConfig[activeService];
  const Icon = config.icon;

  const tPage = await getTranslations('ServicesPage');
  const tDetails = await getTranslations('ServicesDetails');

  // Dynamic Translations
  const title = tDetails(`${activeService}.title`);
  const subtitle = tDetails(`${activeService}.subtitle`);
  const description = tDetails(`${activeService}.description`);
  const heroPhrase = tDetails(`${activeService}.hero_phrase`);
  const techTitle = tDetails(`${activeService}.tech_title`);
  const featuresTitle = tDetails(`${activeService}.features_title`);
  const processTitle = tDetails(`${activeService}.process_title`);

  // Key Features
  const features = [
    {
      title: tDetails(`${activeService}.feature1_title`),
      desc: tDetails(`${activeService}.feature1_desc`)
    },
    {
      title: tDetails(`${activeService}.feature2_title`),
      desc: tDetails(`${activeService}.feature2_desc`)
    },
    {
      title: tDetails(`${activeService}.feature3_title`),
      desc: tDetails(`${activeService}.feature3_desc`)
    }
  ];

  // Process steps
  const steps = [
    {
      num: '01',
      title: tDetails(`${activeService}.process1_title`),
      desc: tDetails(`${activeService}.process1_desc`)
    },
    {
      num: '02',
      title: tDetails(`${activeService}.process2_title`),
      desc: tDetails(`${activeService}.process2_desc`)
    },
    {
      num: '03',
      title: tDetails(`${activeService}.process3_title`),
      desc: tDetails(`${activeService}.process3_desc`)
    }
  ];

  // ── Schemas JSON-LD específicos de la página ────────────────────────────────
  const BASE_URL = 'https://www.idealy.com.mx';
  const pageUrl = `${BASE_URL}/${locale}/services/${slug}`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${title} | Idea.ly`,
    description: `${subtitle}. ${description.substring(0, 120)}...`,
    inLanguage: locale,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#organization` },
    publisher: { '@id': `${BASE_URL}/#organization` },
  };

  const serviceDetailSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: title,
    description: description,
    url: pageUrl,
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: [
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'United States' },
    ],
    serviceType: subtitle,
    offers: {
      '@type': 'Offer',
      description: heroPhrase,
      seller: { '@id': `${BASE_URL}/#organization` },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'en' ? 'Service Features' : 'Características del Servicio',
      itemListElement: features.map((feat) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: feat.title,
          description: feat.desc,
        },
      })),
    },
  };

  return (
    <>
      {/* JSON-LD: WebPage + Service schemas — Next.js los eleva al <head> */}
      <PageSchema schemas={[webPageSchema, serviceDetailSchema]} />

      <div className="flex flex-col min-h-screen bg-[#01131b]">
      {/* Background glow effects */}
      <div className={`absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b ${config.gradient} pointer-events-none opacity-60 z-0`} />

      {/* Hero Header Section */}
      <section className="relative pt-36 pb-12 overflow-hidden z-10">
        <div className="container mx-auto px-6">
          {/* Back button */}
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-primary text-sm font-bold transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {locale === 'en' ? 'Back to Services' : 'Volver a Servicios'}
          </Link>

          {/* Title Area */}
          <div className="max-w-4xl">
            <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
              {subtitle}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-3xl leading-relaxed italic border-l-2 border-primary/40 pl-6">
              "{heroPhrase}"
            </p>
          </div>
        </div>
      </section>

      {/* Service Details Main Panel */}
      <main className="flex-grow container mx-auto px-6 pb-24 relative z-10">
        <GSAPInitializer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
            
            {/* Left Column - Detailed Explanations and Features */}
            <div className="lg:col-span-7 space-y-12">
              <section className="space-y-6">
                <p className="text-slate-300 text-lg leading-relaxed font-light">
                  {description}
                </p>
              </section>

              {/* Detailed Features List */}
              <section className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {featuresTitle}
                </h3>
                <div className="space-y-6">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-[#011c27]/40 border border-white/5 hover:border-primary/20 transition-all duration-300 flex gap-4"
                    >
                      <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white mb-2">{feat.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Visual Card & Tech Stack Badges */}
            <div className="lg:col-span-5 space-y-8">
              {/* Premium image stack with Glass frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-2 bg-[#011c27]/30 hover-3d transition-transform duration-500">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-base-300">
                  <Image
                    src={config.image}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011c27]/80 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Technologies card */}
              <div className="p-8 rounded-3xl bg-[#011c27]/60 border border-white/5 backdrop-blur-md shadow-xl">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  {techTitle}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {config.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold tracking-wide transition-all duration-300 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Process Timeline Section ("El Método Idea.ly") */}
          <section className="mt-24 pt-12 border-t border-white/5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-black text-primary uppercase tracking-widest block mb-3">
                {locale === 'en' ? 'WORKFLOW' : 'FLUJO DE TRABAJO'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {processTitle}
              </h2>
            </div>

            {/* Glowing step blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="group relative p-8 rounded-3xl bg-[#011c27]/40 border border-white/5 hover:border-primary/30 hover:bg-[#011c27]/75 transition-all duration-500 flex flex-col justify-between min-h-[250px] overflow-hidden"
                >
                  {/* Subtle step background glow */}
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 blur-xl transition-all duration-500 pointer-events-none" />
                  
                  <div>
                    {/* Glowing Big Number */}
                    <div className="text-5xl font-black text-primary/10 group-hover:text-primary/30 transition-colors duration-500 mb-6 font-mono leading-none">
                      {step.num}
                    </div>
                    {/* Step Title */}
                    <h3 className="text-lg font-black text-white mb-3 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    {/* Step Description */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final Call to Action Box */}
          <div className="mt-24 p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-[#011c27]/80 to-[#01131b] border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-primary/10 blur-[50px]" />
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
              {locale === 'en' ? 'Ready to Start?' : '¿Listo para empezar?'}
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              {locale === 'en' 
                ? "Contact us today. Let's schedule a call to design the optimal technological strategy for your business."
                : "Contáctanos hoy mismo. Programemos una llamada para diseñar la estrategia tecnológica ideal para tu negocio."}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary text-black font-black px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/30 hover:opacity-95 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              {locale === 'en' ? "Schedule Free Consultation" : "Programar Asesoría Gratis"}
            </a>
          </div>

          {/* Interactive Contact Form */}
          <div id="contact" className="w-full mt-24">
            <Contact />
          </div>

        </GSAPInitializer>
      </main>

      <Footer />
    </div>
    </>
  );
}
