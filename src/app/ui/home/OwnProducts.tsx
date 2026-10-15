import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface OwnProductsProps {
  locale?: string;
}

export default function OwnProducts({ locale = 'es' }: OwnProductsProps) {
  const isEs = locale === 'es';

  return (
    <section
      aria-labelledby="ownproducts-heading"
      className="w-full py-24 px-6 bg-slate-50 dark:bg-[#021824] border-b border-slate-200 dark:border-white/5 transition-colors"
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-16">
          
          {/* Imagen IMG-07 a la izquierda (en móvil va después del texto) */}
          <div className="order-2 lg:order-1 relative w-full aspect-[7/5] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
            <Image
              src="/img/wise-case.webp"
              alt={
                isEs
                  ? 'Plataformas propias de Idea.ly: Wise Facturación y Wise Control.'
                  : 'Proprietary platforms by Idea.ly: Wise Facturación and Wise Control.'
              }
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Columna de Texto a la derecha (en móvil texto primero) */}
          <div className="order-1 lg:order-2 flex flex-col items-start text-left">
            <span className="text-primary font-bold text-sm tracking-wider uppercase mb-3">
              {isEs ? 'Software propio' : 'Proprietary Software'}
            </span>
            <h2
              id="ownproducts-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-4"
            >
              {isEs
                ? 'No solo lo construimos: lo operamos todos los días.'
                : 'We don’t just build software: we operate it daily.'}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              {isEs
                ? 'Somos creadores de nuestras propias plataformas. Sabemos lo que cuesta mantener un sistema funcionando, con usuarios reales, mes tras mes.'
                : 'We are active founders and operators of our own platforms. We know firsthand what it takes to maintain robust uptime, compliance, and real paying users month after month.'}
            </p>

            {/* Dos tarjetas compactas apiladas */}
            <div className="flex flex-col gap-4 w-full">
              
              {/* Tarjeta 1: Wise Facturación */}
              <a
                href="https://wisefacturacion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-xl bg-base-100 dark:bg-[#01131b] border border-slate-200 dark:border-white/10 hover:border-primary hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    Wise Facturación
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isEs
                      ? 'Facturación electrónica CFDI para PyMEs.'
                      : 'CFDI electronic invoicing software for Mexican SMBs.'}
                  </p>
                </div>
                <span className="text-primary font-bold text-sm ml-4 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>

              {/* Tarjeta 2: Wise Control */}
              <a
                href="https://wisefacturacion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-xl bg-base-100 dark:bg-[#01131b] border border-slate-200 dark:border-white/10 hover:border-primary hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    Wise Control
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isEs
                      ? 'Checador, prenómina y expedientes de personal, conectado con la nómina de Wise.'
                      : 'Time tracking, pre-payroll, and employee HR files seamlessly integrated.'}
                  </p>
                </div>
                <span className="text-primary font-bold text-sm ml-4 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
