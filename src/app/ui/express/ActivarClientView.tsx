'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BriefForm from '@/app/ui/express/BriefForm';
import CalEmbed from '@/app/ui/express/CalEmbed';
import {
  CheckCircle,
  ShieldCheck,
  MessageCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import type { BriefFormData } from '@/lib/pagina-express/brief-schema';

interface ActivarClientViewProps {
  token: string;
  lead: {
    id: string;
    nombre: string;
    nombreNegocio: string;
    folioCode: string | null;
    status: string;
    whatsapp: string;
    brief: any;
    cita: any;
    validUntil?: string | null;
  };
}

export default function ActivarClientView({ token, lead }: ActivarClientViewProps) {
  // Flujo: 1. Agenda (llamada) -> 2. Brief (negocio) -> 3. Confirmación
  const [currentStep, setCurrentStep] = useState<'agenda' | 'brief' | 'confirmacion'>(() => {
    // Si ya completó cita y brief -> confirmación
    if (lead.cita && lead.brief) return 'confirmacion';
    // Si ya tiene cita agendada pero le falta brief -> brief
    if (lead.status === 'cita_agendada' || lead.cita) return 'brief';
    // Si ya completó brief pero le falta cita -> agenda
    if (lead.status === 'brief_completado') return 'agenda';
    // Por defecto para nuevo lead: primero agendar llamada
    return 'agenda';
  });

  const [savedBrief, setSavedBrief] = useState<BriefFormData | null>(lead.brief || null);
  const [hasBooked, setHasBooked] = useState<boolean>(Boolean(lead.cita || lead.status === 'cita_agendada'));

  const folioDisplay = lead.folioCode || 'PE-0000';

  const handleBookingSuccess = (_bookingData: any) => {
    setHasBooked(true);
    setCurrentStep('brief');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBriefSuccess = (data: BriefFormData) => {
    setSavedBrief(data);
    setCurrentStep('confirmacion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calUrl = process.env.NEXT_PUBLIC_CAL_URL || 'https://cal.com/idealy-o2fiqr/idealy-auditorias';
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK || 'idealy-o2fiqr/idealy-auditorias';

  const waContactUrl = `https://wa.me/522227184293?text=${encodeURIComponent(
    `Hola, soy ${lead.nombre} de ${lead.nombreNegocio || 'mi negocio'} (Folio ${folioDisplay}). Tengo una duda sobre mi llamada de Página Express.`
  )}`;

  return (
    <div className="min-h-screen bg-[#07131e] text-slate-100 flex flex-col justify-between selection:bg-[#00b4a6] selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#07131e]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/pagina-express" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Image
              src="/img/Logo-Idealy.png"
              alt="Logo Idealy"
              width={130}
              height={40}
              priority
              className="object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
              {folioDisplay}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {/* Step Indicator Tracker (1: Tu llamada -> 2: Tu negocio) */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {/* Paso 1: Tu llamada */}
            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                currentStep === 'agenda'
                  ? 'bg-[#00b4a6]/10 border-[#00b4a6] shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span
                  className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                    currentStep === 'agenda'
                      ? 'bg-[#00b4a6] text-white'
                      : hasBooked || currentStep === 'confirmacion'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {hasBooked || currentStep === 'confirmacion' ? '✓' : '1'}
                </span>
                <span className="text-xs font-bold">Tu llamada</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Elige día y hora</p>
            </div>

            {/* Paso 2: Tu negocio */}
            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                currentStep === 'brief'
                  ? 'bg-[#00b4a6]/10 border-[#00b4a6] shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span
                  className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                    currentStep === 'brief'
                      ? 'bg-[#00b4a6] text-white'
                      : currentStep === 'confirmacion'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentStep === 'confirmacion' ? '✓' : '2'}
                </span>
                <span className="text-xs font-bold">Tu negocio</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Cuéntanos qué haces</p>
            </div>
          </div>
        </div>

        {/* ── PASO 1: AGENDA (Elige día y hora primero) ── */}
        {currentStep === 'agenda' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            {/* Encabezado unificado */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  Hola, {lead.nombre}.<br />
                  Aseguremos <span className="text-[#00b4a6]">tu llamada</span>.
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
                  Elige el día y la hora que mejor te acomoden. Apartarás tu lugar para la videollamada 1 a 1 de 20 minutos y congelarás tu cupón.
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#00b4a6]/15 text-[#00b4a6] border border-[#00b4a6]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cupón activo · $5,000 + IVA
                </span>
              </div>
            </div>

            {/* Tarjeta amigable con foto del asesor */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm">
              <div className="relative shrink-0">
                <Image
                  src="/img/express/express_mauricio.jpg"
                  alt="Mauricio Villegas - Asesor Idealy"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#00b4a6]/40 shadow-md"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#07131e]"
                  title="Disponible para videollamada"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-sm font-bold text-white">Mauricio Villegas · Asesor Estratégico</h3>
                  <span className="badge badge-sm bg-[#00b4a6]/15 text-[#00b4a6] border border-[#00b4a6]/30 font-semibold text-[11px]">
                    Google Meet 1 a 1
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Platicaremos 20 minutos para revisar tu propuesta, resolver dudas y diseñar la estructura que mejor convertirá para {lead.nombreNegocio || 'tu negocio'}.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> 20 min sin costo
                  </span>
                  <span className="flex items-center gap-1 text-[#00b4a6]">
                    <CheckCircle className="w-3.5 h-3.5" /> Videollamada directa
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Cupón asegurado
                  </span>
                </div>
              </div>
            </div>

            {/* Cal.com Official Embed */}
            <CalEmbed
              calLink={calLink}
              calUrl={calUrl}
              lead={lead}
              token={token}
              onBookingSuccessful={handleBookingSuccess}
            />

            {/* Enlace alternativo para saltar al brief */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setCurrentStep('brief')}
                className="text-xs text-slate-400 hover:text-[#00b4a6] underline font-medium cursor-pointer transition-colors"
              >
                ¿Prefieres contarnos de tu negocio primero? Ir al formulario del brief →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: BRIEF FORM (Cuéntanos de tu negocio) ── */}
        {currentStep === 'brief' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            {/* Encabezado con confirmación de llamada previa */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
              <div>
                {hasBooked && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-3 animate-fadeIn">
                    <CheckCircle className="w-3.5 h-3.5" />
                    ¡Llamada reservada con éxito!
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  Ahora, cuéntanos de <span className="text-[#00b4a6]">tu negocio</span>.
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
                  Tu página empieza por entender qué haces y a quién le vendes. Cuéntanoslo en 3 minutos y llegamos a la videollamada con ideas y propuestas exactas para ti.
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#00b4a6]/15 text-[#00b4a6] border border-[#00b4a6]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cupón activo · $5,000 + IVA
                </span>
              </div>
            </div>

            {/* The Brief Form */}
            <BriefForm
              token={token}
              leadNombre={lead.nombre}
              initialData={{
                negocio_nombre: lead.nombreNegocio,
                ...(savedBrief || {}),
              }}
              onSuccess={handleBriefSuccess}
              submitButtonText="Listo, confirmar mi activación"
              footerNote="Al guardar tu información, tu asesor revisará tus respuestas antes de la videollamada para preparar propuestas a tu medida."
            />

            {/* Opción para volver a ver la fecha de la llamada */}
            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setCurrentStep('agenda')}
                className="hover:text-[#00b4a6] underline font-medium cursor-pointer transition-colors"
              >
                ← Ver o cambiar horario de mi llamada
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: CONFIRMACIÓN (Todo listo y asegurado) ── */}
        {currentStep === 'confirmacion' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md text-center">
            {/* Foto amigable y check */}
            <div className="relative inline-block mx-auto mb-4">
              <Image
                src="/img/express/express_mauricio.jpg"
                alt="Mauricio Villegas - Asesor Idealy"
                width={88}
                height={88}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl object-cover ring-4 ring-[#00b4a6]/30 shadow-xl mx-auto"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-[#07131e]">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              ¡Todo listo, {lead.nombre}!
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Tu llamada para <strong className="text-white">{savedBrief?.negocio_nombre || lead.nombreNegocio || 'tu negocio'}</strong> está agendada y tu información fue recibida con éxito.
            </p>

            <div className="max-w-md mx-auto bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-left mb-6 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Folio de Cupón:</span>
                <span className="font-mono font-bold text-[#00b4a6]">{folioDisplay}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Llamada:</span>
                <span className="badge badge-success badge-sm font-bold gap-1">
                  <Calendar className="w-3 h-3" /> Agendada
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Brief estratégico:</span>
                <span className="badge badge-info badge-sm font-bold gap-1">
                  <Sparkles className="w-3 h-3" /> Completado
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cupón ($5,000 + IVA):</span>
                <span className="text-emerald-400 font-semibold">Garantizado</span>
              </div>
            </div>

            <div className="space-y-3 max-w-xs mx-auto">
              <a
                href={waContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full rounded-2xl text-xs font-bold gap-2 shadow-lg hover:shadow-[#00b4a6]/25"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar a mi asesor por WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setCurrentStep('brief')}
                className="btn btn-ghost text-xs text-slate-400 hover:text-white"
              >
                Ver mis respuestas del brief
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07131e]/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Idealy · Páginas Express de Alta Conversión</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Aviso de Privacidad
            </Link>
            <a
              href="https://wa.me/522227184293"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00b4a6] transition-colors"
            >
              Soporte WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
