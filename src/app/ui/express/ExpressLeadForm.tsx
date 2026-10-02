'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ExpressLeadForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');

  const [dedicacion, setDedicacion] = useState('Comercio');
  const [tienePagina, setTienePagina] = useState('No');
  const [urgencia, setUrgencia] = useState('Esta semana');
  const [socialLink, setSocialLink] = useState('');

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

    if (!nombreNegocio.trim()) {
      setErrorMessage('Por favor escribe el nombre de tu negocio.');
      return;
    }

    // Analytics conversion event step 1
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'lead_step_1', {
        event_category: 'engagement',
        event_label: 'Express Form Step 1',
      });
    }

    setStep(2);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      nombre,
      whatsapp: whatsapp.replace(/\D/g, ''),
      nombreNegocio,
      dedicacion,
      tienePagina,
      urgencia,
      socialLink,
      utm: utmParams,
    };

    try {
      const res = await fetch('/api/pagina-express/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'generate_lead', {
            event_category: 'conversion',
            event_label: 'Express Lead Complete',
            value: 5000.0,
            currency: 'MXN',
          });
          if (typeof window.gtag_report_conversion === 'function') {
            window.gtag_report_conversion();
          }
        }
        router.push(data.redirectUrl || `/pagina-express/gracias?nombre=${encodeURIComponent(nombre)}`);
      } else {
        setErrorMessage(data.error || 'Ocurrió un error al enviar tus datos. Inténtalo de nuevo.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error de conexión. Por favor intenta de nuevo.');
      setSubmitting(false);
    }
  };

  return (
    <div id="formulario-mensajes" className="w-full bg-[#0b1c2b]/95 border border-[#00b4a6]/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,180,166,0.2)] backdrop-blur-xl">
      <div id="formulario-vista-previa"></div>

      <div className="mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#00b4a6] uppercase tracking-wider bg-[#00b4a6]/15 px-3 py-1 rounded-full border border-[#00b4a6]/30">
            🎁 Obsequio de regalo incluido
          </span>
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
            >
              ← Paso 1
            </button>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
          {step === 1 ? 'Solicita tu página y recibe tu regalo' : 'Personaliza tu propuesta'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300">
          {step === 1
            ? 'Ingresa tus 3 datos para enviarte la Guía PDF + tu Certificado de Descuento por WhatsApp.'
            : 'Cuéntanos un poco más sobre tu negocio.'}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          ⚠️ {errorMessage}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNextStep} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              Nombre
            </label>
            <input
              type="text"
              required
              placeholder="¿Cómo te llamas?"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              WhatsApp / Teléfono
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                +52
              </span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                required
                placeholder="Teléfono (10 dígitos)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                className="w-full min-h-[48px] pl-14 pr-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors font-mono"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Te enviaremos tu obsequio e información directo a tu WhatsApp</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              Nombre de tu negocio o empresa
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Panadería La Esperanza"
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[52px] mt-2 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-bold text-lg flex items-center justify-center gap-2 transition-transform transform active:scale-98 shadow-lg cursor-pointer"
          >
            Solicitar mi página + Mi obsequio 🎁 →
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitFinal} className="flex flex-col gap-6">
          {/* Deduccion / giro */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-2">
              ¿A qué se dedica tu negocio?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Comercio',
                'Restaurante / comida',
                'Salud / consultorio',
                'Taller / servicio técnico',
                'Profesionista',
                'Otro',
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDedicacion(item)}
                  className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center flex items-center justify-center cursor-pointer ${
                    dedicacion === item
                      ? 'bg-[#00b4a6] border-[#00b4a6] text-white shadow-md'
                      : 'bg-base-200 border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Tiene pagina */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-2">
              ¿Ya tienes página web?
            </label>
            <div className="flex flex-col gap-2">
              {[
                'No',
                'Sí, pero no me sirve',
                'Solo tengo Facebook / Instagram',
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTienePagina(item)}
                  className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-sm font-semibold border text-left flex items-center justify-between transition-all cursor-pointer ${
                    tienePagina === item
                      ? 'bg-[#0069a9] border-[#0069a9] text-white shadow-md'
                      : 'bg-base-200 border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <span>{item}</span>
                  {tienePagina === item && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Urgencia */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-2">
              ¿Cuándo te gustaría tenerla?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Esta semana', 'Este mes', 'Solo estoy viendo'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setUrgencia(item)}
                  className={`min-h-[48px] px-2 py-2 rounded-xl text-xs sm:text-sm font-semibold border text-center transition-all flex items-center justify-center cursor-pointer ${
                    urgencia === item
                      ? 'bg-[#00b4a6] border-[#00b4a6] text-white shadow-md'
                      : 'bg-base-200 border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Social link */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-1">
              Link de tu Facebook o Instagram <span className="text-gray-400 text-xs font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="facebook.com/tunegocio"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
            />
          </div>

          <div className="flex gap-3">
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
              className="w-2/3 min-h-[52px] rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-bold text-base flex items-center justify-center gap-2 transition-transform transform active:scale-98 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : '¡Recibir mi página y kit de obsequio! 🎁'}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              🔒 No compartimos tus datos. Te escribimos solo por WhatsApp.
            </p>
            <Link
              href="/privacy-policy"
              className="text-xs text-[#00b4a6] hover:underline mt-1 inline-block"
            >
              Aviso de Privacidad
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
