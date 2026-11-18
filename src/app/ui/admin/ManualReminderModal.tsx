'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  X,
  Send,
  MessageCircle,
  Copy,
  Check,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ManualReminderModalProps {
  lead: {
    id: string;
    folioCode: string;
    nombre: string;
    nombreNegocio: string;
    whatsapp: string;
    token?: string | null;
    createdAt: string | Date;
    hasDownloadedPdf: boolean;
    hasDownloadedCert: boolean;
    isRedeemed: boolean;
    status: string;
    reminder2SentAt?: string | Date | null;
    reminder5SentAt?: string | Date | null;
  };
  baseUrl?: string;
}

export default function ManualReminderModal({
  lead,
  baseUrl = 'https://www.idealy.com.mx',
}: ManualReminderModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  // Calcular horas y días transcurridos
  const diffHours = (Date.now() - new Date(lead.createdAt).getTime()) / 3600000;
  const diasTranscurridos = Math.max(1, Math.floor(diffHours / 24) + 1);

  // Etapa sugerida por defecto según el estado del lead
  const initialStage = useMemo<'descarga' | 'agenda' | 'vence'>(() => {
    if (!lead.hasDownloadedCert) return 'descarga';
    if (diffHours >= 120 && !lead.isRedeemed) return 'vence';
    return 'agenda';
  }, [lead.hasDownloadedCert, lead.isRedeemed, diffHours]);

  const [stage, setStage] = useState<'descarga' | 'agenda' | 'vence'>(initialStage);

  // URLs
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : baseUrl;

  const downloadUrl = `${currentOrigin}/pagina-express/descarga?leadId=${lead.id}`;
  const effectiveToken = lead.token || lead.folioCode || lead.id;
  const activarUrl = `${currentOrigin}/es/pagina-express/activar?token=${encodeURIComponent(
    effectiveToken
  )}`;

  // Teléfono formateado
  const rawWa = lead.whatsapp.replace(/\D/g, '');
  const cleanWa = rawWa.startsWith('52') ? rawWa : `52${rawWa}`;

  // Saludo y nombre
  const saludo = lead.nombre ? `Hola ${lead.nombre.trim()} 👋` : 'Hola 👋';
  const negocio = lead.nombreNegocio ? ` para ${lead.nombreNegocio}` : '';

  // Textos según la etapa
  const defaultTexts = useMemo(() => {
    return {
      descarga: `${saludo} Soy Mauricio de Idealy. Vi que aún no descargas tu guía de *10 mensajes para vender por WhatsApp* ni activas tu *Certificado Página Express* (${lead.folioCode})${negocio}.\n\nAquí sigue tu enlace personal:\n📲 ${downloadUrl}\n\nSi tienes alguna duda, respóndeme por aquí y con gusto te ayudo.`,
      agenda: `${saludo} Tu *Certificado de $5,000 + IVA* de Página Express (${lead.folioCode}) está activo y listo.\n\nEl siguiente paso es elegir el día y hora de tu videollamada estratégica de 20 minutos con tu asesor:\n📲 ${activarUrl}\n\nSolo te tomará 1 minuto apartar tu lugar. Quedamos a tus órdenes. 🚀`,
      vence: `${saludo} Soy Mauricio de Idealy. Tu *Certificado Página Express* (${lead.folioCode}) con precio congelado está por vencer.\n\nSi aún te interesa, puedo *extenderte la vigencia 7 días más*. Respóndeme "Sí" a este mensaje y te lo reactivo de inmediato.`,
    };
  }, [saludo, lead.folioCode, negocio, downloadUrl, activarUrl]);

  const [messageText, setMessageText] = useState<string>(defaultTexts[initialStage]);

  // Cambiar etapa
  const handleSelectStage = (newStage: 'descarga' | 'agenda' | 'vence') => {
    setStage(newStage);
    setMessageText(defaultTexts[newStage]);
    setSuccessInfo(null);
    setErrorInfo(null);
  };

  // Enlace directo de WhatsApp
  const waDirectUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(messageText)}`;

  // Copiar al portapapeles
  const handleCopy = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(messageText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = messageText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Enviar a través del Webhook (n8n / Evolution API)
  const handleSendWebhook = async () => {
    setIsSending(true);
    setSuccessInfo(null);
    setErrorInfo(null);

    try {
      const res = await fetch('/api/admin/express-leads/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          tipo: stage,
          customText: messageText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorInfo(data.error || 'Ocurrió un error al procesar el recordatorio');
        return;
      }

      if (data.n8nSent) {
        setSuccessInfo('¡Recordatorio enviado con éxito por WhatsApp vía n8n!');
      } else {
        setSuccessInfo('Recordatorio registrado en base de datos. (Webhook n8n en espera o en modo local).');
      }

      router.refresh();
    } catch (err: any) {
      console.error('Error enviando recordatorio:', err);
      setErrorInfo('Error de red al conectar con el servidor');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Botón que abre el modal en la tabla */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setMessageText(defaultTexts[stage]);
          setSuccessInfo(null);
          setErrorInfo(null);
        }}
        title="Enviar recordatorio manual a este cliente"
        className="btn btn-outline btn-xs font-bold gap-1 rounded-xl hover:bg-primary hover:border-primary text-base-content/80 transition-all shadow-2xs"
      >
        <Bell className="w-3.5 h-3.5 text-primary" />
        <span>Recordatorio</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-base-100 border border-base-300 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-base-200 flex items-center justify-between bg-base-200/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {lead.folioCode}
                    </span>
                    <h3 className="text-base font-extrabold text-base-content">
                      Enviar Recordatorio Manual
                    </h3>
                  </div>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    Cliente: <strong>{lead.nombre}</strong> · {lead.nombreNegocio || 'Sin negocio'} ·{' '}
                    <span className="text-primary font-semibold">{lead.whatsapp}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-base-content"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Resumen de etapa y antigüedad */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-base-300">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-base-content/70">Antigüedad del lead:</span>
                  <span className="font-bold text-base-content">
                    Día {diasTranscurridos} ({diffHours.toFixed(1)} horas)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-base-content/60">Estado cupón:</span>
                  <span
                    className={`badge badge-sm font-bold ${
                      lead.hasDownloadedCert ? 'badge-info' : 'badge-ghost text-base-content/50'
                    }`}
                  >
                    {lead.hasDownloadedCert ? 'Descargado' : 'No descargado'}
                  </span>
                </div>
              </div>

              {/* Selector de Etapa de Recordatorio */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
                  Selecciona la etapa del mensaje:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Etapa 1: Descarga */}
                  <button
                    type="button"
                    onClick={() => handleSelectStage('descarga')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      stage === 'descarga'
                        ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                        : 'border-base-300 bg-base-100 hover:border-base-content/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">1. Descarga</span>
                      <span className="text-[10px] text-base-content/50 font-mono">Día 2</span>
                    </div>
                    <p className="text-[11px] text-base-content/60 leading-tight">
                      Para quien aún no descarga su guía ni activa su certificado.
                    </p>
                  </button>

                  {/* Etapa 2: Agendar / Activación */}
                  <button
                    type="button"
                    onClick={() => handleSelectStage('agenda')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      stage === 'agenda'
                        ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                        : 'border-base-300 bg-base-100 hover:border-base-content/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">2. Agendar</span>
                      <span className="text-[10px] text-base-content/50 font-mono">Uso cupón</span>
                    </div>
                    <p className="text-[11px] text-base-content/60 leading-tight">
                      Cupón activo: invita a agendar su videollamada de 20 min.
                    </p>
                  </button>

                  {/* Etapa 3: Vencimiento */}
                  <button
                    type="button"
                    onClick={() => handleSelectStage('vence')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      stage === 'vence'
                        ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                        : 'border-base-300 bg-base-100 hover:border-base-content/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">3. Vencimiento</span>
                      <span className="text-[10px] text-base-content/50 font-mono">Día 5</span>
                    </div>
                    <p className="text-[11px] text-base-content/60 leading-tight">
                      Aviso de cupón por vencer con opción a extender 7 días más.
                    </p>
                  </button>
                </div>
              </div>

              {/* Editor del Mensaje */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
                    Mensaje personalizado listo para enviar:
                  </label>
                  <button
                    type="button"
                    onClick={() => setMessageText(defaultTexts[stage])}
                    className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Restablecer texto sugerido
                  </button>
                </div>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={6}
                  className="textarea textarea-bordered w-full rounded-2xl text-xs sm:text-sm bg-base-200/40 border-base-300 font-sans leading-relaxed focus:border-primary transition-all"
                  placeholder="Escribe el mensaje..."
                />
              </div>

              {/* Mensajes de feedback */}
              {successInfo && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successInfo}</span>
                </div>
              )}

              {errorInfo && (
                <div className="p-3.5 rounded-2xl bg-error/15 border border-error/30 text-error flex items-center gap-2 text-xs font-semibold animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorInfo}</span>
                </div>
              )}
            </div>

            {/* Footer con 3 acciones */}
            <div className="p-5 border-t border-base-200 bg-base-200/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Botón Copiar */}
              <button
                type="button"
                onClick={handleCopy}
                className="btn btn-ghost btn-sm rounded-xl text-xs font-bold gap-1.5 w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>¡Texto copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Botón Abrir en WhatsApp directo */}
                <a
                  href={waDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline border-emerald-500/50 text-emerald-600 hover:bg-emerald-600 hover:text-white btn-sm rounded-xl text-xs font-bold gap-1.5 flex-1 sm:flex-initial"
                  title="Abrir chat de WhatsApp con el mensaje cargado"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir WhatsApp</span>
                </a>

                {/* Botón Disparar por n8n */}
                <button
                  type="button"
                  onClick={handleSendWebhook}
                  disabled={isSending}
                  className="btn btn-primary btn-sm rounded-xl text-xs font-bold gap-1.5 flex-1 sm:flex-initial shadow-md"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar vía n8n</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
