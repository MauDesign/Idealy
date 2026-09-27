'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    q: '¿Qué necesito para empezar?',
    a: 'Tu logo, algunas fotos de tu negocio y 10 minutos para el cuestionario. Si no tienes logo, te ayudamos con uno sencillo.',
  },
  {
    q: '¿Puedo pedir cambios?',
    a: 'Sí, una ronda de cambios antes de publicar. Después, con el plan de mantenimiento de $499 al mes.',
  },
  {
    q: '¿El dominio es mío?',
    a: 'Sí, se registra a tu nombre.',
  },
  {
    q: '¿Qué pasa después del primer año?',
    a: 'Renuevas hosting y dominio (te avisamos con tiempo) o te llevas tu página a donde quieras.',
  },
  {
    q: '¿Facturan?',
    a: 'Sí, emitimos factura.',
  },
  {
    q: '¿Sirve para cualquier negocio?',
    a: 'Para negocios de servicios, comercios y profesionistas. Si necesitas tienda en línea o sistema, te recomendamos otra solución.',
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
                className={`w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-sm font-bold transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#00b4a6]' : 'text-gray-400'
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
