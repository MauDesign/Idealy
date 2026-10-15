import React from 'react';
import Image from 'next/image';

interface DifferentiatorProps {
  locale?: string;
}

export default function Differentiator({ locale = 'es' }: DifferentiatorProps) {
  const isEs = locale === 'es';

  const points = [
    {
      number: '01',
      title: isEs ? 'Diseño que convierte' : 'Design that converts',
      description: isEs
        ? '10+ años en UX/UI. Cada botón está pensado para que tu cliente te contacte.'
        : '10+ years in UX/UI. Every button is engineered to turn visitors into paying customers.',
    },
    {
      number: '02',
      title: isEs ? 'Tecnología que no se cae' : 'Tech that doesn’t crash',
      description: isEs
        ? 'Tu sitio carga en un instante y aguanta picos de visitas. Nada de plantillas lentas.'
        : 'Instant load speeds that withstand traffic spikes. Zero slow templates or bloat.',
    },
    {
      number: '03',
      title: isEs ? 'Marketing que se mide' : 'Marketing with measurable ROI',
      description: isEs
        ? 'Reporte mensual con prospectos, costo por cliente y qué mejorar.'
        : 'Monthly reports detailing leads generated, cost per customer, and tangible optimizations.',
    },
  ];

  return (
    <section
      aria-labelledby="diff-heading"
      className="w-full bg-[#01131b] py-24 px-6 text-white overflow-hidden"
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-20">
          
          {/* Columna de Texto */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[#5eead4] font-bold text-sm tracking-wider uppercase mb-3">
              {isEs ? 'Lo que nos hace diferentes' : 'What sets us apart'}
            </span>
            <h2
              id="diff-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6"
            >
              {isEs
                ? 'Diseñamos, construimos y lo llenamos de clientes.'
                : 'We design it, build it, and bring you customers.'}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-10">
              {isEs
                ? 'La mayoría de las agencias hacen el sitio o lo promocionan. Nosotros hacemos las dos cosas, así que construimos sabiendo cómo se va a vender.'
                : 'Most agencies either build the website or market it. We do both, meaning every line of code is written knowing how it will sell.'}
            </p>

            {/* 3 Puntos Numerados */}
            <div className="flex flex-col gap-6 w-full">
              {points.map((point) => (
                <div
                  key={point.number}
                  className="flex items-start gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
                >
                  <span className="font-sora text-2xl font-black text-[#5eead4] shrink-0 select-none">
                    {point.number}
                  </span>
                  <div>
                    <h3 className="font-sora text-lg font-bold text-white mb-1">
                      {point.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna de Imagen (IMG-02 en vertical 4:5) */}
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <Image
              src="/img/idealy-dev.webp"
              alt={
                isEs
                  ? 'Equipo de Idea.ly diseñando y programando en su estudio de Puebla.'
                  : 'Idea.ly development and design team working in Puebla studio.'
              }
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#01131b]/80 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
