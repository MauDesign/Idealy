'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Check } from 'lucide-react';
import { trackEvent } from '@/lib/gtag';

interface PricingTiersProps {
  locale?: string;
}

export default function PricingTiers({ locale = 'es' }: PricingTiersProps) {
  const isEs = locale === 'es';

  const handlePriceClick = (plan: string, preselectedNeed?: string) => {
    trackEvent('click_precio', { plan });
    if (preselectedNeed && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('idealy-select-need', { detail: preselectedNeed })
      );
    }
  };

  return (
    <section
      id="precios"
      aria-labelledby="pricing-heading"
      className="w-full py-24 px-6 bg-base-100 dark:bg-[#01131b] transition-colors"
    >
      <div className="w-11/12 max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="max-w-3xl mb-16 text-left">
          <p className="text-primary font-bold text-sm tracking-wider uppercase mb-3">
            {isEs ? 'Precios de referencia' : 'Transparent Pricing'}
          </p>
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-4"
          >
            {isEs ? 'Sabes cuánto inviertes desde el principio.' : 'Clear investment from day one.'}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {isEs
              ? 'Precios en pesos mexicanos más IVA. El precio final lo definimos contigo en el diagnóstico, sin compromiso.'
              : 'Prices in MXN / USD plus tax. Exact final pricing is customized with you during the free diagnosis.'}
          </p>
        </div>

        {/* Rejilla de 3 tarjetas de igual altura */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">

          {/* Tarjeta 1 — Página Express */}
          <div className="flex flex-col justify-between p-8 rounded-2xl bg-base-200/50 dark:bg-[#021824] border border-slate-200 dark:border-white/10 hover:shadow-xl transition-all">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {isEs ? 'Página Express' : 'Express Page'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {isEs ? 'Para arrancar con presencia profesional.' : 'To launch with immediate professional presence.'}
              </p>
              <div className="mb-6">
                <span className="font-sora text-4xl font-black text-primary">
                  $6,000
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-2">MXN</span>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Landing page a tu marca' : 'Branded landing page'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Botón de WhatsApp y formulario' : 'WhatsApp direct button & form'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Rápida y lista para celular' : 'Mobile-ready & ultra fast'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Entrega en 5 días' : 'Delivery in 5 business days'}</span>
                </li>
              </ul>
            </div>
            <Link
              href={`/${locale}/pagina-express`}
              onClick={() => handlePriceClick('express')}
              className="btn btn-outline btn-primary rounded-full w-full font-bold normal-case hover:text-white"
            >
              {isEs ? 'Quiero mi página →' : 'Get my page →'}
            </Link>
          </div>

          {/* Tarjeta 2 — Sitio + Crecimiento (DESTACADA) */}
          <div className="relative flex flex-col justify-between p-8 rounded-2xl bg-base-100 dark:bg-[#021f2f] border-2 border-primary shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all">
            {/* Etiqueta flotante */}
            <div className="absolute -top-3.5 left-8 px-3.5 py-1 rounded-full bg-primary text-white text-xs font-black tracking-wider uppercase shadow-md">
              {isEs ? 'MÁS ELEGIDO' : 'MOST POPULAR'}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 mt-2">
                {isEs ? 'Sitio + Crecimiento' : 'Website + Growth'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {isEs ? 'Para negocios que quieren más clientes cada mes.' : 'For businesses scaling monthly revenue & leads.'}
              </p>
              <div className="mb-6">
                <span className="font-sora text-4xl font-black text-primary">
                  $8,500
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-2">MXN / mes</span>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Sitio completo diseñado a la medida' : 'Full custom-designed website'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Campañas en Google y Meta' : 'Google & Meta advertising campaigns'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'SEO para Google y ChatGPT' : 'SEO for Google & AI search'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Reporte mensual de prospectos' : 'Monthly lead generation reports'}</span>
                </li>
              </ul>
            </div>
            <Link
              href="/#contacto"
              onClick={() => handlePriceClick('crecimiento', 'Más clientes desde internet')}
              className="btn btn-primary rounded-full w-full font-bold text-white shadow-lg shadow-primary/30 normal-case"
            >
              {isEs ? 'Quiero crecer →' : 'I want to grow →'}
            </Link>
          </div>

          {/* Tarjeta 3 — Software a la medida */}
          <div className="flex flex-col justify-between p-8 rounded-2xl bg-base-200/50 dark:bg-[#021824] border border-slate-200 dark:border-white/10 hover:shadow-xl transition-all">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {isEs ? 'Software a la medida' : 'Custom Software'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {isEs ? 'Para procesos que hoy viven en Excel o papel.' : 'For operations currently running on Excel or paper.'}
              </p>
              <div className="mb-6">
                <span className="text-sm font-semibold text-slate-500 mr-2">desde</span>
                <span className="font-sora text-4xl font-black text-primary">
                  $25,000
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-2">MXN</span>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Portales, inventarios, cotizadores' : 'Portals, inventory, quoting tools'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Automatización con IA' : 'AI workflow automation'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Migración de sistemas viejos' : 'Legacy system migration'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{isEs ? 'Soporte y mantenimiento continuo' : 'Continuous support & maintenance'}</span>
                </li>
              </ul>
            </div>
            <Link
              href="/#contacto"
              onClick={() => handlePriceClick('medida', 'Un sistema a la medida')}
              className="btn btn-outline btn-primary rounded-full w-full font-bold normal-case hover:text-white"
            >
              {isEs ? 'Cotizar mi sistema →' : 'Quote my system →'}
            </Link>
          </div>

        </div>

        {/* Banda de garantía */}
        <div className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-center">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          <p className="text-sm sm:text-base font-semibold">
            {isEs
              ? 'Garantía de entrega: si tu sitio no está listo en 21 días, te devolvemos tu dinero.'
              : 'Delivery guarantee: if your website is not ready in 21 days, we refund 100% of your investment.'}
          </p>
        </div>

      </div>
    </section>
  );
}
