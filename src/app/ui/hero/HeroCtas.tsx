'use client';

import React from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/gtag';

interface HeroCtasProps {
  locale: string;
}

export default function HeroCtas({ locale }: HeroCtasProps) {
  const isEs = locale === 'es';

  const handleDiagnosticoClick = () => {
    trackEvent('click_cta_diagnostico', { ubicacion: 'hero' });
  };

  const handleWhatsAppClick = () => {
    trackEvent('click_whatsapp', { ubicacion: 'hero' });
  };

  const whatsappUrl = 'https://wa.me/522227179352?text=Hola%2C%20vengo%20del%20sitio%20de%20Idea.ly';

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Link
          href="/#contacto"
          onClick={handleDiagnosticoClick}
          className="btn btn-primary btn-lg rounded-full px-8 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-white normal-case"
        >
          {isEs ? 'Agenda tu diagnóstico gratis' : 'Book free diagnosis'}
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="btn btn-ghost btn-lg rounded-full px-7 text-base font-medium border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 text-white hover:text-[#25D366] transition-all normal-case inline-flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-[#25D366]"
            aria-hidden="true"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.32C4.24 15 3.8 13.48 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67M9.53 7.32C9.36 7.32 9.08 7.38 8.84 7.64C8.61 7.9 7.94 8.52 7.94 9.81C7.94 11.1 8.88 12.33 9.01 12.51C9.14 12.68 10.82 15.28 13.43 16.41C15.6 17.34 16.04 17.15 16.51 17.11C16.98 17.07 18.03 16.49 18.25 15.86C18.47 15.24 18.47 14.71 18.41 14.6C18.35 14.49 18.17 14.42 17.91 14.29C17.65 14.16 16.38 13.53 16.14 13.44C15.91 13.36 15.74 13.31 15.57 13.57C15.4 13.83 14.92 14.4 14.77 14.57C14.62 14.74 14.47 14.77 14.21 14.64C13.95 14.51 12.86 14.15 11.57 13C10.56 12.1 9.88 10.99 9.68 10.65C9.48 10.31 9.66 10.12 9.79 9.99C9.91 9.87 10.05 9.68 10.18 9.53C10.31 9.38 10.36 9.27 10.45 9.1C10.54 8.93 10.49 8.78 10.43 8.65C10.36 8.52 9.85 7.28 9.64 6.77C9.43 6.27 9.22 6.34 9.06 6.33L8.57 6.33C8.4 6.33 8.12 6.39 8.04 6.47C7.87 6.64 7.37 7.11 7.37 8.07L9.53 7.32Z" />
          </svg>
          {isEs ? 'Escríbenos por WhatsApp' : 'Chat on WhatsApp'}
        </a>
      </div>

      {/* Tres microtextos en fila */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-300 pt-1">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{isEs ? 'Respuesta en menos de 24 h' : 'Response in under 24 hrs'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{isEs ? 'Landing desde $5,000 MXN' : 'Landing from $1,000 USD'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{isEs ? 'Entrega en 21 días o te devolvemos tu dinero' : 'Delivered in 21 days or money back'}</span>
        </div>
      </div>
    </div>
  );
}
