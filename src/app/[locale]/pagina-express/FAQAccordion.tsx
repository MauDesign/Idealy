'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    q: '¿Cuánto cuesta una página web para mi negocio con Idea.ly?',
    a: 'La Página Express de Idea.ly cuesta $6,000 MXN más IVA ($6,960 con IVA incluido). Incluye diseño a la medida, textos, botón de WhatsApp, hosting por 1 año y dominio .com por 1 año. Se paga 50% al iniciar y 50% al entregar.',
  },
  {
    q: '¿En cuánto tiempo está lista mi página web?',
    a: 'En 5 días hábiles a partir de que Idea.ly recibe tu logo, tus fotos y el cuestionario de 10 minutos. Si no está lista en ese plazo, te devolvemos tu anticipo completo.',
  },
  {
    q: '¿Idea.ly emite factura?',
    a: 'Sí. Idea.ly emite factura (CFDI) por el total del servicio. El precio de la Página Express es de $6,000 MXN más IVA ($5,000 MXN más IVA con tu certificado promocional).',
  },
  {
    q: '¿El dominio está incluido en la Página Express?',
    a: 'Sí, se incluye un dominio con terminación .com por 1 año, registrado a nombre de tu negocio. La promoción aplica únicamente para dominios .com; otras terminaciones como .com.mx o .mx se cotizan por separado.',
  },
  {
    q: '¿Qué pasa si ya tengo un dominio?',
    a: 'Si ya tienes dominio, usamos el tuyo y la Página Express incluye únicamente el hosting por 1 año, que es el servidor donde se publica tu página. Nosotros te ayudamos a conectar tu dominio.',
  },
  {
    q: '¿Qué necesito para empezar mi página web?',
    a: 'Tu logo, algunas fotos de tu negocio y responder un cuestionario de 10 minutos. Con eso Idea.ly escribe los textos y diseña tu página.',
  },
  {
    q: '¿Puedo pedir cambios a mi página?',
    a: 'Sí. La Página Express incluye una ronda de cambios antes de publicar. Después puedes contratar el plan de mantenimiento de Idea.ly por $499 al mes para cambios y soporte.',
  },
  {
    q: '¿Qué pasa después del primer año?',
    a: 'Al terminar el primer año renuevas el hosting (y el dominio, si te lo dimos nosotros). Te avisamos con 30 días de anticipación. Si prefieres, puedes llevarte tu página a otro proveedor.',
  },
  {
    q: '¿La página web es mía?',
    a: 'Sí. El dominio se registra a nombre de tu negocio y el contenido de la página es tuyo.',
  },
  {
    q: '¿Mi página va a aparecer en Google?',
    a: 'Tu Página Express se entrega con SEO básico (títulos, descripciones y datos para Google), alta de tu negocio en Google Maps y lista para anunciarse en Google y Facebook. Aparecer en los primeros lugares depende también de tu competencia y del tiempo.',
  },
  {
    q: '¿Para qué tipo de negocios sirve la Página Express?',
    a: 'Para negocios de servicios, comercios y profesionistas en Puebla y en todo México: consultorios, talleres, despachos, restaurantes, estéticas, escuelas y más. Si necesitas tienda en línea o un sistema, Idea.ly tiene otras soluciones.',
  },
  {
    q: '¿Dónde está Idea.ly?',
    a: 'Idea.ly (Idealy Studio) es un estudio de diseño y desarrollo web en Puebla, México. Atiende a negocios de todo México por WhatsApp y videollamada.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-base-100/70 border border-white/10 rounded-2xl overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-[#100%] w-full p-5 text-left font-bold text-white text-base sm:text-lg flex items-center justify-between gap-4 cursor-pointer hover:text-[#00b4a6] transition-colors"
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <span
                className={`w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-sm font-bold transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#00b4a6]' : 'text-gray-400'
                  }`}
              >
                ↓
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm sm:text-base text-gray-300 border-t border-white/5 pt-3 leading-relaxed animate-fadeIn">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
