import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import WhatsAppButton from '@/app/ui/express/WhatsAppModal';
import ExpressLeadForm from '@/app/ui/express/ExpressLeadForm';
import ExpressGSAPInitializer from '@/app/ui/express/ExpressGSAPInitializer';
import { locales } from '../../../i18n/routing';

const FAQAccordion = dynamic(() => import('./FAQAccordion'), {
  loading: () => <div className="w-full min-h-[250px]" />,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: typeof locales[number] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const baseUrl = 'https://www.idealy.com.mx';

  return {
    metadataBase: new URL(baseUrl),
    title: isEn
      ? 'Express Website ready in 5 days for $6,000 MXN + VAT | Idealy'
      : 'Tu página web lista en 5 días por $6,000 + IVA | Idealy Página Express',
    description: isEn
      ? 'Get found on Google and receive WhatsApp messages directly. Free guide with 10 WhatsApp sales messages included.'
      : 'Que tus clientes te encuentren en Google y te escriban directo a WhatsApp. Recibe gratis la guía: 10 mensajes listos para vender por WhatsApp.',
    alternates: {
      canonical: `${baseUrl}/${locale}/pagina-express`,
      languages: {
        en: `${baseUrl}/en/pagina-express`,
        es: `${baseUrl}/es/pagina-express`,
        'x-default': `${baseUrl}/es/pagina-express`,
      },
    },
    openGraph: {
      title: isEn
        ? 'Express Website ready in 5 days for $6,000 MXN + VAT | Idealy'
        : 'Tu página web lista en 5 días por $6,000 + IVA | Idealy Página Express',
      description: isEn
        ? 'Custom professional website for your business. Includes hosting, domain, copywriting, and WhatsApp button.'
        : 'Página web profesional a la medida para tu negocio. Incluye hosting, dominio, textos que venden y botón de WhatsApp. Precios más IVA.',
      url: `${baseUrl}/${locale}/pagina-express`,
      siteName: 'Idealy',
      images: [
        {
          url: 'https://www.idealy.com.mx/img/express/express_panaderia.jpg',
          width: 1200,
          height: 630,
          alt: 'Idealy Página Express $6,000 + IVA',
        },
      ],
      locale: isEn ? 'en_US' : 'es_MX',
      type: 'website',
    },
  };
}

export default async function PaginaExpressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const expressFaqs = [
    {
      q: '¿Cuánto cuesta una página web para mi negocio con Idea.ly?',
      a: 'La Página Express de Idea.ly cuesta $6,000 MXN más IVA ($6,960 con IVA incluido). Con el certificado de la guía pagas $5,000 + IVA por 7 días. Incluye diseño a la medida, textos, botón de WhatsApp, hosting por 1 año y dominio .com por 1 año. Se paga 50% al iniciar y 50% al entregar.',
    },
    {
      q: '¿En cuánto tiempo está lista mi página web?',
      a: 'En 5 días hábiles a partir de que entregas tu logo, tus fotos y el cuestionario. Si no está lista en ese plazo, te devolvemos tu anticipo completo.',
    },
    {
      q: '¿Idea.ly emite factura?',
      a: 'Sí. Idea.ly emite factura (CFDI) por el total del servicio. El precio de la Página Express es de $6,000 MXN más IVA (o $5,000 + IVA con certificado vigente).',
    },
    {
      q: '¿El dominio está incluido en la Página Express?',
      a: 'Sí, se incluye un dominio con terminación .com por 1 año, registrado a nombre de tu negocio.',
    },
    {
      q: '¿Qué necesito para empezar mi página web?',
      a: 'Tu logo, algunas fotos de tu negocio y responder un cuestionario de 10 minutos. Con eso Idea.ly escribe los textos y diseña tu página.',
    },
    {
      q: '¿La página web es mía?',
      a: 'Sí. El dominio se registra a nombre de tu negocio y el contenido de la página es tuyo.',
    },
  ];

  return (
    <ExpressGSAPInitializer>
      <div className="w-full bg-[#07131e] text-gray-100 min-h-screen font-sans selection:bg-[#00b4a6] selection:text-white pb-20 lg:pb-0 overflow-x-hidden">
        {/* Dynamic Schema.org FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              '@id': `https://www.idealy.com.mx/${locale}/pagina-express#faq`,
              mainEntity: expressFaqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a,
                },
              })),
            }),
          }}
        />
        {/* Dynamic Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Idealy Página Express',
              image: 'https://www.idealy.com.mx/img/express/express_panaderia.jpg',
              description:
                'Página web profesional lista en 5 días hábiles con botón de WhatsApp, hosting, dominio y copywriting incluido.',
              offers: {
                '@type': 'Offer',
                price: '6000',
                priceCurrency: 'MXN',
                availability: 'https://schema.org/InStock',
                validFrom: '2026-01-01',
                priceValidUntil: '2026-12-31',
                seller: {
                  '@type': 'Organization',
                  name: 'Idealy',
                  url: 'https://www.idealy.com.mx',
                },
              },
            }),
          }}
        />

        {/* Dedicated Minimal Header */}
        <header className="w-full border-b border-white/10 bg-[#07131e]/90 backdrop-blur-md sticky top-0 z-40 py-4 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
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
                PÁGINA EXPRESS · TOMAMOS 10 PÁGINAS AL MES POR CARGA DE TRABAJO
              </span>
              <WhatsAppButton
                buttonText="¿Dudas? Escríbenos 💬"
                locationTag="header_nav"
                presetMessage="Hola Mauricio, tengo una duda sobre la Página Express"
                direct={true}
                className="py-2 px-4 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-colors"
              />
            </div>
          </div>
        </header>

        {/* 1. HERO SECTION WITH ACCESSIBLE FORM */}
        <section className="w-full relative pt-8 pb-16 overflow-hidden">
          {/* High-tech Grid Background Pattern (Full Width) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00b4a615_1px,transparent_1px),linear-gradient(to_bottom,#00b4a615_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* Background glow orbs (Full Width) */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full [background:radial-gradient(circle,rgba(0,180,166,0.25),transparent_70%)] pointer-events-none"></div>
          <div className="absolute top-10 right-1/4 translate-x-1/2 w-[600px] h-[600px] rounded-full [background:radial-gradient(circle,rgba(0,105,169,0.30),transparent_70%)] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Offer & Headline */}
              <div className="lg:col-span-6 flex flex-col items-start pt-2">
                <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00b4a6]/20 to-[#0069a9]/20 border border-[#00b4a6]/40 text-[#00b4a6] font-extrabold text-xs tracking-wider uppercase mb-5 shadow-[0_0_20px_rgba(0,180,166,0.2)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b4a6] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00b4a6]"></span>
                  </span>
                  <span>🎁 GUÍA GRATIS: 10 MENSAJES LISTOS PARA VENDER POR WHATSAPP</span>
                </div>

                <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight mb-5">
                  Tu página web lista en 5 días por{' '}
                  <span className="inline-block px-3.5 py-1 rounded-2xl bg-gradient-to-r from-[#00b4a6] to-[#008075] text-white shadow-[0_0_35px_rgba(0,180,166,0.6)] font-black tracking-tight border border-white/20 transform hover:scale-105 transition-transform">
                    $6,000
                  </span>{' '}
                  <span className="text-xs sm:text-sm text-amber-300 font-bold tracking-wider uppercase align-super">+ IVA</span>
                </h1>

                <p className="hero-subtitle text-base sm:text-xl text-gray-300 leading-relaxed mb-6 font-normal">
                  Que tus clientes te encuentren en Google y te escriban directo a WhatsApp. Llena el formulario y recibe gratis al instante la <strong>Guía: 10 mensajes listos para vender por WhatsApp</strong>.
                </p>

                {/* Hero CTAs: One clear path to the guide form + secondary WhatsApp link */}
                <div className="hero-cta flex flex-col sm:flex-row gap-3.5 w-full mb-6">
                  <a
                    href="#formulario-guia"
                    className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-gradient-to-r from-[#00b4a6] to-[#009b8e] hover:from-[#00c7b7] hover:to-[#00b4a6] text-white text-base sm:text-lg font-extrabold shadow-[0_0_30px_rgba(0,180,166,0.35)] hover:shadow-[0_0_40px_rgba(0,180,166,0.5)] transition-[transform,box-shadow] duration-200 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Recibir mi guía gratis por WhatsApp</span>
                    <span className="font-extrabold text-xl">↓</span>
                  </a>

                  <WhatsAppButton
                    buttonText="¿Dudas? Escríbenos 💬"
                    locationTag="hero_secondary"
                    presetMessage="Hola Mauricio, tengo una duda sobre la Página Express"
                    direct={true}
                    className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-base-200/80 hover:bg-base-200 border border-white/10 text-gray-200 hover:text-white text-sm font-bold text-center transition-[background-color,border-color,color] duration-200 flex items-center justify-center gap-2 hover:border-white/30 cursor-pointer"
                  />
                </div>

                <div className="hero-trust space-y-2.5 text-xs sm:text-sm text-gray-300 font-medium bg-[#0b1c2b]/90 border border-white/10 rounded-2xl p-4.5 w-full shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2.5 text-[#00b4a6] font-bold">
                    <span className="w-5 h-5 rounded-full bg-[#00b4a6]/20 flex items-center justify-center text-xs shrink-0">✓</span>
                    <span>5 días hábiles desde que nos entregas tu información, o te devolvemos tu anticipo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-amber-300 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs shrink-0">🎁</span>
                    <span>Guía: 10 mensajes listos para vender por WhatsApp (acercamiento, venta y recuperación)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-300 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">⚡</span>
                    <span>Tomamos 10 páginas al mes por carga de trabajo, para cumplir los 5 días</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Accessible Form directly in Hero */}
              <div id="formulario-guia" className="hero-form-card lg:col-span-6 w-full relative">
                <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#00b4a6]/50 via-white/10 to-[#0069a9]/30 shadow-[0_0_60px_rgba(0,180,166,0.25)]">
                  <ExpressLeadForm id="form-hero" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1.5 CÓMO PRESENTAR EL OBSEQUIO: GUÍA Y CERTIFICADO */}
        <section className="py-14 px-4 sm:px-8 bg-gradient-to-b from-[#07131e] to-[#0b1c2b] border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#00b4a6] bg-[#00b4a6]/15 px-3 py-1 rounded-full border border-[#00b4a6]/30 mb-3 inline-block">
                OBSEQUIO GRATUITO AL REGISTRARTE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                Guía: 10 mensajes listos para vender por WhatsApp
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                10 mensajes ya escritos para WhatsApp: acercamiento, venta en frío y recuperación de clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Muestra real legible de un mensaje de la guía */}
              <div className="md:col-span-7 bg-[#07131e] border border-[#00b4a6]/40 rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                    <span className="text-xs font-mono text-gray-400 ml-2">Muestra de la guía · Mensaje 1</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#00b4a6] bg-[#00b4a6]/15 px-2.5 py-0.5 rounded-md">
                    Acercamiento rápido
                  </span>
                </div>

                <div className="space-y-4 font-sans">
                  <div className="bg-[#005c4b]/30 border border-[#00a884]/40 rounded-2xl p-4 text-sm text-gray-100">
                    <p className="text-xs text-[#00a884] font-bold mb-1 uppercase tracking-wide">Mensaje listo para copiar y pegar:</p>
                    <p className="leading-relaxed text-sm sm:text-base">
                      &quot;Hola <strong>[Nombre]</strong> 👋 Gracias por escribirnos a <strong>[Tu Negocio]</strong>. Con gusto te paso la información de <strong>[Servicio o Producto]</strong>. ¿Buscas cotización para esta semana o solo estás revisando opciones?&quot;
                    </p>
                  </div>

                  <div className="text-xs text-gray-300 bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-1">
                    <p className="font-bold text-white">¿Por qué funciona este mensaje?</p>
                    <p>Filtra de inmediato a quien tiene urgencia real de compra sin hacerte perder tiempo ni sonar invasivo.</p>
                  </div>
                </div>
              </div>

              {/* Qué contiene y certificado en segundo plano */}
              <div className="md:col-span-5 space-y-3.5">
                <div className="bg-base-100/60 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <span className="text-[#00b4a6] font-extrabold">01.</span> Acercamiento inicial (3 mensajes)
                  </h4>
                  <p className="text-xs text-gray-300">Responde en menos de 1 minuto y califica si el prospecto está listo para cotizar.</p>
                </div>

                <div className="bg-base-100/60 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <span className="text-[#00b4a6] font-extrabold">02.</span> Seguimiento natural (4 mensajes)
                  </h4>
                  <p className="text-xs text-gray-300">Avanza la venta resolviendo dudas comunes sin parecer vendedor desesperado.</p>
                </div>

                <div className="bg-base-100/60 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <span className="text-[#00b4a6] font-extrabold">03.</span> Recuperación de clientes (3 mensajes)
                  </h4>
                  <p className="text-xs text-gray-300">Reconecta de forma profesional con personas que te dejaron en visto.</p>
                </div>

                {/* El certificado en segundo plano */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-gray-300">
                  <p className="font-bold text-amber-300 mb-1">🎁 Certificado de Descuento ($5,000 + IVA)</p>
                  <p>Al registrarte recibes además tu certificado por <strong>$5,000 + IVA en lugar de $6,000</strong>, vigente durante 7 días por si decides hacer tu página web con nosotros.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. EL PROBLEMA */}
        <section className="gsap-section py-16 px-4 sm:px-8 bg-[#0b1c2b] border-b border-white/5">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Si no te encuentran en Google, le compran a tu competencia
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Hoy, antes de llamar o visitar un negocio, la gente lo busca en su celular. Si no apareces, o si lo que encuentran es un perfil de Facebook desordenado, se van con el siguiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: '"Tengo Facebook, pero no me llegan clientes nuevos."',
                desc: 'Las redes sociales muestran tu negocio solo a quienes ya te siguen. Un sitio en Google atrapa a quien te busca activamente.',
              },
              {
                quote: '"Me cotizaron una página en $20,000 y tardaban un mes."',
                desc: 'Las agencias tradicionales cobran de más por procesos lentos. Nosotros eliminamos la paja y te entregamos rápido.',
              },
              {
                quote: '"Un sobrino me la iba a hacer… y nunca la terminó."',
                desc: 'Los proyectos informales se quedan a medias. En Idealy firmamos un compromiso de entrega de 5 días con garantía.',
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
                  Problema común
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. LA SOLUCIÓN */}
        <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Una página hecha para traerte clientes, no para verse bonita
              </h2>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
                Diseñamos tu página con tu marca, explicamos lo que haces en palabras que tus clientes entienden y ponemos un botón para que te escriban por WhatsApp en un clic.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Palabras directas y sinceras que entienden tus clientes reales',
                  'Estructura fluida optimizada para tocados de pantalla en teléfono',
                  'Botones flotantes directo a tu chat personal o de empresa',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00b4a6]/20 text-[#00b4a6] flex items-center justify-center font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <span className="text-sm sm:text-base text-gray-200">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-[#00b4a6]/30 shadow-2xl">
                <Image
                  src="/img/express/express_mecanico.jpg"
                  alt="Solución Idealy Página Express comparativa"
                  width={700}
                  height={450}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. QUÉ INCLUYE Y PRECIO TRANSPARENTE */}
        <section id="que-incluye" className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                Todo lo que necesitas por $6,000 <span className="text-base text-gray-400 font-semibold">+ IVA</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Sin sorpresas, sin cargos ocultos, sin mensualidades obligatorias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                { title: 'Diseño a la medida de tu negocio', desc: 'Nada de plantillas genéricas. Adaptado a tus colores y tu giro.' },
                { title: 'Textos que venden', desc: 'Nosotros los redactamos para que tu cliente entienda lo que ofreces.' },
                { title: 'Botón de WhatsApp integrado', desc: 'Para que te escriban al instante con un mensaje prellenado.' },
                { title: 'Rápida en cualquier celular', desc: 'Carga en menos de 2 segundos para no perder ni un visitante.' },
                { title: 'Lista para anuncios en Google y Facebook', desc: 'Optimizada tecnológicamente para tus campañas pagadas.' },
                { title: 'Hosting y dominio por 1 año incluidos', desc: 'Tu propio nombre en internet (ej. tunegocio.com) listo.' },
                { title: 'Tu negocio dado de alta en Google Maps', desc: 'Aparece cuando busquen tu categoría en tu ciudad.' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-base-100/80 border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-[#00b4a6]/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0069a9]/30 text-[#00b4a6] flex items-center justify-center font-bold text-lg shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Caja de Precio Transparente y Certificado */}
            <div className="bg-gradient-to-r from-[#0069a9]/40 to-[#00b4a6]/40 border border-[#00b4a6]/50 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00b4a6] block mb-2">
                PRECIO CLARO Y TRANSPARENTE
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Precio de lanzamiento: $6,000 MXN <span className="text-xs sm:text-sm font-semibold text-gray-300">+ IVA</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 mb-5 leading-relaxed">
                Con el certificado que recibes al pedir la guía pagas <strong>$5,000 + IVA en lugar de $6,000</strong>, por 7 días desde que te registras.
              </p>
              <a
                href="#formulario-guia"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-sm font-extrabold shadow-md transition-all cursor-pointer"
              >
                <span>Recibir mi guía gratis y mi certificado</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* 5. CÓMO FUNCIONA */}
        <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Tu página en línea en 3 pasos
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Un proceso simple y transparente de principio a fin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              {[
                {
                  num: '1',
                  title: 'Aparta tu lugar con el 50% ($3,000 + IVA)',
                  desc: 'Aseguras tu lugar dentro de los 10 espacios disponibles de este mes.',
                },
                {
                  num: '2',
                  title: 'Responde un cuestionario de 10 minutos',
                  desc: 'Nos envías tu logo, tus fotos básicas y las respuestas sobre tu negocio.',
                },
                {
                  num: '3',
                  title: 'En 5 días hábiles tu página está publicada',
                  desc: 'Revisamos los detalles juntos, la publicamos y pagas el resto al entregar.',
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start bg-base-100/50 p-5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-2xl bg-[#00b4a6] text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-md">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-300">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/img/express/express_robots.jpg"
                  alt="Proceso de construcción rápida Idealy"
                  width={700}
                  height={450}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7. COMPARATIVA */}
        <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto overflow-x-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Haz cuentas
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Compara por qué la Página Express es la mejor inversión para tu negocio.
            </p>
          </div>

          <div className="min-w-[640px] bg-base-100/70 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0069a9]/30 text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5">Característica</th>
                  <th className="p-4 sm:p-5 bg-[#00b4a6]/20 text-[#00b4a6] text-sm">
                    Idealy Página Express
                  </th>
                  <th className="p-4 sm:p-5 text-gray-400">Agencia tradicional</th>
                  <th className="p-4 sm:p-5 text-gray-400">Hacerla tú en Wix</th>
                  <th className="p-4 sm:p-5 text-gray-400">Freelancer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-gray-200">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Precio</td>
                  <td className="p-4 sm:p-5 font-black text-[#00b4a6] bg-[#00b4a6]/10 text-base">
                    $6,000 <span className="text-xs text-gray-300 font-normal">+ IVA</span>
                  </td>
                  <td className="p-4 sm:p-5 text-gray-400">$15,000+</td>
                  <td className="p-4 sm:p-5 text-gray-400">Renta mensual siempre</td>
                  <td className="p-4 sm:p-5 text-gray-400">$5,000–$25,000</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Tiempo</td>
                  <td className="p-4 sm:p-5 font-bold text-white bg-[#00b4a6]/10">5 días</td>
                  <td className="p-4 sm:p-5 text-gray-400">3–6 semanas</td>
                  <td className="p-4 sm:p-5 text-gray-400">Tu tiempo valioso</td>
                  <td className="p-4 sm:p-5 text-gray-400">Incierto</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Garantía</td>
                  <td className="p-4 sm:p-5 font-bold text-[#00b4a6] bg-[#00b4a6]/10">✓ Sí</td>
                  <td className="p-4 sm:p-5 text-gray-400">Rara vez</td>
                  <td className="p-4 sm:p-5 text-gray-400">No</td>
                  <td className="p-4 sm:p-5 text-gray-400">No</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Textos incluidos</td>
                  <td className="p-4 sm:p-5 font-bold text-[#00b4a6] bg-[#00b4a6]/10">✓ Sí</td>
                  <td className="p-4 sm:p-5 text-gray-400">A veces</td>
                  <td className="p-4 sm:p-5 text-gray-400">No</td>
                  <td className="p-4 sm:p-5 text-gray-400">No</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">La página es tuya</td>
                  <td className="p-4 sm:p-5 font-bold text-[#00b4a6] bg-[#00b4a6]/10">✓ Sí</td>
                  <td className="p-4 sm:p-5 text-gray-400">Sí</td>
                  <td className="p-4 sm:p-5 text-gray-400">No</td>
                  <td className="p-4 sm:p-5 text-gray-400">Depende</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 8. GARANTÍA */}
        <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#0069a9]/30 to-[#00b4a6]/30 border-2 border-[#00b4a6] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="w-28 h-28 rounded-full bg-[#00b4a6] text-white flex flex-col items-center justify-center font-black text-center p-2 shrink-0 shadow-xl border-4 border-white/20">
              <span className="text-2xl leading-none">5 DÍAS</span>
              <span className="text-[10px] tracking-wider uppercase">Garantía</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                5 días hábiles desde que nos entregas tu información, o te devolvemos tu anticipo.
              </h2>
              <p className="text-base text-gray-200 leading-relaxed mb-4">
                En cuanto nos entregas tu logo, fotos y el cuestionario de 10 minutos, empieza el reloj. Si no está lista en 5 días hábiles, te regresamos tus $3,000 + IVA de anticipo sin preguntas.
              </p>
              <a
                href="#formulario-guia"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer"
              >
                <span>Recibir mi guía gratis y mi certificado</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* 9. QUIÉN ESTÁ DETRÁS */}
        <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="bg-base-100/60 border border-white/10 rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#00b4a6] shadow-xl relative">
                <Image
                  src="/img/express/express_mauricio.jpg"
                  alt="Mauricio Casado - Idealy Puebla"
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00b4a6] block mb-2">
                EQUIPO REAL EN PUEBLA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Somos Idealy, un estudio de diseño y desarrollo en Puebla
              </h2>
              <p className="text-base text-gray-300 leading-relaxed mb-4">
                Desde 2017 diseñamos páginas y sistemas para negocios en México y Estados Unidos. Hablas directo con quien hace tu página, no con un vendedor.
              </p>
              <p className="text-sm font-semibold text-white">
                — Mauricio Casado, Fundador de Idealy
              </p>
            </div>
          </div>
        </section>

        {/* 10. PREGUNTAS FRECUENTES */}
        <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                Preguntas frecuentes
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Resolvemos tus dudas antes de empezar.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* 11. CIERRE Y FORMULARIO */}
        <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase mb-4">
              ⚡ 10 ESPACIOS POR MES
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Tomamos 10 páginas al mes por carga de trabajo, para cumplir los 5 días.
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Llena tus datos para recibir gratis la <strong>Guía: 10 mensajes listos para vender por WhatsApp</strong> y congelar tu precio en <strong>$5,000 + IVA</strong> durante 7 días.
            </p>
          </div>

          {/* Form component directly without confusing buttons above it */}
          <div className="max-w-2xl mx-auto mb-8">
            <ExpressLeadForm id="formulario-cierre" />
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              ¿Tienes alguna duda antes de registrarte?{' '}
              <a
                href="https://wa.me/522227179352?text=Hola%20Mauricio%2C%20tengo%20dudas%20sobre%20la%20P%C3%A1gina%20Express"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00b4a6] hover:underline font-bold"
              >
                Escríbenos directamente por WhatsApp 💬
              </a>
            </p>
          </div>
        </section>

        {/* Footer minimal */}
        <footer className="py-8 px-4 text-center border-t border-white/10 text-xs text-gray-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Idealy. Todos los derechos reservados. Puebla, México.</p>
            <Link href="/privacy-policy" className="hover:text-gray-300 underline">
              Aviso de Privacidad
            </Link>
          </div>
        </footer>

        {/* 6. STICKY MOBILE BOTTOM BAR */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07131e]/95 backdrop-blur-md p-3 border-t border-[#00b4a6]/40 shadow-2xl flex items-center gap-2">
          <a
            href="#formulario-guia"
            className="flex-1 py-3 px-4 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-center text-sm font-extrabold shadow-lg"
          >
            Recibir guía gratis por WhatsApp ↓
          </a>
          <a
            href="https://wa.me/522227179352?text=Hola%20Mauricio%2C%20tengo%20dudas%20sobre%20la%20P%C3%A1gina%20Express"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3.5 rounded-xl bg-[#0b1c2b] border border-white/20 text-gray-200 text-xs font-bold text-center flex items-center justify-center shrink-0"
          >
            ¿Dudas? 💬
          </a>
        </div>
      </div>
    </ExpressGSAPInitializer>
  );
}
