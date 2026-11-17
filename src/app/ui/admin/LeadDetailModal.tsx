'use client';

import React, { useState } from 'react';
import { FileText, X, Calendar, Globe, User, Building, Phone, Target, Sparkles, MessageSquare } from 'lucide-react';

interface LeadDetailModalProps {
  folioCode: string;
  nombre: string;
  nombreNegocio: string;
  whatsapp: string;
  status: string;
  brief: any;
  cita?: any;
}

export default function LeadDetailModal({
  folioCode,
  nombre,
  nombreNegocio,
  whatsapp,
  status,
  brief,
  cita,
}: LeadDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!brief) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-base-content/40 font-medium italic">
        Sin brief aún
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all cursor-pointer shadow-2xs"
      >
        <FileText className="w-3.5 h-3.5" />
        Ver Brief
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-base-100 border border-base-300 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-base-200 flex items-center justify-between bg-base-200/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {folioCode}
                    </span>
                    <h3 className="text-base font-extrabold text-base-content">
                      Brief Estratégico · {brief.negocio_nombre || nombreNegocio}
                    </h3>
                  </div>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    Cliente: {nombre} · WhatsApp: {whatsapp}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/60 border border-base-300">
                <span className="text-xs font-bold text-base-content/70">Estado del Lead:</span>
                <span className="badge badge-primary font-bold text-xs uppercase tracking-wider">
                  {status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Grid of Brief Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Nombre Negocio */}
                <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200">
                  <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                    1. Negocio
                  </div>
                  <div className="font-bold text-base-content text-base">
                    {brief.negocio_nombre || nombreNegocio}
                  </div>
                </div>

                {/* 2. Giro */}
                <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200">
                  <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                    2. Giro
                  </div>
                  <div className="font-bold text-primary">
                    {brief.giro === 'Otro' ? `Otro: ${brief.giro_otro || ''}` : brief.giro}
                  </div>
                </div>
              </div>

              {/* 3. Oferta Principal */}
              <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200 space-y-1">
                <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                  3. Producto o Servicio Principal
                </div>
                <p className="text-base-content leading-relaxed font-medium">
                  {brief.oferta || '-'}
                </p>
              </div>

              {/* 4. Cliente Ideal */}
              <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200 space-y-1">
                <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                  4. Cliente Ideal (Público)
                </div>
                <p className="text-base-content leading-relaxed font-medium">
                  {brief.publico || '-'}
                </p>
              </div>

              {/* 5. Objetivo de la Página */}
              <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200 space-y-1">
                <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                  5. Acción Esperada (Objetivo)
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#00b4a6]/15 text-[#00b4a6]">
                  <Target className="w-3.5 h-3.5" />
                  {brief.objetivo || '-'}
                </div>
              </div>

              {/* 6. Presencia actual */}
              <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200 space-y-2">
                <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                  6. Elementos que tiene hoy
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(brief.presencia) && brief.presencia.length > 0 ? (
                    brief.presencia.map((item: string) => (
                      <span
                        key={item}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-base-300 text-base-content/80"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-base-content/50">Nada todavía</span>
                  )}
                </div>
              </div>

              {/* 7. Links */}
              {brief.links && (
                <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200 space-y-1">
                  <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    7. Enlaces compartidos
                  </div>
                  <a
                    href={brief.links.startsWith('http') ? brief.links : `https://${brief.links}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-xs break-all"
                  >
                    {brief.links}
                  </a>
                </div>
              )}

              {/* 8. Comentarios */}
              {brief.comentarios && (
                <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200 space-y-1">
                  <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    8. Comentarios adicionales
                  </div>
                  <p className="text-base-content/90 text-xs leading-relaxed italic">
                    "{brief.comentarios}"
                  </p>
                </div>
              )}

              {/* Cita de Cal.com si existe */}
              {cita && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-4 h-4" />
                    <span>Cita Agendada con Cal.com</span>
                  </div>
                  <p className="text-xs text-base-content/80">
                    {typeof cita === 'string' ? cita : JSON.stringify(cita)}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-base-200 bg-base-200/30 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-sm btn-ghost rounded-xl text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

