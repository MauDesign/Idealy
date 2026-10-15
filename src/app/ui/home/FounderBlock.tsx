import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FounderBlockProps {
  locale?: string;
}

export default function FounderBlock({ locale = 'es' }: FounderBlockProps) {
  const isEs = locale === 'es';

  return (
    <section
      id="nosotros"
      aria-labelledby="founder-heading"
      className="w-full py-24 px-6 bg-base-100 dark:bg-[#01131b] transition-colors"
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-16">
          
          {/* Columna de Texto a la izquierda */}
          <div className="flex flex-col items-start text-left">
            <span className="text-primary font-bold text-sm tracking-wider uppercase mb-3">
              {isEs ? 'Quién está detrás' : 'Who is behind Idea.ly'}
            </span>
            <h2
              id="founder-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-6"
            >
              {isEs
                ? 'Hablas directo con quien diseña tu proyecto.'
                : 'You speak directly with the founder designing your project.'}
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {isEs
                ? 'Soy Mauricio Casado, fundador de Idea.ly. Diseñador UX/UI y desarrollador front-end, egresado de Diseño Interactivo y Animación Digital de la Ibero Puebla, con certificación Google UX Design. Diseño productos digitales desde 2017.'
                : 'I am Mauricio Casado, founder of Idea.ly. UX/UI designer and front-end developer, Interactive Design graduate from Ibero Puebla, certified in Google UX Design. Designing digital products since 2017.'}
            </p>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              {isEs ? (
                <>
                  Me acompaña un equipo de desarrollo y marketing, y{' '}
                  <Link
                    href={`/${locale}/leo`}
                    className="text-primary font-bold hover:underline"
                  >
                    LEO
                  </Link>
                  , nuestro sistema de inteligencia aplicada, que analiza tu negocio antes de que propongamos nada.
                </>
              ) : (
                <>
                  Backed by an engineering and marketing team, and{' '}
                  <Link
                    href={`/${locale}/leo`}
                    className="text-primary font-bold hover:underline"
                  >
                    LEO
                  </Link>
                  , our applied intelligence system that diagnoses your operations before recommending solutions.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/#contacto"
                className="btn btn-primary rounded-full px-8 font-bold text-white shadow-md hover:shadow-primary/30 transition-all normal-case"
              >
                {isEs ? 'Platica conmigo →' : 'Talk with me →'}
              </Link>
              <Link
                href={`/${locale}/leo`}
                className="btn btn-ghost rounded-full px-6 text-sm font-semibold text-primary hover:bg-primary/10 transition-all normal-case"
              >
                {isEs ? 'Conoce a LEO →' : 'Discover LEO →'}
              </Link>
            </div>
          </div>

          {/* Columna de Retrato (IMG-08 en vertical 4:5) a la derecha */}
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
            <Image
              src="/img/Consulting-leo-idealy.jpg"
              alt={
                isEs
                  ? 'Mauricio Casado, fundador de Idea.ly.'
                  : 'Mauricio Casado, founder of Idea.ly.'
              }
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="font-bold text-lg">Mauricio Casado</p>
              <p className="text-sm text-slate-300">Fundador & Lead UX Designer · Idea.ly</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
