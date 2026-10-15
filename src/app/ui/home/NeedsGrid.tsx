'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Monitor, Settings, Code } from 'lucide-react';
import { trackEvent } from '@/lib/gtag';

interface NeedsGridProps {
  locale?: string;
}

export default function NeedsGrid({ locale = 'es' }: NeedsGridProps) {
  const isEs = locale === 'es';

  const cards = [
    {
      id: 'clientes',
      icon: TrendingUp,
      title: isEs ? 'Quiero más clientes desde internet' : 'I want more clients from the internet',
      description: isEs
        ? 'Sitio optimizado + campañas en Google y Meta + SEO para aparecer en Google y en ChatGPT. Medimos cada prospecto.'
        : 'Optimized website + Google & Meta ad campaigns + SEO for Google and ChatGPT. We measure every lead.',
      cta: isEs ? 'Ver cómo crecer →' : 'See how to grow →',
      href: `/${locale}/sitio-crecimiento`,
    },
    {
      id: 'express',
      icon: Monitor,
      title: isEs ? 'Necesito un sitio profesional, rápido' : 'I need a professional website, fast',
      description: isEs
        ? 'Página Express: diseño a tu marca, rápida en celular y lista para recibir clientes por WhatsApp. Desde $5,000 MXN.'
        : 'Express Page: branded design, ultra-fast on mobile, ready to receive WhatsApp leads. Starting at $5,000 MXN.',
      cta: isEs ? 'Ver Página Express →' : 'See Express Page →',
      href: `/${locale}/pagina-express`,
    },
    {
      id: 'automatizacion',
      icon: Settings,
      title: isEs ? 'Pierdo horas en tareas repetitivas' : 'I lose hours on repetitive manual tasks',
      description: isEs
        ? 'Automatizamos con IA: respuestas por WhatsApp 24/7, cotizaciones automáticas, reportes que se arman solos.'
        : 'AI workflow automation: 24/7 WhatsApp customer replies, automatic quotes, automated reporting.',
      cta: isEs ? 'Ver automatizaciones →' : 'See automation →',
      href: `/${locale}/services/ai-automation`,
    },
    {
      id: 'software',
      icon: Code,
      title: isEs ? 'Mi negocio necesita su propio sistema' : 'My business needs its own custom system',
      description: isEs
        ? 'Software a la medida: portales de clientes, inventarios, cotizadores o migrar ese sistema viejo a uno moderno.'
        : 'Custom software: client portals, inventory management, quoting tools, or migrating legacy software.',
      cta: isEs ? 'Ver software a la medida →' : 'See custom software →',
      href: `/${locale}/services/software-development`,
    },
  ];

  const handleCardClick = (cardId: string) => {
    trackEvent('click_necesidad', { tarjeta: cardId });
  };

  return (
    <section
      id="servicios"
      aria-labelledby="needs-heading"
      className="w-full py-24 px-6 bg-base-100 dark:bg-[#01131b] transition-colors"
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        
        {/* Encabezado de sección */}
        <div className="max-w-3xl mb-16 text-left">
          <p className="text-primary font-bold text-sm tracking-wider uppercase mb-3">
            {isEs ? '¿Qué necesitas?' : 'What do you need?'}
          </p>
          <h2
            id="needs-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-4"
          >
            {isEs ? 'Empieza por tu problema, no por la tecnología.' : 'Start with your business problem, not the tech stack.'}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {isEs
              ? 'Elige lo que más se parece a tu situación. Te decimos qué hacer, cuánto cuesta y en cuánto tiempo.'
              : 'Choose what matches your situation best. We will tell you what to do, how much it costs, and the exact timeline.'}
          </p>
        </div>

        {/* Rejilla de 4 tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                onClick={() => handleCardClick(card.id)}
                className="group flex flex-col justify-between p-7 rounded-2xl bg-base-200/50 dark:bg-[#021824] border border-slate-200 dark:border-white/5 hover:border-primary/60 dark:hover:border-primary/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                  {card.cta}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
