import React from 'react';
import Image from 'next/image';
import { caseStudies } from '@/content/cases';

interface CaseStudiesProps {
  locale?: string;
}

export default function CaseStudies({ locale = 'es' }: CaseStudiesProps) {
  const isEs = locale === 'es';

  return (
    <section
      id="casos"
      aria-labelledby="cases-heading"
      className="w-full py-24 px-6 bg-slate-50 dark:bg-[#021824] border-y border-slate-200 dark:border-white/5 transition-colors"
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        
        {/* Encabezado de Sección */}
        <div className="max-w-3xl mb-16 text-left">
          <p className="text-primary font-bold text-sm tracking-wider uppercase mb-3">
            {isEs ? 'Casos reales' : 'Real case studies'}
          </p>
          <h2
            id="cases-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-4"
          >
            {isEs ? 'Proyectos que ya están funcionando.' : 'Projects already driving real business results.'}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {isEs
              ? 'El reto, lo que hicimos y lo que cambió para el cliente.'
              : 'The challenge, what we built, and the measurable impact for the client.'}
          </p>
        </div>

        {/* Rejilla de 2 columnas (1 en móvil) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {caseStudies.map((item) => (
            <article
              key={item.id}
              className="flex flex-col rounded-2xl bg-base-100 dark:bg-[#01131b] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              {/* Imagen a todo el ancho (proporción 16:10) */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-7 sm:p-8 flex flex-col flex-1">
                {/* Categoría */}
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#00897b] dark:text-[#5eead4] mb-2">
                  {item.category}
                </span>

                {/* H3 Título */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>

                {/* Párrafo con Reto, Solución y Resultado */}
                <div className="flex flex-col gap-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-foreground font-bold">
                      {isEs ? 'Reto: ' : 'Challenge: '}
                    </strong>
                    {item.challenge}
                  </p>
                  <p>
                    <strong className="text-foreground font-bold">
                      {isEs ? 'Solución: ' : 'Solution: '}
                    </strong>
                    {item.solution}
                  </p>
                  <p className="text-primary font-medium">
                    <strong className="text-foreground font-bold">
                      {isEs ? 'Resultado: ' : 'Result: '}
                    </strong>
                    {item.result}
                  </p>
                </div>

                {item.link && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-bold text-primary hover:underline gap-1"
                    >
                      <span>{isEs ? 'Visitar plataforma' : 'Visit platform'}</span>
                      <span>→</span>
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
