'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Script from 'next/script';
import { faqData } from './faqData';

interface FAQSectionProps {
  language?: 'es' | 'en';
}

export default function FAQSection({ language = 'es' }: FAQSectionProps) {
  // Primera pregunta abierta por defecto
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const faqs = (language && faqData[language]) ? faqData[language] : (faqData['es'] || []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const isEs = language === 'es';

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative w-full py-24 bg-[#01131b] text-white overflow-hidden"
    >
      {/* Schema Markup for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[860px] mx-auto px-6">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="text-[#5eead4] font-bold text-sm tracking-wider uppercase mb-3">
            {isEs ? 'Preguntas frecuentes' : 'FAQ'}
          </p>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight"
          >
            {isEs ? 'Lo que nos preguntan antes de empezar.' : 'What we get asked before starting.'}
          </h2>
        </div>

        {/* Acordeón de preguntas */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-primary/50 bg-white/[0.04] shadow-lg shadow-primary/10'
                    : 'border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.15]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isActive}
                  className="w-full flex items-center justify-between py-5 px-6 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                >
                  <span
                    className={`text-lg font-bold pr-4 transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-slate-200'
                    }`}
                  >
                    {faq.question}
                  </span>

                  <div
                    className={`shrink-0 p-2 rounded-full transition-transform duration-300 ${
                      isActive ? 'rotate-180 bg-primary/20 text-primary' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <ChevronDown size={20} aria-hidden="true" />
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 px-6 pt-1 text-slate-300 leading-relaxed text-base border-t border-white/5">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
