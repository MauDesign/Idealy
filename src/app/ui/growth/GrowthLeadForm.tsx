'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface GrowthLeadFormProps {
  locale?: string;
}

export default function GrowthLeadForm({ locale = 'es' }: GrowthLeadFormProps) {
  const isEs = locale === 'es';
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [objetivoPrincipal, setObjetivoPrincipal] = useState(
    isEs ? 'Más prospectos calificados' : 'More qualified leads'
  );
  const [inversionAds, setInversionAds] = useState(
    isEs ? '$5,000 - $15,000 MXN / mes' : '$500 - $1,500 USD / mo'
  );
  const [sitioActual, setSitioActual] = useState('');
  const [urgencia, setUrgencia] = useState(isEs ? 'Este mes' : 'This month');

  // UTM tracking params state
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
    gclid: '',
    referer: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        source: urlParams.get('utm_source') || '',
        medium: urlParams.get('utm_medium') || '',
        campaign: urlParams.get('utm_campaign') || '',
        term: urlParams.get('utm_term') || '',
        content: urlParams.get('utm_content') || '',
        gclid: urlParams.get('gclid') || '',
        referer: document.referrer || '',
      });
    }
  }, []);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('Por favor escribe tu nombre completo.');
      return;
    }

    const cleanNumber = whatsapp.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setErrorMessage('Por favor ingresa un número de WhatsApp válido a 10 dígitos.');
      return;
    }

    setStep(2);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      name: nombre,
      whatsapp: whatsapp.replace(/\D/g, ''),
      email: email.trim(),
      necesidad: 'Sitio + Crecimiento (Campañas + SEO)',
      subject: `Nuevo Lead: Sitio + Crecimiento - ${nombreNegocio || nombre}`,
      message: `Diagnóstico y Auditoría Solicitada:\n\n• Nombre: ${nombre}\n• WhatsApp: ${whatsapp}\n• Email: ${email || 'No proporcionado'}\n• Negocio: ${nombreNegocio || 'No especificado'}\n• Objetivo: ${objetivoPrincipal}\n• Presupuesto Ads estimado: ${inversionAds}\n• Sitio actual: ${sitioActual || 'Ninguno'}\n• Tiempo estimado de arranque: ${urgencia}`,
      utmSource: utmParams.source,
      utmMedium: utmParams.medium,
      utmCampaign: utmParams.campaign,
      source: 'landing_sitio_crecimiento',
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'conversion',
            event_label: 'Growth Lead Complete',
            value: 8500.0,
            currency: 'MXN',
          });
        }
        setSuccess(true);
      } else {
        const data = await res.json();
        setErrorMessage(data.message || 'Ocurrió un error al enviar tus datos. Inténtalo de nuevo.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error de conexión. Por favor intenta de nuevo.');
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full bg-[#0b1c2b]/95 border border-[#00b4a6]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,180,166,0.2)] text-center">
        <div className="w-16 h-16 bg-[#00b4a6]/20 border border-[#00b4a6]/50 rounded-full flex items-center justify-center mx-auto mb-5 text-[#00b4a6]">
          <span className="text-2xl font-bold">✓</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-3">¡Solicitud recibida con éxito!</h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          Gracias <strong className="text-white">{nombre}</strong>. Analizaremos tu mercado y te contactaremos por WhatsApp para coordinar tu <strong>Auditoría y Plan de Crecimiento personalizado</strong>.
        </p>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300">
          🚀 Tiempo de respuesta estimado: <strong>Menos de 2 horas hábiles</strong>.
        </div>
      </div>
    );
  }

  return (
    <div id="formulario-crecimiento" className="w-full bg-[#0b1c2b]/95 border border-[#00b4a6]/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,180,166,0.2)] backdrop-blur-xl">
      <div className="mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#00b4a6] uppercase tracking-wider bg-[#00b4a6]/15 px-3 py-1 rounded-full border border-[#00b4a6]/30">
            📊 Auditoría Digital Gratis
          </span>
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Paso 1
            </button>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          {step === 1 ? 'Paso 1: ¿Con quién nos comunicamos?' : 'Paso 2: Datos de tu negocio'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {step === 1
            ? 'Recibe un análisis de tu competencia y un plan de prospección sin costo.'
            : 'Personalizaremos tu estrategia de Google Ads, Meta y SEO.'}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNextStep} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Tu nombre completo' : 'Full name'} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={isEs ? 'Ej. Roberto Sánchez' : 'e.g. Robert Smith'}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Tu WhatsApp o teléfono directo' : 'WhatsApp or direct phone'} <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder={isEs ? 'Ej. 2221234567' : 'e.g. 5551234567'}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              {isEs ? 'Te contactaremos por WhatsApp para enviarte el diagnóstico preliminar.' : 'We will reach out on WhatsApp with your preliminary growth plan.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Correo electrónico' : 'Work email'} <span className="text-gray-400 text-xs font-normal">({isEs ? 'opcional' : 'optional'})</span>
            </label>
            <input
              type="email"
              placeholder={isEs ? 'roberto@miempresa.com' : 'robert@company.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[52px] rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-bold text-base flex items-center justify-center gap-2 transition-transform transform active:scale-98 shadow-lg cursor-pointer"
          >
            <span>{isEs ? 'Continuar a paso 2' : 'Continue to Step 2'}</span>
            <span>→</span>
          </button>

          <p className="text-center text-xs text-gray-400">
            🔒 {isEs ? 'Respetamos tu privacidad. Cero spam.' : 'Strictly confidential. Zero spam.'}
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmitFinal} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Nombre de tu empresa o marca' : 'Company or brand name'}
            </label>
            <input
              type="text"
              placeholder={isEs ? 'Ej. Clínica Dental Sonrisas / Distribuidora Ramos' : 'e.g. Acme Health Clinic / Global Trade'}
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? '¿Cuál es tu objetivo comercial principal?' : 'What is your primary commercial goal?'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                isEs ? 'Más prospectos calificados en WhatsApp/Email' : 'More qualified inbound leads (WhatsApp/Email)',
                isEs ? 'Superar a competidores en Google Ads / SEO' : 'Outrank key competitors on Google Ads & SEO',
                isEs ? 'Vender servicios de alto valor (B2B o Ticket Alto)' : 'Sell high-ticket services (B2B or High-Value)',
              ].map((obj) => (
                <button
                  type="button"
                  key={obj}
                  onClick={() => setObjetivoPrincipal(obj)}
                  className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    objetivoPrincipal === obj
                      ? 'border-[#00b4a6] bg-[#00b4a6]/20 text-white'
                      : 'border-white/10 bg-base-200/60 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Presupuesto mensual estimado en pauta (Google / Meta)' : 'Estimated monthly ad budget (Google / Meta)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                isEs ? '$3,000 - $6,000 MXN' : '$300 - $600 USD',
                isEs ? '$6,000 - $15,000 MXN' : '$600 - $1,500 USD',
                isEs ? '$15,000 - $35,000 MXN' : '$1,500 - $3,500 USD',
                isEs ? 'Más de $35,000 MXN' : 'Over $3,500 USD',
              ].map((pres) => (
                <button
                  type="button"
                  key={pres}
                  onClick={() => setInversionAds(pres)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    inversionAds === pres
                      ? 'border-[#00b4a6] bg-[#00b4a6]/20 text-white'
                      : 'border-white/10 bg-base-200/60 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {pres}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Página web o redes actuales' : 'Current website or social profile'}{' '}
              <span className="text-gray-400 text-xs font-normal">({isEs ? 'opcional' : 'optional'})</span>
            </label>
            <input
              type="text"
              placeholder={isEs ? 'ej. www.minegocio.com o instagram.com/negocio' : 'e.g. www.mybrand.com'}
              value={sitioActual}
              onChange={(e) => setSitioActual(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 min-h-[52px] rounded-xl bg-base-200 hover:bg-base-300 text-gray-300 font-semibold text-sm transition-colors cursor-pointer"
            >
              ← {isEs ? 'Regresar' : 'Back'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 min-h-[52px] rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-transform transform active:scale-98 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? isEs ? 'Analizando...' : 'Analyzing...'
                : isEs ? '¡Solicitar mi plan y auditoría! 🚀' : 'Get My Strategy & Audit! 🚀'}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/privacy-policy"
              className="text-xs text-[#00b4a6] hover:underline inline-block"
            >
              {isEs ? 'Aviso de Privacidad' : 'Privacy Policy'}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
