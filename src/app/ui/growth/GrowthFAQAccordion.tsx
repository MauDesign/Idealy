'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const GROWTH_FAQS = [
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

export default function GrowthFAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {GROWTH_FAQS.map((item, idx) => {
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
