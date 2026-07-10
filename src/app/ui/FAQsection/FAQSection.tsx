'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Script from 'next/script';
import { faqData } from './faqData'; // Asegúrate de ajustar el import

interface FAQSectionProps {
  language?: 'es' | 'en';
}

export default function FAQSection({ language = 'es' }: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const faqs = faqData[language];

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

  return (
    <section className="relative w-full py-24 bg-black overflow-hidden">
      {/* Schema Markup for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Background Glows (Efecto Premium) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight"
          >
            {language === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-400"
          >
            {language === 'es'
              ? 'Todo lo que necesitas saber sobre cómo trabajamos y construimos el futuro.'
              : 'Everything you need to know about how we work and build the future.'}
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`group rounded-2xl border transition-all duration-300 ${isActive
                    ? 'border-primary/50 bg-white/[0.04] shadow-[0_0_30px_-5px] shadow-primary/15'
                    : 'border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.15]'
                  }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between py-5 px-6 text-left cursor-pointer outline-none"
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={`flex-shrink-0 ml-4 p-1.5 rounded-full transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-gray-300'
                      }`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                  aria-hidden={!isActive}
                >
                  <div className="pb-6 px-6 pt-2 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
