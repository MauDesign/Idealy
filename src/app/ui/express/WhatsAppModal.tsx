'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface WhatsAppModalProps {
  buttonText: string;
  className?: string;
  locationTag?: string;
  presetMessage?: string;
}

const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '522227179352';

export default function WhatsAppButton({
  buttonText,
  className = '',
  locationTag = 'general',
  presetMessage = 'Hola, quiero mi Página Express 🚀',
}: WhatsAppModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');

  // Lead Response Data
  const [folioCode, setFolioCode] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [finalWaUrl, setFinalWaUrl] = useState('');

  // UTM tracking params
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        source: urlParams.get('utm_source') || 'whatsapp_button',
        medium: urlParams.get('utm_medium') || '',
        campaign: urlParams.get('utm_campaign') || '',
        term: urlParams.get('utm_term') || locationTag,
        content: urlParams.get('utm_content') || locationTag,
        gclid: urlParams.get('gclid') || '',
        referer: document.referrer || '',
      });
    }
  }, [locationTag]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleDirectWhatsappRedirect = () => {
    const encodedMessage = encodeURIComponent(presetMessage);
    const directUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'conversion',
        event_label: locationTag,
      });
    }
    
    window.open(directUrl, '_blank');
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nombre.trim()) {
      setErrorMessage('Por favor escribe tu nombre.');
      return;
    }

    const cleanNumber = whatsapp.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setErrorMessage('Por favor ingresa un número de WhatsApp de 10 dígitos.');
      return;
    }

    if (!nombreNegocio.trim()) {
      setErrorMessage('Por favor escribe el nombre de tu negocio.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nombre,
        whatsapp: cleanNumber,
        nombreNegocio,
        dedicacion: `Contacto directo por WhatsApp (${locationTag})`,
        tienePagina: 'No especificado',
        urgencia: 'Alta (Contacto WhatsApp)',
        socialLink: '',
        utm: utmParams,
      };

      const res = await fetch('/api/pagina-express/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const assignedFolio = data.folioCode || 'PE-0001';
        const assignedDownloadUrl = data.downloadUrl || `/pagina-express/descarga?leadId=${data.leadId}`;
        setFolioCode(assignedFolio);
        setDownloadUrl(assignedDownloadUrl);

        // Analytics tracking
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'generate_lead', {
            event_category: 'conversion',
            event_label: `WhatsApp Lead (${locationTag})`,
            value: 5000.0,
            currency: 'MXN',
          });
          if (typeof window.gtag_report_conversion === 'function') {
            window.gtag_report_conversion();
          }
        }

        const waText = `Hola Mauricio, soy ${nombre} de *${nombreNegocio}*. Tengo dudas sobre la Página Express y quiero solicitar mi obsequio y activar mi certificado (${assignedFolio}) 🚀`;
        const generatedWaUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(waText)}`;
        setFinalWaUrl(generatedWaUrl);

        setSubmitted(true);
        setSubmitting(false);

        // Auto open WhatsApp
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

        if (isMobile) {
          window.location.href = generatedWaUrl;
        } else {
          window.open(generatedWaUrl, '_blank');
        }
      } else {
        setErrorMessage(data.error || 'Error al procesar la solicitud. Intenta de nuevo.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error de conexión. Inténtalo nuevamente.');
      setSubmitting(false);
    }
  };

  const qrCodeUrl = finalWaUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=0069a9&data=${encodeURIComponent(finalWaUrl)}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=0069a9&data=${encodeURIComponent(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(presetMessage)}`)}`;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`inline-flex items-center justify-center font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-xl ${className}`}
      >
        <span>{buttonText}</span>
      </button>

      {/* Interactive WhatsApp Lead Modal */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0b1c2b] border border-[#00b4a6]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-left shadow-2xl relative overflow-hidden">
            {/* Top Glow Accent */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00b4a6]/20 rounded-full blur-2xl pointer-events-none"></div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-base-200 transition-colors z-10"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {!submitted ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#00b4a6]/20 border border-[#00b4a6]/40 flex items-center justify-center text-[#00b4a6] shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#00b4a6] uppercase tracking-wider block">
                      🎁 Obsequio de Regalo Incluido
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                      Preguntar por WhatsApp
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 mb-5 leading-relaxed">
                  Ingresa tus 3 datos para generar tu <strong>Certificado de Descuento ($5,000 MXN + IVA)</strong> + <strong>Guía PDF</strong> y chatear directo con nosotros por WhatsApp.
                </p>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="¿Cómo te llamas?"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-1">
                      WhatsApp / Teléfono (10 dígitos)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">
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
                        className="w-full min-h-[44px] pl-12 pr-3.5 py-2.5 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-1">
                      Nombre de tu negocio o empresa
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Clínica Dental Sonrisas"
                      value={nombreNegocio}
                      onChange={(e) => setNombreNegocio(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-base-200 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00b4a6] transition-colors text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[50px] mt-2 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Generando Certificado y Abriendo...</span>
                    ) : (
                      <span>Obtener Obsequio y Abrir WhatsApp 🚀</span>
                    )}
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-white/10 text-center">
                  <button
                    type="button"
                    onClick={handleDirectWhatsappRedirect}
                    className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    ¿Ya registraste tus datos antes? Abrir WhatsApp directo →
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#00b4a6]/20 border border-[#00b4a6]/50 flex items-center justify-center mx-auto mb-3 text-[#00b4a6]">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span className="text-xs font-extrabold text-[#00b4a6] uppercase tracking-wider block mb-1">
                  ¡DATOS REGISTRADOS Y OBSEQUIO ACTIVADO!
                </span>
                <h3 className="text-xl font-extrabold text-white mb-2">
                  Folio: <span className="text-[#00b4a6]">{folioCode}</span>
                </h3>
                <p className="text-xs text-gray-300 mb-5">
                  Hola <strong>{nombre}</strong>, tu certificado para <strong>{nombreNegocio}</strong> está activado. Si WhatsApp no se abrió automáticamente, presiona el botón abajo:
                </p>

                <div className="space-y-3">
                  {finalWaUrl && (
                    <a
                      href={finalWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3.5 px-4 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>💬 Abrir chat de WhatsApp con Folio {folioCode}</span>
                    </a>
                  )}

                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 px-4 rounded-xl bg-base-200 hover:bg-base-300 border border-white/20 text-white font-bold text-xs transition-colors"
                    >
                      📥 Descargar Certificado + Guía PDF
                    </a>
                  )}

                  {/* QR Code for Desktop */}
                  <div className="pt-2">
                    <p className="text-[11px] text-gray-400 mb-2">
                      O escanea con tu celular para chatear de inmediato:
                    </p>
                    <div className="bg-white p-2.5 rounded-xl inline-block shadow-inner">
                      <img
                        src={qrCodeUrl}
                        alt="Código QR WhatsApp Idealy"
                        width={160}
                        height={160}
                        className="w-36 h-36 mx-auto"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-gray-400 hover:text-white underline block mx-auto pt-2"
                  >
                    Cerrar ventana
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

