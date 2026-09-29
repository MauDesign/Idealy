import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppButton from '@/app/ui/express/WhatsAppModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¡Gracias por tus datos! | Idealy Página Express',
  description: 'Tus 10 mensajes listos para vender por WhatsApp van en camino.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ nombre?: string; leadId?: string }>;
}) {
  const { nombre, leadId } = await searchParams;
  const leadNombre = nombre ? decodeURIComponent(nombre) : 'amigo/a';

  const downloadTargetUrl = leadId
    ? `/pagina-express/descarga?leadId=${encodeURIComponent(leadId)}`
    : `/pagina-express/descarga?nombre=${encodeURIComponent(leadNombre)}`;

  return (
    <div className="min-h-screen bg-[#07131e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00b4a6]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full bg-base-100/90 border border-[#00b4a6]/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-md relative z-10">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Image
              src="/img/Logo-Idealy.png"
              alt="Logo Idealy"
              width={160}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="w-16 h-16 bg-[#00b4a6]/20 border border-[#00b4a6]/40 rounded-full flex items-center justify-center mx-auto mb-6 text-[#00b4a6]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          ¡Listo, <span className="text-[#00b4a6]">{leadNombre}</span>!
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-6 leading-relaxed">
          Tus 10 mensajes ya van en camino a tu WhatsApp, y te agregamos un regalo sorpresa 🎁.
        </p>

        <div className="bg-[#0069a9]/20 border border-[#0069a9]/40 rounded-2xl p-6 mb-8 text-left">
          <p className="text-sm font-semibold text-[#00b4a6] mb-1">
            Revisa tu chat de WhatsApp
          </p>
          <p className="text-xs text-gray-300">
            Te enviamos tu enlace personal para abrir la guía PDF y activar tu Certificado Página Express con precio congelado y 1 mes de mantenimiento gratis.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href={downloadTargetUrl}
            className="w-full py-4 px-6 rounded-2xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-extrabold text-lg shadow-xl flex items-center justify-center gap-2"
          >
            <span>📥 Ir a la Zona de Descarga PDF</span>
          </Link>

          <WhatsAppButton
            buttonText="Escríbenos por WhatsApp →"
            locationTag="gracias_page"
            presetMessage="Hola, quiero usar mi certificado Página Express"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0069a9] hover:bg-[#00588f] text-white font-bold text-base shadow-lg"
          />

          <Link
            href="/pagina-express"
            className="block text-xs text-gray-400 hover:text-white transition-colors pt-2"
          >
            ← Volver a la oferta Página Express
          </Link>
        </div>
      </div>
    </div>
  );
}
