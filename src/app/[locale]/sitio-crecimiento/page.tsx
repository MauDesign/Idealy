import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  TrendingUp,
  Target,
  Search,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  MousePointerClick,
  Users,
  Layers,
  Bot
} from 'lucide-react';
import WhatsAppButton from '@/app/ui/express/WhatsAppModal';
import ExpressGSAPInitializer from '@/app/ui/express/ExpressGSAPInitializer';
import GrowthLeadForm from '@/app/ui/growth/GrowthLeadForm';
import GrowthFAQAccordion from '@/app/ui/growth/GrowthFAQAccordion';
import type { locales } from '../../../i18n/routing';

type Props = {
  params: Promise<{ locale: typeof locales[number] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const baseUrl = 'https://www.idealy.com.mx';

  return {
    title: isEn
      ? 'Website + Growth: More Customers Every Month for $8,500 MXN / mo (~$500 USD) | Idealy Studio'
      : 'Sitio + Crecimiento: Más Clientes Cada Mes por $8,500/mes | Idealy Studio',
    description: isEn
      ? 'Custom high-performance website + Google & Meta ad campaigns + SEO for Google and ChatGPT + Monthly lead reporting. Turn your web presence into an automated sales engine.'
      : 'Sitio web completo a la medida + campañas en Google y Meta + SEO para Google y ChatGPT + Reportes mensuales de prospectos. Convierte tu presencia digital en una máquina de ventas.',
    alternates: {
      canonical: `${baseUrl}/${locale}/sitio-crecimiento`,
      languages: {
        en: `${baseUrl}/en/sitio-crecimiento`,
        es: `${baseUrl}/es/sitio-crecimiento`,
        'x-default': `${baseUrl}/es/sitio-crecimiento`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Website + Growth: Monthly Inbound Customer Engine | Idealy Studio'
        : 'Sitio + Crecimiento: Más Clientes Cada Mes | Idealy Studio',
      description: isEn
        ? 'Full custom-designed website + Google & Meta ad management + SEO for AI and Search. $8,500 MXN / mo (~$500 USD).'
        : 'Sitio web completo diseñado a la medida + Campañas optimizadas en Google y Meta + SEO para IA y Google. $8,500 MXN / mes.',
      url: `${baseUrl}/${locale}/sitio-crecimiento`,
      siteName: 'Idealy',
      images: [
        {
          url: 'https://www.idealy.com.mx/img/idealy-marketing.webp',
          width: 1200,
          height: 630,
          alt: isEn ? 'Idealy Website + Growth' : 'Sitio + Crecimiento Idealy',
        },
      ],
      locale: isEn ? 'en_US' : 'es_MX',
      type: 'website',
    },
  };
}

export default async function SitioCrecimientoPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === 'en';

  return (
    <ExpressGSAPInitializer>
      <div className="w-full bg-[#07131e] text-gray-100 min-h-screen font-sans selection:bg-[#00b4a6] selection:text-white pb-20 lg:pb-0 overflow-x-hidden">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: isEn ? 'Idealy Website + Growth Engine' : 'Idealy Sitio + Crecimiento',
              image: 'https://www.idealy.com.mx/img/idealy-marketing.webp',
              description: isEn
                ? 'Comprehensive customer acquisition engine: custom Next.js web platform, Google & Meta Ads management, AI generative SEO and conversion reporting.'
                : 'Servicio integral de desarrollo de sitio web a la medida con pauta publicitaria en Google y Meta Ads, SEO para Google y ChatGPT con reportes de prospectos calificados.',
              offers: {
                '@type': 'Offer',
                price: '8500',
                priceCurrency: 'MXN',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: 'Idealy',
                  url: 'https://www.idealy.com.mx',
                },
              },
            }),
          }}
        />

        {/* Minimal High-Tech Header */}
        <header className="w-full border-b border-white/10 bg-[#07131e]/90 backdrop-blur-md sticky top-0 z-40 py-4 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Image
                src="/img/Logo-Idealy.png"
                alt="Idealy Logo"
                width={130}
                height={40}
                priority
                className="object-contain"
              />
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#00b4a6]/20 border border-[#00b4a6]/40 text-[#00b4a6]">
                {isEn ? 'WEBSITE + GROWTH · COMPREHENSIVE PLAN' : 'SITIO + CRECIMIENTO · PLAN INTEGRAL'}
              </span>
              <WhatsAppButton
                buttonText={isEn ? 'Quote via WhatsApp 💬' : 'Cotizar por WhatsApp 💬'}
                locationTag="growth_header_nav"
                presetMessage={
                  isEn
                    ? 'Hi Mauricio, I am interested in the Website + Growth plan ($8,500 MXN / mo) to scale my company leads 🚀'
                    : 'Hola Mauricio, me interesa el plan Sitio + Crecimiento ($8,500/mes) para impulsar las ventas de mi negocio 🚀'
                }
                className="py-2 px-4 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              />
            </div>
          </div>
        </header>

        {/* 1. HERO SECTION */}
        <section className="w-full relative pt-8 pb-16 overflow-hidden">
          {/* Subtle Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00b4a615_1px,transparent_1px),linear-gradient(to_bottom,#00b4a615_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[#00b4a6]/20 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute top-10 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-[#0069a9]/25 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Offer & Headline */}
              <div className="lg:col-span-6 flex flex-col items-start pt-2">
                <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00b4a6]/20 to-[#0069a9]/20 border border-[#00b4a6]/40 text-[#00b4a6] font-extrabold text-xs tracking-wider uppercase mb-5 shadow-[0_0_20px_rgba(0,180,166,0.2)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b4a6] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00b4a6]"></span>
                  </span>
                  <span>
                    {isEn ? '🚀 INBOUND SALES & LEAD ACQUISITION ENGINE' : '🚀 PLAN INTEGRAL DE ADQUISICIÓN Y VENTAS'}
                  </span>
                </div>

                <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mb-5">
                  {isEn ? 'High-impact website + monthly inbound leads for ' : 'Sitio web de alto impacto + clientes cada mes por '}
                  <span className="inline-block px-3.5 py-1 rounded-2xl bg-gradient-to-r from-[#00b4a6] to-[#008075] text-white shadow-[0_0_35px_rgba(0,180,166,0.6)] font-black tracking-tight border border-white/20 transform hover:scale-105 transition-transform">
                    {isEn ? '$8,500 MXN' : '$8,500'}
                  </span>{' '}
                  <span className="text-xs sm:text-sm text-amber-300 font-bold tracking-wider uppercase align-super">
                    {isEn ? '(~$500 USD / mo)' : 'MXN / mes + IVA'}
                  </span>
                </h1>

                <p className="hero-subtitle text-base sm:text-xl text-gray-300 leading-relaxed mb-6 font-normal">
                  {isEn ? (
                    <>
                      Having a website is meaningless if qualified buyers cannot find it. We build a <strong>custom, conversion-tuned platform</strong> and run your <strong>Google & Meta advertising campaigns</strong> so qualified leads arrive straight into your WhatsApp and inbox.
                    </>
                  ) : (
                    <>
                      No basta con tener una página web si nadie la visita. Te diseñamos un <strong>sitio moderno a la medida</strong> y operamos tus <strong>campañas en Google y Meta</strong> para que recibas prospectos calificados directo en tu WhatsApp y correo.
                    </>
                  )}
                </p>

                <div className="hero-cta flex flex-col sm:flex-row gap-3.5 w-full mb-6">
                  <WhatsAppButton
                    buttonText={isEn ? 'Speak with a strategist 💬' : 'Hablar con un estratega 💬'}
                    locationTag="growth_hero_primary"
                    presetMessage={
                      isEn
                        ? 'Hi Mauricio, I want to explore how the Website + Growth plan works for my business 🚀'
                        : 'Hola Mauricio, quiero saber cómo funciona el plan Sitio + Crecimiento para mi empresa 🚀'
                    }
                    className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-gradient-to-r from-[#00b4a6] to-[#009b8e] hover:from-[#00c7b7] hover:to-[#00b4a6] text-white text-base sm:text-lg font-extrabold shadow-[0_0_30px_rgba(0,180,166,0.35)] hover:shadow-[0_0_40px_rgba(0,180,166,0.5)] transition-all transform hover:-translate-y-0.5"
                  />

                  <a
                    href="#que-incluye"
                    className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-base-200/80 hover:bg-base-200 border border-white/10 text-gray-200 hover:text-white text-sm font-bold text-center transition-all flex items-center justify-center gap-2 hover:border-white/30"
                  >
                    <span>{isEn ? 'See what is included' : 'Ver lo que incluye'}</span>
                    <span className="text-[#00b4a6] font-extrabold">↓</span>
                  </a>
                </div>

                <div className="hero-trust space-y-2.5 text-xs sm:text-sm text-gray-300 font-medium bg-[#0b1c2b]/90 border border-white/10 rounded-2xl p-4.5 w-full shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2.5 text-[#00b4a6] font-bold">
                    <Check className="w-4 h-4 shrink-0 text-[#00b4a6]" />
                    <span>{isEn ? 'Full custom website engineering (zero generic templates)' : 'Sitio web completo diseñado a la medida (sin plantillas rígidas)'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#00b4a6] font-semibold">
                    <Check className="w-4 h-4 shrink-0 text-[#00b4a6]" />
                    <span>{isEn ? 'Active weekly management & optimization of Google & Meta Ads' : 'Gestión y optimización continua de pauta en Google Ads & Meta'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-amber-300 font-semibold">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{isEn ? 'Technical SEO for Google Search and AI engines (ChatGPT)' : 'SEO técnico para motores de búsqueda tradicionales y ChatGPT'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Lead Form */}
              <div className="hero-form-card lg:col-span-6 w-full relative">
                <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#00b4a6]/50 via-white/10 to-[#0069a9]/30 shadow-[0_0_60px_rgba(0,180,166,0.25)]">
                  <GrowthLeadForm locale={locale} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. EL PROBLEMA DE LOS SITIOS ESTÁTICOS */}
        <section className="gsap-section py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3.5 py-1 rounded-full mb-3 inline-block">
              {isEn ? 'THE #1 MISTAKE' : 'EL ERROR NÚMERO 1'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              {isEn
                ? 'A pretty website with zero traffic is like opening a luxury store in the middle of a desert'
                : 'Tener una página web bonita sin tráfico es como abrir una tienda en medio del desierto'}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {isEn
                ? 'Businesses often invest heavily in a website and wonder why the phone never rings. A website requires an intentional acquisition engine that positions your offer in front of qualified buyers the exact second they need you.'
                : 'Muchas empresas invierten miles de pesos en una web y luego se preguntan por qué nadie les llama. Un sitio necesita un motor de adquisición constante que ponga tu oferta frente a compradores calificados en el momento exacto en que necesitan tu servicio.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: isEn ? '"I already have a website, but it generates zero sales."' : '"Ya tengo página web, pero no me genera ni una venta."',
                desc: isEn ? 'Without active ad funnels and conversion optimization, prospective clients never discover your existence.' : 'Sin campañas activas ni optimización de conversión, los usuarios nunca llegan a conocerte ni a solicitar presupuestos.',
              },
              {
                quote: isEn ? '"I spent money on Facebook ads and only burned my budget."' : '"Gasté en anuncios de Facebook y solo perdí dinero."',
                desc: isEn ? 'Advertising without dedicated landing pages, pixel telemetry, and A/B testing wastes money on empty clicks.' : 'Anunciarse sin páginas de aterrizaje optimizadas, sin seguimiento de píxeles ni pruebas A/B quema tu presupuesto en clicks vacíos.',
              },
              {
                quote: isEn ? '"Traditional agencies charged a fortune and only sent vanity metrics."' : '"Las agencias grandes me cobran fortunas y solo mandan reportes con métricas vanidosas."',
                desc: isEn ? 'We do not focus on meaningless social likes. We track real inbound phone calls, WhatsApp chats, and quote requests.' : 'A nosotros no nos interesan los "likes", nos interesan los prospectos reales con nombre, teléfono y necesidad de compra.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-base-100/60 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00b4a6]/40 transition-colors"
              >
                <div className="mb-4">
                  <span className="text-3xl font-serif text-[#00b4a6] leading-none">“</span>
                  <p className="text-lg font-bold text-white mb-2">{item.quote}</p>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
                <span className="text-xs font-semibold text-red-400 bg-red-500/10 py-1 px-3 rounded-full w-fit">
                  {isEn ? 'Common Cash Drain' : 'Fuga de dinero común'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. LOS 4 PILARES DEL SISTEMA DE CRECIMIENTO */}
        <section id="que-incluye" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00b4a6] bg-[#00b4a6]/15 px-3 py-1 rounded-full mb-3 inline-block">
              {isEn ? 'INTEGRATED REVENUE ENGINE' : 'SISTEMA INTEGRADO'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              {isEn ? 'The 4 pillars included in your monthly subscription' : 'Los 4 pilares incluidos en tu suscripción mensual'}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              {isEn
                ? 'One single senior technical and marketing team running your entire digital funnel.'
                : 'Un solo equipo estratégico y técnico a cargo de todo tu embudo digital.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pilar 1 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#00b4a6]/20 border border-[#00b4a6]/40 flex items-center justify-center text-[#00b4a6] mb-6">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {isEn ? '1. Premium Custom Next.js Website' : '1. Sitio web premium a la medida'}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {isEn
                    ? 'Built with cutting-edge Next.js architecture. Sub-1.5 second loading speed, mobile-first design, and persuasive copy engineered to convert visitors into clients.'
                    : 'Diseñado con arquitectura moderna (Next.js y Tailwind CSS). Carga ultrarrápida (menos de 1.5s), diseño responsivo perfecto para smartphones y copywriting persuasivo enfocado en captación.'}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Exclusive UI/UX design adapted to your brand identity' : 'Diseño UX/UI exclusivo adaptado a tu identidad'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Dedicated landing sections for key service lines' : 'Páginas de aterrizaje dedicadas para tus servicios clave'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Seamless integration with WhatsApp, forms, and CRM' : 'Integración directa con WhatsApp, formularios y CRM'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {isEn ? '2. Google Search & Meta Ad Management' : '2. Campañas de pauta en Google y Meta'}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {isEn
                    ? 'We capture high-intent buyers in Google Search when they actively look for your solutions, and re-engage prospects across Instagram and Facebook.'
                    : 'Capturamos clientes con alta intención de compra en Google Search cuando buscan tus servicios, y re-impactamos con anuncios visuales en Facebook e Instagram.'}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Hyper-targeted geo-fencing and negative keyword filtering' : 'Segmentación hiperlocal y filtrado de palabras negativas'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Continuous A/B copy and creative banner testing' : 'Creación y prueba continua de copys e imágenes publicitarias'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Weekly bid management to lower Cost-Per-Lead (CPL)' : 'Optimización semanal del Costo por Lead (CPL)'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-6">
                  <Bot className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {isEn ? '3. SEO for Google & Generative AI Engines' : '3. SEO para Google y Motores de IA'}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {isEn
                    ? 'We optimize not only for classic Google Search rankings, but structure your data so ChatGPT and generative models recommend your business as the premier authority.'
                    : 'No solo posicionamos tu negocio en los resultados tradicionales de Google; preparamos tus datos estructurados y contenido para que modelos como ChatGPT y Perplexity te recomienden como la opción líder.'}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Schema.org structured data for local entities & services' : 'Schema.org estructurado para entidades locales y servicios'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Generative Engine Optimization (GEO) for AI citations' : 'Optimización para consultas en lenguaje natural (GEO)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Google Business Profile local map optimization' : 'Alta y optimización de ficha en Google Business Profile'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pilar 4 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {isEn ? '4. Inbound Lead Telemetry & Real ROI Tracking' : '4. Medición real de prospectos y retorno'}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {isEn
                    ? 'No confusing agency jargon. We track exactly how many WhatsApp inquiries, phone calls, and forms were received, which channel brought them, and your acquisition cost.'
                    : 'Nada de tecnicismos incomprensibles. Configuramos telemetría completa para saber cuántos mensajes de WhatsApp recibiste, de qué canal llegaron y qué costo representaron para tu negocio.'}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Monthly executive report with commercial business insights' : 'Reporte mensual ejecutivo con análisis comercial'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Verified tracking on WhatsApp chats and phone clicks' : 'Seguimiento de clics a llamada y chats de WhatsApp'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>{isEn ? 'Monthly alignment strategy session to scale results' : 'Reunión de alineación mensual para escalar resultados'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMPARATIVA DE INVERSIÓN */}
        <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                {isEn ? 'Why Website + Growth is the smartest choice?' : '¿Por qué Sitio + Crecimiento es la opción más inteligente?'}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                {isEn
                  ? 'Compare hiring disjointed freelancers or traditional agencies against our integrated model.'
                  : 'Compara contratar agencias tradicionales o freelancers aislados frente a una solución integrada.'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300 border border-white/10 rounded-2xl overflow-hidden">
                <thead className="bg-base-200/80 text-white uppercase text-xs font-bold">
                  <tr>
                    <th className="py-4 px-6">{isEn ? 'Service Component' : 'Aspecto'}</th>
                    <th className="py-4 px-6 text-[#00b4a6] bg-[#00b4a6]/10 border-x border-[#00b4a6]/30">
                      {isEn ? 'Idealy Website + Growth' : 'Idealy Sitio + Crecimiento'}
                    </th>
                    <th className="py-4 px-6">{isEn ? 'Traditional Agency' : 'Agencia Tradicional'}</th>
                    <th className="py-4 px-6">{isEn ? 'Disjointed Freelancer' : 'Freelancer Suelto'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">{isEn ? 'Web Development' : 'Desarrollo Web'}</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      {isEn ? 'Included custom engineering (Next.js)' : 'Incluido a la medida (Next.js)'}
                    </td>
                    <td className="py-4 px-6">$25,000+ upfront fee</td>
                    <td className="py-4 px-6">{isEn ? 'Slow WordPress template' : 'Plantilla WordPress lenta'}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">{isEn ? 'Ad Campaign Management' : 'Gestión de Ads (Google/Meta)'}</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      {isEn ? 'Included & optimized weekly' : 'Incluida y optimizada semanalmente'}
                    </td>
                    <td className="py-4 px-6">$10,000/mo extra</td>
                    <td className="py-4 px-6">{isEn ? 'Subcontracts or inexperienced' : 'No la domina o subcontrata'}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">{isEn ? 'SEO for Search & AI' : 'SEO para Google & IA'}</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      {isEn ? 'Included (ChatGPT + Google)' : 'Incluido (ChatGPT + Search)'}
                    </td>
                    <td className="py-4 px-6">{isEn ? 'Extra recurring charge' : 'Costo adicional mensual'}</td>
                    <td className="py-4 px-6">{isEn ? 'Basic or non-existent' : 'Básico o nulo'}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">{isEn ? 'Page Load Speed' : 'Velocidad de Carga'}</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      {isEn ? 'Sub-1.5 seconds (Top 5%)' : 'Menos de 1.5 segundos (Top 5%)'}
                    </td>
                    <td className="py-4 px-6">{isEn ? 'Variable (3 to 6 sec)' : 'Variable (3 a 6 seg)'}</td>
                    <td className="py-4 px-6">{isEn ? 'Slow due to bloated plugins' : 'Suele ser lenta por plugins'}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">{isEn ? 'Total Monthly Investment' : 'Costo Total Mensual'}</td>
                    <td className="py-4 px-6 text-white font-extrabold bg-[#00b4a6]/10 border-x border-[#00b4a6]/30 text-base">
                      {isEn ? '$8,500 MXN (~$500 USD)' : '$8,500 MXN + IVA'}
                    </td>
                    <td className="py-4 px-6">$18,000 - $35,000 MXN</td>
                    <td className="py-4 px-6">{isEn ? 'Uncertain / zero support' : 'Incierto / Sin soporte'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. CASO DE ÉXITO Y EQUIPO */}
        <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0b1c2b] border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#00b4a6] shadow-xl">
                <Image
                  src="/img/express/express_mauricio.jpg"
                  alt="Mauricio Casado - Idealy"
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00b4a6] block mb-2">
                {isEn ? 'SENIOR EXPERTISE' : 'ESTRATEGIA PERSONALIZADA'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {isEn
                  ? 'Speak directly with senior engineers and growth strategists'
                  : 'Trato directo con ingenieros y estrategas senior'}
              </h2>
              <p className="text-base text-gray-300 leading-relaxed mb-4">
                {isEn
                  ? 'At Idealy we never delegate your core business to junior interns or outsourced call centers. We build software and customer acquisition systems laser-focused on generating high-converting inbound leads.'
                  : 'En Idealy no delegamos tu negocio a practicantes junior ni a agencias tercerizadas. Desarrollamos software y estrategias de adquisición digital con foco absoluto en que tu teléfono y tu WhatsApp reciban prospectos rentables.'}
              </p>
              <p className="text-sm font-semibold text-white">
                — Mauricio Casado, {isEn ? 'Founder of Idealy' : 'Fundador de Idealy'}
              </p>
            </div>
          </div>
        </section>

        {/* 6. PREGUNTAS FRECUENTES */}
        <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                {isEn ? 'Frequently Asked Questions about Website + Growth' : 'Preguntas frecuentes sobre Sitio + Crecimiento'}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                {isEn ? 'Everything you need to know before initiating.' : 'Todo lo que necesitas saber antes de comenzar.'}
              </p>
            </div>

            <GrowthFAQAccordion locale={locale} />
          </div>
        </section>

        {/* 7. CIERRE Y CTA FINAL */}
        <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase mb-4">
            {isEn ? '🎯 PLAN YOUR GROWTH' : '🎯 PLANIFICA TU CRECIMIENTO'}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            {isEn ? 'Turn your website into your highest-performing sales channel' : 'Convierte tu sitio web en tu mejor canal de ventas'}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? 'Let us talk about your lead generation targets. We will deliver a custom competitive audit and actionable proposal.'
              : 'Platiquemos sobre tus metas de prospección. Te entregaremos una propuesta a la medida de tu sector y tus competidores.'}
          </p>

          <div className="flex justify-center mb-10">
            <WhatsAppButton
              buttonText={isEn ? 'Request audit and strategy via WhatsApp 💬' : 'Solicitar diagnóstico y plan por WhatsApp 💬'}
              locationTag="growth_cierre_primary"
              presetMessage={
                isEn
                  ? 'Hi Mauricio, I want to schedule a growth diagnosis for my company under the Website + Growth plan 📈'
                  : 'Hola Mauricio, quiero agendar un diagnóstico de crecimiento para mi empresa con el plan Sitio + Crecimiento 📈'
              }
              className="py-4 px-10 rounded-2xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-lg sm:text-xl font-extrabold shadow-2xl transition-all"
            />
          </div>

          <div className="max-w-xl mx-auto text-left">
            <GrowthLeadForm locale={locale} />
          </div>
        </section>

        {/* Footer minimal */}
        <footer className="py-8 px-4 text-center border-t border-white/10 text-xs text-gray-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Idealy. {isEn ? 'All rights reserved. Puebla, Mexico.' : 'Todos los derechos reservados. Puebla, México.'}</p>
            <div className="flex gap-4">
              <Link href={`/${locale}/desarrollo-a-la-medida`} className="hover:text-gray-300 underline">
                {isEn ? 'Custom Software' : 'Software a la medida'}
              </Link>
              <Link href={`/${locale}/pagina-express`} className="hover:text-gray-300 underline">
                {isEn ? 'Express Page' : 'Página Express'}
              </Link>
              <Link href={`/${locale}/privacy-policy`} className="hover:text-gray-300 underline">
                {isEn ? 'Privacy Policy' : 'Aviso de Privacidad'}
              </Link>
            </div>
          </div>
        </footer>

        {/* Mobile Sticky WhatsApp Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07131e]/95 backdrop-blur-md p-3 border-t border-[#00b4a6]/40 shadow-2xl">
          <WhatsAppButton
            buttonText={isEn ? 'Quote Website + Growth 💬' : 'Cotizar Sitio + Crecimiento 💬'}
            locationTag="growth_mobile_sticky_bottom"
            presetMessage={
              isEn
                ? 'Hi Mauricio, I am interested in the Website + Growth plan 🚀'
                : 'Hola Mauricio, me interesa el plan Sitio + Crecimiento por $8,500/mes 🚀'
            }
            className="w-full py-3.5 px-6 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-base font-extrabold shadow-lg"
          />
        </div>
      </div>
    </ExpressGSAPInitializer>
  );
}
