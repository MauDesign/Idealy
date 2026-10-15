'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import Image from 'next/image';

interface FooterProps {
  locale?: string;
}

export default function Footer({ locale = 'es' }: FooterProps) {
  const t = useTranslations('Footer');
  const isEs = locale === 'es';

  return (
    <footer
      className="w-full bg-[#01131b] text-slate-400 py-10 px-6 border-t border-white/5"
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className="w-11/12 max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        
        {/* Izquierda: Logo + Leyenda */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <Link href="/" aria-label="Idea.ly — ir al inicio">
            <Image
              src="/img/Logo-Idealy.png"
              width={160}
              height={50}
              alt="Idea.ly"
              className="object-contain"
            />
          </Link>
          <p className="text-sm text-slate-400">
            {isEs
              ? 'Estudio de diseño, software e IA · Puebla, México'
              : 'Design, Software & AI Studio · Puebla, Mexico'}
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Idea.ly. {isEs ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>

        {/* Derecha: Redes sociales + Enlaces */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-14 text-sm">
          
          {/* Navegación y Blog */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <span className="font-bold text-white uppercase text-xs tracking-wider mb-1">
              {isEs ? 'Sitio' : 'Navigation'}
            </span>
            <Link
              href="/blog"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/privacy-policy"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              {isEs ? 'Aviso de privacidad' : 'Privacy Policy'}
            </Link>
          </div>

          {/* Redes Sociales */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <span className="font-bold text-white uppercase text-xs tracking-wider mb-1">
              {isEs ? 'Síguenos' : 'Social'}
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm">
              <a
                href="https://www.facebook.com/idealymx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Idea.ly en Facebook"
                className="hover:text-primary transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/idea.ly_design/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Idea.ly en Instagram"
                className="hover:text-primary transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/idea-ly-mx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Idea.ly en LinkedIn"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.tiktok.com/@idealy.com.mx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Idea.ly en TikTok"
                className="hover:text-primary transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
