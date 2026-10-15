'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { gtagReportConversion, trackEvent } from '@/lib/gtag';

type SubmissionStatus = 'success' | 'error' | null;

interface ContactFormProps {
  locale?: string;
}

export default function ContactForm({ locale = 'es' }: ContactFormProps) {
  const isEs = locale === 'es';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    necesidad: 'Más clientes desde internet',
    email: '',
  });

  const [utmParams, setUtmParams] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
  });

  // Escuchar preselección desde botones o URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlNeed = urlParams.get('necesidad');
      if (urlNeed) {
        setFormData((prev) => ({ ...prev, necesidad: urlNeed }));
      }

      setUtmParams({
        utmSource: urlParams.get('utm_source') || '',
        utmMedium: urlParams.get('utm_medium') || '',
        utmCampaign: urlParams.get('utm_campaign') || '',
      });

      const handleCustomSelect = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail) {
          setFormData((prev) => ({ ...prev, necesidad: customEvent.detail }));
        }
      };

      window.addEventListener('idealy-select-need', handleCustomSelect);
      return () => {
        window.removeEventListener('idealy-select-need', handleCustomSelect);
      };
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nombre,
          whatsapp: formData.whatsapp,
          necesidad: formData.necesidad,
          email: formData.email,
          ...utmParams,
          source: typeof window !== 'undefined' ? window.location.pathname : 'homepage',
        }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        gtagReportConversion();
        trackEvent('generate_lead', { necesidad: formData.necesidad });
        setFormData({
          nombre: '',
          whatsapp: '',
          necesidad: 'Más clientes desde internet',
          email: '',
        });
      } else {
        throw new Error('Failed to send contact');
      }
    } catch (error) {
      console.error('Error enviando contacto:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl =
    'https://wa.me/522227179352?text=Hola%2C%20tuve%20un%20problema%20al%20enviar%20el%20formulario%20de%20Idea.ly';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-slate-800">
      {/* Campo 1: Nombre */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nombre" className="text-sm font-bold text-slate-700">
          {isEs ? 'Nombre' : 'Full Name'} <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder={isEs ? 'Tu nombre' : 'Your name'}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
        />
      </div>

      {/* Campo 2: WhatsApp */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="whatsapp" className="text-sm font-bold text-slate-700">
          {isEs ? 'WhatsApp' : 'WhatsApp / Phone'} <span className="text-primary">*</span>
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="222 000 0000"
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
        />
      </div>

      {/* Campo 3: ¿Qué necesitas? */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="necesidad" className="text-sm font-bold text-slate-700">
          {isEs ? '¿Qué necesitas?' : 'What do you need?'} <span className="text-primary">*</span>
        </label>
        <select
          id="necesidad"
          name="necesidad"
          value={formData.necesidad}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all cursor-pointer"
        >
          <option value="Más clientes desde internet">
            {isEs ? 'Más clientes desde internet' : 'More clients from internet'}
          </option>
          <option value="Un sitio profesional rápido">
            {isEs ? 'Un sitio profesional rápido' : 'A professional website fast'}
          </option>
          <option value="Automatizar procesos">
            {isEs ? 'Automatizar procesos' : 'Automate business workflows'}
          </option>
          <option value="Un sistema a la medida">
            {isEs ? 'Un sistema a la medida' : 'Custom software system'}
          </option>
          <option value="Todavía no lo sé">
            {isEs ? 'Todavía no lo sé' : 'Not sure yet'}
          </option>
        </select>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 rounded-full bg-primary hover:bg-[#009b8f] text-white font-bold text-base shadow-lg shadow-primary/30 transition-all cursor-pointer disabled:opacity-50 mt-2"
      >
        {isSubmitting
          ? isEs ? 'Enviando...' : 'Sending...'
          : isEs ? 'Quiero mi diagnóstico gratis' : 'Get my free diagnosis'}
      </button>

      {/* Texto legal */}
      <p className="text-xs text-slate-500 text-center leading-relaxed">
        {isEs ? (
          <>
            Al enviar aceptas nuestro{' '}
            <Link
              href={`/${locale}/privacy-policy`}
              className="text-primary underline font-medium hover:text-[#00897b]"
            >
              aviso de privacidad
            </Link>
            .
          </>
        ) : (
          <>
            By submitting, you agree to our{' '}
            <Link
              href={`/${locale}/privacy-policy`}
              className="text-primary underline font-medium hover:text-[#00897b]"
            >
              privacy policy
            </Link>
            .
          </>
        )}
      </p>

      {/* Mensaje de éxito */}
      {submissionStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold text-center">
          {isEs
            ? '¡Listo! Te escribimos por WhatsApp en menos de 24 horas.'
            : 'Done! We will message you on WhatsApp within 24 hours.'}
        </div>
      )}

      {/* Mensaje de error */}
      {submissionStatus === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold text-center">
          {isEs ? (
            <>
              No pudimos enviar tu mensaje.{' '}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-primary"
              >
                Escríbenos directo por WhatsApp
              </a>
              .
            </>
          ) : (
            <>
              Could not send your request.{' '}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-primary"
              >
                Chat directly via WhatsApp
              </a>
              .
            </>
          )}
        </div>
      )}
    </form>
  );
}
