'use client';

import React, { useEffect, useState } from 'react';
import { X, Calendar, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { trackScheduleConversion } from '@/lib/gtag';

interface CalEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
  calLink?: string;
}

export default function CalEmbedModal({
  isOpen,
  onClose,
  locale = 'es',
  calLink = process.env.NEXT_PUBLIC_CAL_LINK || 'idealy/diagnostico',
}: CalEmbedModalProps) {
  const isEs = locale === 'es';
  const [isLoading, setIsLoading] = useState(true);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Escuchar evento de confirmación de reserva de Cal.com
  useEffect(() => {
    const handleCalMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (
          data?.type === 'cal:bookingSuccessful' ||
          data?.event === 'bookingSuccessful' ||
          data?.action === 'bookingSuccessful'
        ) {
          trackScheduleConversion({
            cal_link: calLink,
            provider: 'cal.com',
          });
        }
      } catch {
        // Ignorar mensajes que no sean JSON
      }
    };

    window.addEventListener('message', handleCalMessage);
    return () => window.removeEventListener('message', handleCalMessage);
  }, [calLink]);

  if (!isOpen) return null;

  // URL del embed de Cal.com
  const cleanLink = calLink.replace(/^https?:\/\/cal\.com\//, '');
  const embedUrl = `https://cal.com/${cleanLink}?embed=true&theme=dark`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#011b27] border border-white/15 rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#02131c]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 text-primary">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 id="cal-modal-title" className="text-base sm:text-lg font-bold text-white leading-tight">
                {isEs ? 'Agenda tu diagnóstico gratuito' : 'Book your free strategy session'}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  30 min · Videollamada
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isEs ? 'Sin compromiso de compra' : 'No commitment'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={isEs ? 'Cerrar agenda' : 'Close scheduler'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenedor del Iframe con indicador de carga */}
        <div className="relative w-full flex-1 min-h-[520px] sm:min-h-[580px] bg-[#01141e]">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#01141e] text-slate-300 z-10">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium">
                {isEs ? 'Cargando calendario disponible...' : 'Loading available slots...'}
              </p>
            </div>
          )}

          <iframe
            src={embedUrl}
            title={isEs ? 'Agenda tu llamada' : 'Schedule your meeting'}
            className="w-full h-full min-h-[520px] sm:min-h-[580px] border-0"
            onLoad={() => setIsLoading(false)}
            allow="camera; microphone; autoplay; clipboard-write"
          />
        </div>

        {/* Barra inferior alternativa (WhatsApp / formulario) */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#02131c] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            {isEs
              ? '¿Prefieres respuesta inmediata por mensaje?'
              : 'Prefer immediate direct message?'}
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/522227179352?text=Hola%2C%20quiero%20agendar%20un%20diagn%C3%B3stico%20gratuito"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-semibold inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp directo (+52 222 717 9352)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

