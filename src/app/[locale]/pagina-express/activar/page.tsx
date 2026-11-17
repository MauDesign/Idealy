import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ActivarClientView from '@/app/ui/express/ActivarClientView';
import { AlertCircle, HelpCircle, ArrowLeft, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cuéntanos de tu negocio · Página Express',
  description: 'Completa tu brief en 3 minutos para preparar la llamada estratégica y activar tu Página Express.',
  robots: {
    index: false,
    follow: false,
  },
};

interface ActivarPageProps {
  searchParams: Promise<{
    token?: string;
    leadId?: string;
    folio?: string;
  }>;
}

export default async function ActivarPage({ searchParams }: ActivarPageProps) {
  const { token, leadId, folio } = await searchParams;

  const rawKey = (token || leadId || folio || '').trim();

  let lead = null;

  if (rawKey) {
    try {
      lead = await prisma.expressLead.findFirst({
        where: {
          OR: [
            { token: rawKey },
            { id: rawKey },
            { folioCode: rawKey.toUpperCase() },
          ],
        },
        include: {
          certificate: true,
        },
      });
    } catch (err) {
      console.error('Error buscando lead para activación:', err);
    }
  }

  // 1. Pantalla: TOKEN INVÁLIDO / ENLACE NO ENCONTRADO
  if (!lead) {
    return (
      <div className="min-h-screen bg-[#07131e] text-white flex flex-col justify-between p-4 selection:bg-[#00b4a6] selection:text-white">
        <header className="max-w-4xl w-full mx-auto py-6 flex justify-center">
          <Link href="/pagina-express">
            <Image
              src="/img/Logo-Idealy.png"
              alt="Logo Idealy"
              width={140}
              height={45}
              priority
              className="object-contain"
            />
          </Link>
        </header>

        <main className="max-w-md w-full mx-auto my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <AlertCircle className="w-8 h-8" />
          </div>

          <span className="badge badge-warning badge-sm font-bold mb-2">ENLACE NO VÁLIDO</span>
          <h1 className="text-2xl font-extrabold text-white mb-3">
            No encontramos tu cupón
          </h1>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Es posible que el enlace esté incompleto o que el token haya caducado. Si ya te registraste para Página Express, escríbenos directamente y te daremos acceso inmediato.
          </p>

          <div className="space-y-3">
            <a
              href="https://wa.me/522227184293?text=Hola%20Idealy%2C%20tengo%20un%20problema%20con%20el%20enlace%20de%20activaci%C3%B3n%20de%20mi%20P%C3%A1gina%20Express."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full rounded-xl text-xs font-bold gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Solicitar mi enlace por WhatsApp
            </a>

            <Link
              href="/pagina-express"
              className="btn btn-ghost text-xs text-slate-400 hover:text-white w-full gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a Página Express
            </Link>
          </div>
        </main>

        <footer className="text-center py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Idealy · Soporte técnico y atención personalizada
        </footer>
      </div>
    );
  }

  // 2. Pantalla: BRIEF Y ACTIVACIÓN DE CUPÓN
  const effectiveToken = lead.token || lead.id;

  const serializedLead = {
    id: lead.id,
    nombre: lead.nombre,
    nombreNegocio: lead.nombreNegocio,
    folioCode: lead.folioCode,
    status: lead.status || 'cupon_enviado',
    whatsapp: lead.whatsapp,
    brief: lead.brief || null,
    cita: lead.cita || null,
    validUntil: lead.certificate?.validUntil?.toISOString() || null,
  };

  return <ActivarClientView token={effectiveToken} lead={serializedLead} />;
}

