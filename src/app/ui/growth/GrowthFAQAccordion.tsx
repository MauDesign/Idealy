'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface GrowthFAQAccordionProps {
  locale?: string;
}

const GROWTH_FAQS_ES = [
  {
    q: '¿Qué incluye el plan de Sitio + Crecimiento por $8,500 MXN / mes?',
    a: 'Incluye el diseño e ingeniería completa de tu sitio web a la medida (optimizada para máxima conversión y velocidad), configuración y gestión continua de campañas en Google Ads y Meta Ads, optimización de SEO para Google y buscadores de Inteligencia Artificial (ChatGPT, Perplexity), seguimiento de conversiones y reporte ejecutivo mensual con análisis de prospectos obtenidos.',
  },
  {
    q: '¿El presupuesto de pauta de Google y Facebook está incluido en los $8,500?',
    a: 'No. Los $8,500 MXN cubren el desarrollo del sitio, la estrategia, copywriting comercial, optimización técnica, monitoreo diario, creación de anuncios y reportes. La inversión publicitaria se paga directamente desde tu cuenta publicitaria a Google y Meta (recomendamos a partir de $4,000 a $6,000 MXN al mes según tu mercado).',
  },
  {
    q: '¿Cuánto tiempo tarda en comenzar a generar prospectos calificados?',
    a: 'Las campañas de Google Ads y Meta pueden comenzar a generar prospectos desde los primeros 7 a 14 días posteriores al lanzamiento del sitio y las cuentas publicitarias. El SEO orgánico y el posicionamiento en IA va madurando acumulando autoridad mes con mes.',
  },
  {
    q: '¿El sitio web es de mi propiedad?',
    a: 'Sí, totalmente. A diferencia de agencias o plataformas de suscripción que bloquean tu código o retienen tu dominio, en Idea.ly el sitio, diseño, contenidos y cuentas publicitarias te pertenecen al 100%.',
  },
  {
    q: '¿Existe algún plazo forzoso o contrato de permanencia?',
    a: 'Recomendamos un periodo inicial de 3 meses para optimizar los algoritmos de puja y lograr el costo por adquisición (CPA) más bajo posible, pero no hay penalizaciones abusivas ni cláusulas ocultas. Trabajamos por resultados.',
  },
  {
    q: '¿Cómo medimos los resultados de cada campaña?',
    a: 'Implementamos Google Tag Manager, Google Analytics 4, Pixel de Meta y eventos de conversión en WhatsApp, llamadas y formularios. Sabrás con total exactitud de dónde provino cada prospecto y qué campaña fue la más rentable.',
  },
  {
    q: '¿Qué diferencia hay entre este plan y la Página Express de $6,000?',
    a: 'La Página Express es una solución de arranque rápido (entrega en 5 días) para tener presencia formal con dominio y botón de WhatsApp sin gestión mensual. El plan Sitio + Crecimiento es una estrategia integral llave en mano diseñada para empresas que buscan captación continua, embudo de ventas, pauta publicitaria activa y escalabilidad constante.',
  },
  {
    q: '¿Idea.ly emite factura fiscal?',
    a: 'Sí, todos nuestros servicios emiten factura fiscal (CFDI) en México. Los precios se expresan en pesos mexicanos más IVA.',
  },
];

const GROWTH_FAQS_EN = [
  {
    q: 'What is included in the Website + Growth plan for $8,500 MXN / mo (~$500 USD)?',
    a: 'It includes custom high-velocity web design and engineering (Next.js), active setup & weekly optimization of Google Search & Meta ad campaigns, SEO targeting traditional search engines and AI generative engines (ChatGPT, Perplexity), custom conversion tracking, and monthly executive lead performance reporting.',
  },
  {
    q: 'Is Google and Meta ad spend included in the $8,500 fee?',
    a: 'No. The $8,500 MXN fee covers full technical development, ongoing funnel strategy, copy engineering, creative ad production, and weekly optimization. Ad budget is billed directly by Google and Meta to your own business payment card.',
  },
  {
    q: 'How fast can we expect qualified incoming leads?',
    a: 'Google and Meta ad funnels typically start delivering initial customer leads within 7 to 14 business days after launch and campaign activation. SEO authority and AI search presence compounds month over month.',
  },
  {
    q: 'Do we own the website and advertising accounts?',
    a: 'Yes, 100%. Unlike agencies or rental platforms that hold your assets hostage, with Idea.ly your source code, domain, ad accounts, and tracking pixels remain your exclusive property.',
  },
  {
    q: 'Is there a mandatory long-term lock-in contract?',
    a: 'We recommend an initial 3-month cycle to allow machine learning bid algorithms to mature and reach lowest Cost-Per-Acquisition (CPA). However, we have zero hidden cancellation penalties.',
  },
  {
    q: 'How do you measure campaign performance and ROI?',
    a: 'We instrument Google Tag Manager, GA4, Meta Conversions API, and custom event handlers on WhatsApp clicks, calls, and forms. You will see exactly where each prospect came from.',
  },
  {
    q: 'What is the difference between this plan and Express Page?',
    a: 'Express Page is a 5-day rapid launch website with zero monthly management. The Website + Growth plan is an integrated continuous revenue engine combining ongoing digital marketing, ad optimization, and technical enhancements.',
  },
  {
    q: 'Do you issue formal business invoices?',
    a: 'Yes, we provide official tax CFDI invoices for Mexico and international invoicing for US / foreign corporate clients.',
  },
];

export default function GrowthFAQAccordion({ locale = 'es' }: GrowthFAQAccordionProps) {
  const isEs = locale === 'es';
  const faqs = isEs ? GROWTH_FAQS_ES : GROWTH_FAQS_EN;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {faqs.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all overflow-hidden ${
              isOpen
                ? 'bg-[#0b1c2b] border-[#00b4a6]/50 shadow-lg shadow-[#00b4a6]/5'
                : 'bg-base-100/50 border-white/10 hover:border-white/20'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#00b4a6] transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-gray-300 leading-relaxed border-t border-white/5">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
