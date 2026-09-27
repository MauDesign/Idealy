'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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

  const encodedMessage = encodeURIComponent(presetMessage);
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=0069a9&data=${encodeURIComponent(whatsappUrl)}`;

  const handleClick = (e: React.MouseEvent) => {
    // Analytics conversion event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'conversion',
        event_label: locationTag,
      });
      if (typeof window.gtag_report_conversion === 'function') {
        window.gtag_report_conversion(whatsappUrl);
      }
    }

    // Detect if mobile browser
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-xl ${className}`}
      >
        <span>{buttonText}</span>
      </button>

      {/* Desktop Modal for QR Code */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-[#00b4a6]/30 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-base-200"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-[#00b4a6]/20 flex items-center justify-center mx-auto mb-4 text-[#00b4a6]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Escanea para abrir en tu celular
            </h3>
            <p className="text-sm text-gray-300 mb-5">
              Muchos dueños de negocio usan WhatsApp solo en el teléfono. Apunta con la cámara de tu celular para chatear de inmediato.
            </p>

            <div className="bg-white p-3 rounded-xl inline-block shadow-inner mb-5">
              <img
                src={qrCodeUrl}
                alt="Código QR WhatsApp Idealy"
                width={200}
                height={200}
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-bold text-sm transition-colors shadow-md"
              >
                Abrir WhatsApp Web directamente →
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-400 hover:text-white underline block mx-auto"
              >
                Cerrar y seguir viendo la página
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
