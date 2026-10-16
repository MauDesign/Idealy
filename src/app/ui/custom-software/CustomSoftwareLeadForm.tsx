'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CustomSoftwareLeadFormProps {
  locale?: string;
}

export default function CustomSoftwareLeadForm({ locale = 'es' }: CustomSoftwareLeadFormProps) {
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
  const [tipoSistema, setTipoSistema] = useState(
    isEs ? 'Portal de clientes / gestión web' : 'Client portal / web dashboard'
  );
  const [situacionActual, setSituacionActual] = useState(
    isEs ? 'Excel / hojas de cálculo' : 'Excel / spreadsheets'
  );
  const [usuariosAprox, setUsuariosAprox] = useState('1 - 10 usuarios');
  const [descripcionProyecto, setDescripcionProyecto] = useState('');

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
      setErrorMessage('Por favor escribe tu nombre.');
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
      necesidad: 'Software a la Medida',
      subject: `Nuevo Lead: Software a la Medida - ${nombreNegocio || nombre}`,
      message: `Solicitud de Diagnóstico y Alcance Técnico:\n\n• Nombre: ${nombre}\n• WhatsApp: ${whatsapp}\n• Email: ${email || 'No proporcionado'}\n• Empresa/Negocio: ${nombreNegocio || 'No especificado'}\n• Tipo de sistema: ${tipoSistema}\n• Dónde opera hoy: ${situacionActual}\n• Usuarios estimados: ${usuariosAprox}\n• Descripción preliminar: ${descripcionProyecto || 'Sin detalle adicional'}`,
      utmSource: utmParams.source,
      utmMedium: utmParams.medium,
      utmCampaign: utmParams.campaign,
      source: 'landing_desarrollo_a_la_medida',
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
            event_label: 'Custom Software Lead Complete',
            value: 25000.0,
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
        <h3 className="text-2xl font-black text-white mb-3">
          {isEs ? '¡Diagnóstico técnico solicitado!' : 'Technical Diagnosis Requested!'}
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          {isEs ? (
            <>
              Gracias <strong className="text-white">{nombre}</strong>. Un ingeniero senior revisará la viabilidad de tu sistema y te contactará por WhatsApp para afinar los requerimientos y alcances.
            </>
          ) : (
            <>
              Thank you <strong className="text-white">{nombre}</strong>. A senior engineer will review your system requirements and contact you on WhatsApp to discuss technical scope and pricing.
            </>
          )}
        </p>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300">
          ⏱️ {isEs ? 'Tiempo de respuesta estimado:' : 'Estimated response time:'}{' '}
          <strong>{isEs ? 'Menos de 2 horas hábiles' : 'Under 2 business hours'}</strong>.
        </div>
      </div>
    );
  }

  return (
    <div id="formulario-software" className="w-full bg-[#0b1c2b]/95 border border-[#00b4a6]/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,180,166,0.2)] backdrop-blur-xl">
      <div className="mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#00b4a6] uppercase tracking-wider bg-[#00b4a6]/15 px-3 py-1 rounded-full border border-[#00b4a6]/30">
            💻 {isEs ? 'Diagnóstico de Arquitectura Gratis' : 'Free Technical Diagnosis'}
          </span>
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← {isEs ? 'Paso 1' : 'Step 1'}
            </button>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          {step === 1
            ? isEs ? 'Paso 1: Datos de contacto' : 'Step 1: Contact Information'
            : isEs ? 'Paso 2: ¿Qué sistema necesitas?' : 'Step 2: Project Specifications'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {step === 1
            ? isEs ? 'Platica directo con ingenieros de software, sin intermediarios.' : 'Speak directly with senior engineers, zero sales friction.'
            : isEs ? 'Te presentaremos una propuesta técnica y cotización clara.' : 'We will prepare a clear technical proposal and architecture plan.'}
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
              placeholder={isEs ? 'Ej. Ing. Carlos Mendoza' : 'e.g. Michael Jordan'}
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
              {isEs ? 'Te contactaremos por WhatsApp para coordinar la llamada técnica.' : 'We will reach out on WhatsApp to schedule our engineering call.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Correo empresarial' : 'Work email'} <span className="text-gray-400 text-xs font-normal">({isEs ? 'opcional' : 'optional'})</span>
            </label>
            <input
              type="email"
              placeholder={isEs ? 'carlos@miempresa.com' : 'michael@company.com'}
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
            🔒 {isEs ? 'Información confidencial bajo estricta privacidad.' : 'Strictly confidential and NDA compliant.'}
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmitFinal} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Nombre de tu empresa o negocio' : 'Company or brand name'}
            </label>
            <input
              type="text"
              placeholder={isEs ? 'Ej. Logística y Distribución del Centro' : 'e.g. Apex Global Logistics'}
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? '¿Qué tipo de software necesitas construir?' : 'What kind of custom system do you need?'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                isEs ? 'Portal de clientes / gestión web' : 'Client portal / web dashboard',
                isEs ? 'Cotizador o sistema de inventario / pedidos' : 'Quoting tool / inventory & orders',
                isEs ? 'Migración o reemplazo de software obsoleto' : 'Legacy migration / system replacement',
                isEs ? 'Plataforma SaaS o aplicación móvil a la medida' : 'Custom SaaS platform / mobile app',
              ].map((tipo) => (
                <button
                  type="button"
                  key={tipo}
                  onClick={() => setTipoSistema(tipo)}
                  className={`text-left p-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    tipoSistema === tipo
                      ? 'border-[#00b4a6] bg-[#00b4a6]/20 text-white'
                      : 'border-white/10 bg-base-200/60 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? '¿Dónde se gestiona este proceso actualmente?' : 'Where does this process live today?'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                isEs ? 'Excel / hojas de cálculo' : 'Excel / spreadsheets',
                isEs ? 'Papel y notas físicas' : 'Paper & physical files',
                isEs ? 'Sistema viejo / obsoleto' : 'Outdated legacy software',
                isEs ? 'Proyecto nuevo desde cero' : 'Brand new greenfield project',
              ].map((sit) => (
                <button
                  type="button"
                  key={sit}
                  onClick={() => setSituacionActual(sit)}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    situacionActual === sit
                      ? 'border-[#00b4a6] bg-[#00b4a6]/20 text-white'
                      : 'border-white/10 bg-base-200/60 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {sit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              {isEs ? 'Platícanos brevemente tu necesidad principal' : 'Briefly describe your core requirement'}{' '}
              <span className="text-gray-400 text-xs font-normal">({isEs ? 'opcional' : 'optional'})</span>
            </label>
            <textarea
              rows={2}
              placeholder={
                isEs
                  ? 'Ej. Queremos que los clientes consulten sus facturas y estatus de pedido en tiempo real sin saturar nuestro WhatsApp.'
                  : 'e.g. We want customers to check invoices and order tracking in real-time without overwhelming support staff.'
              }
              value={descripcionProyecto}
              onChange={(e) => setDescripcionProyecto(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-xs sm:text-sm resize-none"
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
                ? isEs ? 'Enviando...' : 'Submitting...'
                : isEs ? '¡Cotizar y recibir diagnóstico! 🚀' : 'Request Proposal & Diagnosis! 🚀'}
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
