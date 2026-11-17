'use client';

import React, { useEffect, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Loader2, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { trackScheduleConversion } from '@/lib/gtag';

interface CalEmbedProps {
  calLink?: string;
  calUrl?: string;
  lead: {
    id: string;
    nombre: string;
    nombreNegocio: string;
    folioCode: string | null;
    whatsapp?: string;
  };
  token: string;
  onBookingSuccessful?: (eventData: any) => void;
}

export default function CalEmbed({
  calLink = 'idealy-o2fiqr/idealy-auditorias',
  calUrl = 'https://cal.com/idealy-o2fiqr/idealy-auditorias',
  lead,
  token,
  onBookingSuccessful,
}: CalEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const folioDisplay = lead.folioCode || 'PE-0000';
  const notesText = `Folio: ${folioDisplay} | Negocio: ${lead.nombreNegocio || 'Sin especificar'} | WhatsApp: ${lead.whatsapp || ''}`;

  useEffect(() => {
    let isMounted = true;

    async function initCal() {
      try {
        const cal = await getCalApi();
        if (!isMounted) return;

        cal('ui', {
          theme: 'dark',
          styles: {
            branding: {
              brandColor: '#00b4a6',
            },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });

        cal('on', {
          action: 'bookingSuccessful',
          callback: (e: any) => {
            console.log('Cal.com bookingSuccessful:', e);
            trackScheduleConversion({
              cal_link: calLink,
              lead_id: lead.id,
              folio: folioDisplay,
              lead_type: 'pagina_express_activacion',
            });
            if (onBookingSuccessful) {
              onBookingSuccessful(e.detail || e);
            }
          },
        });

        setLoaded(true);
      } catch (err) {
        console.error('Error inicializando Cal.com embed:', err);
        setLoaded(true);
      }
    }

    initCal();

    // Fallback: escuchar también vía postMessage directo de window
    const handlePostMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (
          data?.type === 'cal:bookingSuccessful' ||
          data?.event === 'bookingSuccessful' ||
          data?.action === 'bookingSuccessful'
        ) {
          trackScheduleConversion({
            cal_link: calLink,
            lead_id: lead.id,
            folio: folioDisplay,
            lead_type: 'pagina_express_activacion',
          });
          if (onBookingSuccessful) {
            onBookingSuccessful(data);
          }
        }
      } catch {
        // Ignorar mensajes no JSON
      }
    };

    window.addEventListener('message', handlePostMessage);

    return () => {
      isMounted = false;
      window.removeEventListener('message', handlePostMessage);
    };
  }, [onBookingSuccessful]);

  const fallbackHref = `${calUrl}?name=${encodeURIComponent(lead.nombre)}&notes=${encodeURIComponent(
    notesText
  )}&metadata[token]=${encodeURIComponent(token)}`;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full min-h-[580px] rounded-2xl overflow-hidden border border-slate-800 bg-[#07131e] relative">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#00b4a6]" />
            <span className="text-xs font-semibold">Cargando disponibilidad de agenda...</span>
          </div>
        )}

        <Cal
          calLink={calLink}
          style={{ width: '100%', height: '100%', minHeight: '580px', overflow: 'scroll' }}
          config={{
            name: lead.nombre,
            notes: notesText,
            theme: 'dark',
            metadata: {
              token: token,
              leadId: lead.id,
              folio: folioDisplay,
            },
          }}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400">
          ¿Tienes problemas visualizando el calendario?{' '}
          <a
            href={fallbackHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00b4a6] hover:underline font-semibold inline-flex items-center gap-1"
          >
            Abrir en ventana completa <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </div>
  );
}

