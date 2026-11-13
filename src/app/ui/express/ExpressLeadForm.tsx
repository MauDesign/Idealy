'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trackEvent } from '@/lib/gtag';

export function normalizeMexicanPhone(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return digits;
  }
  // 521XXXXXXXXXX -> XXXXXXXXXX (13 digits mobile prefix)
  if (digits.length === 13 && digits.startsWith('521')) {
    return digits.slice(3);
  }
  // 52XXXXXXXXXX -> XXXXXXXXXX (12 digits with country code)
  if (digits.length === 12 && digits.startsWith('52')) {
    return digits.slice(2);
  }
  // 1XXXXXXXXXX -> XXXXXXXXXX (11 digits with 1)
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }
  return null;
}

interface ExpressLeadFormProps {
  id?: string;
}

export default function ExpressLeadForm({ id = 'formulario-mensajes' }: ExpressLeadFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('Por favor escribe tu nombre.');
      return;
    }

    const cleanNumber = normalizeMexicanPhone(whatsapp);
    if (!cleanNumber) {
      setErrorMessage('Por favor ingresa un número de teléfono a 10 dígitos (acepta con o sin +52 y con espacios).');
      return;
    }

    setSubmitting(true);

    const payload = {
      nombre: nombre.trim(),
      whatsapp: cleanNumber,
      nombreNegocio: nombreNegocio.trim(),
      dedicacion: '',
      tienePagina: '',
      urgencia: '',
      socialLink: '',
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
        trackEvent('generate_lead', {
          event_category: 'conversion',
          event_label: 'Express Lead Complete',
          value: 6000.0,
          currency: 'MXN',
        });
        router.push(data.redirectUrl || `/pagina-express/gracias?nombre=${encodeURIComponent(nombre.trim())}`);
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
    <div id={id} className="w-full bg-[#0b1c2b]/95 border border-[#00b4a6]/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,180,166,0.2)] backdrop-blur-xl">
      <div className="mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#00b4a6] uppercase tracking-wider bg-[#00b4a6]/15 px-3 py-1 rounded-full border border-[#00b4a6]/30">
            🎁 GUÍA GRATUITA
          </span>
          <span className="text-xs text-amber-300 font-semibold">
            + Certificado $5,000 + IVA
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-snug">
          Recibe gratis la guía: 10 mensajes listos para vender por WhatsApp
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          10 mensajes ya escritos para WhatsApp: acercamiento, venta en frío y recuperación de clientes.
        </p>
      </div>

      {/* 3 Pasos Visibles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-base-200/60 border border-white/10 text-xs text-gray-300 mb-5">
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#00b4a6]/20 text-[#00b4a6] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
            1
          </span>
          <span className="leading-tight">Dejas tu nombre y WhatsApp</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#00b4a6]/20 text-[#00b4a6] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
            2
          </span>
          <span className="leading-tight">Te llega la guía en 1 minuto</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#00b4a6]/20 text-[#00b4a6] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
            3
          </span>
          <span className="leading-tight">Si quieres tu página, usas tu certificado</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs sm:text-sm">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-200 mb-1">
            Nombre <span className="text-[#00b4a6]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="¿Cómo te llamas?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-200 mb-1">
            WhatsApp / Teléfono <span className="text-[#00b4a6]">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="Ej. 222 123 4567 o +52 222 123 4567"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm font-mono"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Acepta 10 dígitos con o sin +52 y con espacios.
          </p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-200 mb-1">
            Nombre de tu negocio o empresa <span className="text-gray-400 font-normal text-xs">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Si aún estás emprendiendo puedes dejarlo vacío"
            value={nombreNegocio}
            onChange={(e) => setNombreNegocio(e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full min-h-[50px] mt-2 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] active:scale-98 text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,180,166,0.35)] cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Enviando...' : 'Enviarme la guía por WhatsApp →'}
        </button>

        <div className="text-center pt-2 space-y-1">
          <p className="text-xs text-gray-300 font-medium">
            Te llega en 1 minuto por WhatsApp. No te llamamos.
          </p>
          <p className="text-[11px] text-gray-400">
            Enviar el formulario no genera compromiso de compra. Revisa nuestro{' '}
            <Link
              href="/privacy-policy"
              className="text-[#00b4a6] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aviso de Privacidad
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
