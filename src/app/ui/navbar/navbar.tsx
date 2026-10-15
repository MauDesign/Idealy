'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/gtag';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('NavbarLinks');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isExcluded =
    pathname?.includes('/admin') ||
    pathname?.includes('/auth') ||
    pathname?.includes('/pagina-express');

  if (isExcluded) return null;

  const isEs = locale === 'es';

  const navLinks = isEs
    ? [
        { label: 'Servicios', href: '/#servicios' },
        { label: 'Casos', href: '/#casos' },
        { label: 'Cómo trabajamos', href: '/#proceso' },
        { label: 'Precios', href: '/#precios' },
        { label: 'Nosotros', href: '/#nosotros' },
      ]
    : [
        { label: t('services'), href: '/services' },
        { label: t('cases'), href: '/#cases' },
        { label: t('process'), href: '/#process' },
        { label: t('pricing'), href: '/#pricing' },
        { label: t('about'), href: '/#about' },
      ];

  const handleCtaClick = () => {
    trackEvent('click_cta_diagnostico', { ubicacion: 'header' });
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 h-[76px] bg-base-100/90 dark:bg-[#01131b]/90 backdrop-blur-md border-b border-base-200/60 dark:border-white/10 shadow-sm transition-colors"
      role="banner"
    >
      <nav
        className="w-11/12 max-w-7xl mx-auto h-full flex items-center justify-between gap-4"
        aria-label={isEs ? 'Navegación principal' : 'Main navigation'}
      >
        {/* Logo a la izquierda */}
        <div className="flex items-center gap-3">
          <Link
            href={isEs ? '/#inicio' : '/'}
            className="flex items-center group"
            aria-label={isEs ? 'Idea.ly — ir al inicio' : 'Idea.ly — go to homepage'}
          >
            <div className="relative h-10 w-[160px] flex items-center">
              <Image
                src="/img/Logo-Idealy.png"
                alt="Idea.ly"
                fill
                priority
                sizes="160px"
                className="object-contain object-left transition-transform group-hover:scale-105"
              />
            </div>
          </Link>
        </div>

        {/* Menú al centro (Desktop) */}
        <div className="hidden lg:flex items-center justify-center">
          <ul className="flex items-center gap-1 xl:gap-2 text-sm font-medium" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3.5 py-2 rounded-full text-foreground/80 hover:text-primary hover:bg-base-200/50 dark:hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Idioma + Botón a la derecha (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <Link
            href="/#contacto"
            onClick={handleCtaClick}
            className="btn btn-primary btn-sm rounded-full px-5 py-2 text-sm font-semibold shadow-sm hover:shadow-primary/30 transition-all normal-case"
          >
            {isEs ? 'Diagnóstico gratis' : t('diagnostic')}
          </Link>
        </div>

        {/* Botón hamburguesa en móvil */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen
                ? isEs ? 'Cerrar menú' : 'Close menu'
                : isEs ? 'Abrir menú' : 'Open menu'
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            className="btn btn-ghost btn-square btn-sm text-foreground"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Panel móvil desplegable */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="lg:hidden fixed top-[76px] left-0 w-full bg-base-100 dark:bg-[#01131b] border-b border-base-300 dark:border-white/10 shadow-xl px-6 py-6 transition-all"
        >
          <ul className="flex flex-col gap-3 text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-foreground/90 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-4 mt-4 border-t border-base-200 dark:border-white/10 flex flex-col gap-4">
            <Link
              href="/#contacto"
              onClick={handleCtaClick}
              className="btn btn-primary w-full rounded-full text-center font-semibold normal-case"
            >
              {isEs ? 'Diagnóstico gratis' : t('diagnostic')}
            </Link>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-muted-foreground">{isEs ? 'Tema' : 'Theme'}</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
