'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Copy,
  Check,
  ExternalLink,
  Lock,
  Loader2,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';

interface ActivationLinkActionsProps {
  leadId: string;
  folioCode: string;
  nombre: string;
  nombreNegocio: string;
  whatsapp: string;
  token?: string | null;
  hasDownloadedCert?: boolean;
  baseUrl?: string;
}

export default function ActivationLinkActions({
  leadId,
  folioCode,
  nombre,
  nombreNegocio,
  whatsapp,
  token,
  hasDownloadedCert = false,
  baseUrl = 'https://www.idealy.com.mx',
}: ActivationLinkActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(hasDownloadedCert);
  const [activeToken, setActiveToken] = useState<string | null | undefined>(token);
  const [isMarking, setIsMarking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const effectiveToken = activeToken || folioCode || leadId;

  // Resolve base url (prefer window.location.origin if running in browser)
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : baseUrl;

  const activarUrl = `${currentOrigin}/es/pagina-express/activar?token=${encodeURIComponent(
    effectiveToken
  )}`;

  // Formato para WhatsApp
  const rawWa = (whatsapp || '').replace(/\D/g, '');
  const cleanWa = rawWa.startsWith('52') ? rawWa : `52${rawWa}`;
  const negocioText = nombreNegocio ? ` para ${nombreNegocio}` : '';

  const waMessage = `¡Hola, ${nombre}! 👋 Aquí tienes tu enlace de seguimiento y activación de tu cupón de Página Express:\n\n${activarUrl}\n\nEn este link puedes elegir el día y hora de tu videollamada de 20 minutos con tu asesor y contarnos qué vendes${negocioText}. ¡Quedamos atentos! 🚀`;

  const waSendUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMessage)}`;

  // Copiar solo el enlace
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDownloaded) return;

    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(activarUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = activarUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar link:', err);
    }
  };

  // Copiar mensaje completo listo para WhatsApp
  const handleCopyMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDownloaded) return;

    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(waMessage);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = waMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch (err) {
      console.error('Error al copiar mensaje:', err);
    }
  };

  // Acción: Marcar cupón como descargado manualmente
  const handleMarkDownloaded = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMarking(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/express-leads/cert-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'No se pudo actualizar');
        return;
      }

      setIsDownloaded(true);
      if (data.token) {
        setActiveToken(data.token);
      }
      router.refresh();
    } catch (err) {
      console.error('Error marcando como descargado:', err);
      setErrorMsg('Error de red');
    } finally {
      setIsMarking(false);
    }
  };

  // Estado 1: No descargado -> Permite marcarlo directamente con un clic
  if (!isDownloaded) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-base-200/60 border border-base-300 text-base-content/50 text-[10px] select-none font-medium">
          <Lock className="w-3 h-3 text-base-content/40" />
          <span>No descargado</span>
        </div>

        <button
          type="button"
          onClick={handleMarkDownloaded}
          disabled={isMarking}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-focus hover:underline cursor-pointer transition-colors"
          title="Marcar cupón como descargado para generar y desbloquear su link de seguimiento"
        >
          {isMarking ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-[#00b4a6]" />
              <span>Marcar descargado</span>
            </>
          )}
        </button>

        {errorMsg && <span className="text-[10px] text-error font-medium">{errorMsg}</span>}
      </div>
    );
  }

  // Estado 2: Descargado / Habilitado -> Acciones completas
  return (
    <div className="flex flex-col gap-1.5">
      <div className="inline-flex items-center gap-1.5">
        {/* Botón Copiar Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          title={`Copiar link de activación: ${activarUrl}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
            copied
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
              : 'bg-[#00b4a6]/10 text-[#00b4a6] hover:bg-[#00b4a6]/20 border-[#00b4a6]/30'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Link</span>
            </>
          )}
        </button>

        {/* Botón Ver (abre en pestaña nueva) */}
        <a
          href={activarUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir y validar vista del cliente en nueva pestaña"
          className="btn btn-ghost btn-xs text-base-content/70 hover:text-primary gap-1 rounded-lg px-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="text-xs">Ver</span>
        </a>
      </div>

      {/* Botón rápido Enviar / Copiar WhatsApp */}
      <div className="flex items-center gap-2 pt-0.5">
        <a
          href={waSendUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Abrir chat de WhatsApp con ${cleanWa} y mensaje preparado`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          <MessageCircle className="w-3 h-3 text-emerald-500" />
          <span>Enviar por WA</span>
        </a>

        <span className="text-base-content/20 text-xs">·</span>

        <button
          type="button"
          onClick={handleCopyMessage}
          title="Copiar texto listo para pegar en WhatsApp"
          className="text-[11px] text-base-content/60 hover:text-base-content hover:underline font-medium cursor-pointer"
        >
          {copiedMsg ? '¡Texto copiado!' : 'Copiar texto WA'}
        </button>
      </div>
    </div>
  );
}
