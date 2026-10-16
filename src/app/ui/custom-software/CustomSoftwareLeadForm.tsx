'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomSoftwareLeadForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [tipoSistema, setTipoSistema] = useState('Portal de clientes / gestión web');
  const [situacionActual, setSituacionActual] = useState('Excel / hojas de cálculo');
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
        <h3 className="text-2xl font-black text-white mb-3">¡Diagnóstico técnico solicitado!</h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          Gracias <strong className="text-white">{nombre}</strong>. Un ingeniero senior revisará la viabilidad de tu sistema y te contactará por WhatsApp para afinar los requerimientos y alcances.
        </p>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300">
          ⏱️ Tiempo de respuesta: <strong>Menos de 2 horas hábiles</strong>.
        </div>
      </div>
    );
  }

  return (
    <div id="formulario-software" className="w-full bg-[#0b1c2b]/95 border border-[#00b4a6]/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,180,166,0.2)] backdrop-blur-xl">
      <div className="mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#00b4a6] uppercase tracking-wider bg-[#00b4a6]/15 px-3 py-1 rounded-full border border-[#00b4a6]/30">
            💻 Diagnóstico de Arquitectura Gratis
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
          {step === 1 ? 'Paso 1: Datos de contacto' : 'Paso 2: ¿Qué sistema necesitas?'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {step === 1
            ? 'Platica directo con ingenieros de software, sin intermediarios.'
            : 'Te presentaremos una propuesta técnica y cotización clara.'}
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
              Tu nombre completo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Ing. Carlos Mendoza"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              Tu WhatsApp a 10 dígitos <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="Ej. 2221234567"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Te contactaremos por WhatsApp para coordinar la llamada técnica.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              Correo empresarial <span className="text-gray-400 text-xs font-normal">(opcional)</span>
            </label>
            <input
              type="email"
              placeholder="carlos@miempresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[52px] rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-bold text-base flex items-center justify-center gap-2 transition-transform transform active:scale-98 shadow-lg cursor-pointer"
          >
            <span>Continuar a paso 2</span>
            <span>→</span>
          </button>

          <p className="text-center text-xs text-gray-400">
            🔒 Información confidencial bajo estricta privacidad.
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmitFinal} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              Nombre de tu empresa o negocio
            </label>
            <input
              type="text"
              placeholder="Ej. Logística y Distribución del Centro"
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              ¿Qué tipo de software necesitas construir?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                'Portal de clientes / gestión web',
                'Cotizador o sistema de inventario / pedidos',
                'Migración o reemplazo de software obsoleto',
                'Plataforma SaaS o aplicación móvil a la medida',
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
              ¿Dónde se gestiona este proceso actualmente?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Excel / hojas de cálculo',
                'Papel y notas físicas',
                'Sistema viejo / obsoleto',
                'Proyecto nuevo desde cero',
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
              Platícanos brevemente tu necesidad principal <span className="text-gray-400 text-xs font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Queremos que los clientes consulten sus facturas y estatus de pedido en tiempo real sin saturar nuestro WhatsApp."
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
              ← Regresar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 min-h-[52px] rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-transform transform active:scale-98 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : '¡Cotizar y recibir diagnóstico! 🚀'}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/privacy-policy"
              className="text-xs text-[#00b4a6] hover:underline inline-block"
            >
              Aviso de Privacidad
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
