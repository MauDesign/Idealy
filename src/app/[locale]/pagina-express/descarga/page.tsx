import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import WhatsAppButton from '@/app/ui/express/WhatsAppModal';

export const metadata: Metadata = {
  title: 'Descarga tu Guía + Certificado Página Express | Idealy',
  description: 'Descarga los 10 mensajes listos para vender por WhatsApp y activa tu Certificado Página Express.',
  robots: {
    index: false,
    follow: false,
  },
};

const MESSAGES_PREVIEW = [
  {
    num: '1',
    title: 'Bienvenida que pregunta lo necesario para vender',
    text: '¡Hola! 👋 Qué gusto saludarte. Gracias por escribir a [Tu Negocio]. Para darte la información exacta que necesitas, ¿me cuentas qué producto o servicio te interesa?',
  },
  {
    num: '2',
    title: 'Cómo responder "¿precio?" sin espantar al cliente',
    text: '¡Hola [Nombre]! Con gusto. Nuestro [Producto/Servicio] incluye [Beneficio 1], [Beneficio 2] y [Beneficio 3]. El costo completo es de $[Precio]. ¿Te gustaría agendar o apartar el tuyo hoy?',
  },
  {
    num: '3',
    title: 'Enviar catálogo o servicios de forma ordenada',
    text: '¡Hola [Nombre]! Te comparto aquí nuestras opciones principales:\n• Opción A: [Detalle corto + Precio]\n• Opción B: [Detalle corto + Precio]\n¿Cuál de las dos se adapta mejor a lo que buscas?',
  },
  {
    num: '4',
    title: 'Seguimiento a quien preguntó y no contestó',
    text: '¡Hola [Nombre]! 👋 Quería saber si tuviste oportunidad de revisar la información que te envié. Me queda solo un espacio disponible para [semana/mes]. ¿Te guardo el tuyo?',
  },
  {
    num: '5',
    title: 'Respuesta a "está caro"',
    text: 'Entiendo perfectamente, [Nombre]. Lo que incluye nuestra solución es garantía total, atención personalizada y la entrega completa sin costos ocultos posterior. ¿Te gustaría que facilitemos el pago en 2 partes?',
  },
  {
    num: '6',
    title: 'Respuesta a "lo voy a pensar"',
    text: '¡Claro que sí, [Nombre]! Tómate tu tiempo. Solo ten en cuenta que la promoción de $[Precio] vence este [Día de la semana]. Si tienes cualquier duda, aquí sigo.',
  },
  {
    num: '7',
    title: 'Confirmación de pedido o cita',
    text: '¡Excelente decisión, [Nombre]! 🚀 Te confirmo que tu [cita/pedido] quedó agendado para el [Fecha/Hora]. Nos vemos pronto. ¡Gracias por tu confianza!',
  },
  {
    num: '8',
    title: 'Recordatorio de cita o entrega',
    text: '¡Hola [Nombre]! Te recuerdo que mañana a las [Hora] tenemos agendado tu [Servicio/Entrega]. ¿Me confirmas que todo en orden?',
  },
  {
    num: '9',
    title: 'Pedir una reseña en Google',
    text: '¡Hola [Nombre]! Esperamos que tu experiencia haya sido excelente ⭐. Nos ayudarías muchísimo dejando un comentario corto en nuestro Google Maps aquí: [Link]. ¡Te toma solo 30 segundos!',
  },
  {
    num: '10',
    title: 'Reactivar clientes que hace tiempo no compran',
    text: '¡Hola [Nombre]! Hace tiempo no sabemos de ti y te extrañamos en [Tu Negocio]. Tenemos una atención especial del [Descuento]% exclusiva para nuestros clientes frecuentes este mes. ¿Te gustaría aprovecharla?',
  },
];

export default async function DescargaPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; folio?: string; nombre?: string; negocio?: string }>;
}) {
  const { leadId, folio, nombre, negocio } = await searchParams;

  let inputFolio = folio ? decodeURIComponent(folio) : '';
  let leadNombre = nombre ? decodeURIComponent(nombre) : '';
  let leadNegocio = negocio ? decodeURIComponent(negocio) : '';
  let leadRecord = null;

  let cert = null;
  let totalCertificatesCount = 1;

  try {
    totalCertificatesCount = await prisma.expressCertificate.count();

    if (leadId) {
      leadRecord = await prisma.expressLead.findUnique({
        where: { id: leadId },
        include: { certificate: true },
      });

      if (leadRecord) {
        leadNombre = leadRecord.nombre;
        leadNegocio = leadRecord.nombreNegocio;

        if (leadRecord.certificate) {
          cert = leadRecord.certificate;
        }
      }
    }

    if (!cert && inputFolio) {
      cert = await prisma.expressCertificate.findUnique({
        where: { folioCode: inputFolio.toUpperCase() },
      });
    }

    if (!cert && (leadNombre || leadNegocio)) {
      cert = await prisma.expressCertificate.findFirst({
        where: { nombreNegocio: leadNegocio || undefined, nombre: leadNombre || undefined },
      });
    }

    // Fallback cert instance if not found
    if (!cert) {
      const displayFolio = inputFolio || `PE-${String(totalCertificatesCount || 1).padStart(4, '0')}`;
      const now = new Date();
      const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      cert = {
        folioCode: displayFolio,
        nombre: leadNombre || 'Amigo/a',
        nombreNegocio: leadNegocio || 'Tu Negocio',
        issuedAt: now,
        validUntil: validUntil,
        downloadCount: 1,
      };
    }
  } catch (err) {
    console.error('Error fetching certificate for download page:', err);
    const now = new Date();
    cert = {
      folioCode: inputFolio || 'PE-0001',
      nombre: leadNombre || 'Amigo/a',
      nombreNegocio: leadNegocio || 'Tu Negocio',
      issuedAt: now,
      validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      downloadCount: 1,
    };
  }

  const formatDateStr = (d: Date) => {
    return new Date(d).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const downloadUrl = leadId
    ? `/api/pagina-express/descargar-pdf?leadId=${encodeURIComponent(leadId)}`
    : `/api/pagina-express/descargar-pdf?folio=${encodeURIComponent(cert.folioCode)}&nombre=${encodeURIComponent(cert.nombre)}&negocio=${encodeURIComponent(cert.nombreNegocio)}`;

  return (
    <div className="min-h-screen bg-[#07131e] text-gray-100 font-sans selection:bg-[#00b4a6] selection:text-white pb-20">
      {/* Header Minimal */}
      <header className="w-full border-b border-white/10 bg-[#07131e]/90 backdrop-blur-md py-4 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/pagina-express" className="flex items-center gap-2">
            <Image
              src="/img/Logo-Idealy.png"
              alt="Logo Idealy"
              width={120}
              height={38}
              priority
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#00b4a6]/20 border border-[#00b4a6]/40 text-[#00b4a6]">
              DESCARGA OFICIAL
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-10">
        {/* Banner header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00b4a6]/15 border border-[#00b4a6]/30 text-[#00b4a6] font-extrabold text-xs tracking-wider uppercase mb-4">
            <span>🎉 ¡TU MATERIAL ESTÁ LISTO PARA DESCARGAR!</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
            Tus 10 Mensajes + Certificado Página Express
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Hemos generado tu paquete oficial en PDF. Incluye la guía para vender por WhatsApp y tu certificado con folio único y vigencia automática de 7 días.
          </p>
        </div>

        {/* Dynamic Certificate Preview Card matching HTML template */}
        <div className="bg-white text-gray-900 border-4 border-[#00b4a6] rounded-3xl p-6 sm:p-10 shadow-2xl mb-10 relative overflow-hidden text-center">
          {/* Top Gradient Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#0069a9] to-[#00b4a6]"></div>

          {/* Logo & Folio Top Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="text-left">
              <span className="text-2xl font-black text-[#0069a9] tracking-tight block">IDEALY</span>
              <span className="text-[10px] font-bold text-[#00b4a6] tracking-wider uppercase block">Estudio Web y Desarrollo</span>
            </div>

            <div className="bg-[#f0f6fa] text-[#4d4b4d] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-inner border border-[#0069a9]/10">
              Folio: <span className="text-[#0069a9]">{cert.folioCode}</span>
            </div>
          </div>

          {/* Seal Badge ("LISTA EN 5 DÍAS") */}
          <div className="hidden sm:flex absolute right-8 top-20 w-28 h-28 rounded-full bg-[#0069a9] border-4 border-[#00b4a6] text-white flex-col items-center justify-center font-extrabold rotate-12 shadow-xl shrink-0">
            <span className="text-[10px] tracking-wider uppercase">LISTA EN</span>
            <span className="text-xl leading-none">5 DÍAS</span>
          </div>

          {/* Kicker & Title */}
          <div className="mb-6">
            <span className="text-xs font-black tracking-widest text-[#00b4a6] block uppercase mb-1">
              CERTIFICADO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0069a9] leading-tight">
              Página Express
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#4d4b4d] mt-2">
              Otorgado a:
            </p>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1f2a30] mt-1">
              {cert.nombreNegocio}
            </h3>
            {cert.nombre && (
              <p className="text-sm font-medium text-[#4d4b4d] mt-1">
                Atn. {cert.nombre}
              </p>
            )}
          </div>

          <div className="w-64 h-[2px] bg-[#dbe8f0] mx-auto mb-6"></div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left max-w-2xl mx-auto">
            <div className="bg-[#f0f6fa] rounded-2xl p-4 flex items-center gap-4 border border-[#0069a9]/10">
              <div className="w-12 h-12 rounded-full bg-[#00b4a6] text-white font-extrabold text-xl flex items-center justify-center shrink-0">
                $
              </div>
              <div>
                <h4 className="font-extrabold text-[#0069a9] text-base leading-tight">
                  Precio congelado en $5,000 MXN + IVA
                </h4>
                <p className="text-xs text-[#4d4b4d] mt-0.5">
                  Ahorra $1,000 sobre el precio público de $6,000 MXN + IVA
                </p>
              </div>
            </div>

            <div className="bg-[#f0f6fa] rounded-2xl p-4 flex items-center gap-4 border border-[#0069a9]/10">
              <div className="w-12 h-12 rounded-full bg-[#00b4a6] text-white font-extrabold text-xl flex items-center justify-center shrink-0">
                +
              </div>
              <div>
                <h4 className="font-extrabold text-[#0069a9] text-base leading-tight">
                  1 mes de mantenimiento GRATIS
                </h4>
                <p className="text-xs text-[#4d4b4d] mt-0.5">
                  Valor $499 · cambios y soporte técnico
                </p>
              </div>
            </div>
          </div>

          {/* Footer Vigencia & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#dbe8f0]">
            <div className="text-left">
              <span className="text-xs font-semibold text-[#4d4b4d] block">Válido hasta:</span>
              <strong className="text-lg sm:text-xl font-extrabold text-[#e4572e]">
                {formatDateStr(cert.validUntil)}
              </strong>
            </div>

            <WhatsAppButton
              buttonText={`Quiero usar mi certificado ${cert.folioCode} →`}
              locationTag="descarga_card_cta"
              presetMessage={`Hola, quiero usar mi certificado ${cert.folioCode}`}
              className="py-3 px-6 rounded-full bg-[#00b4a6] hover:bg-[#009b8e] text-white font-extrabold text-sm shadow-md"
            />
          </div>
        </div>

        {/* Download & Claim Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-14">
          <a
            href={downloadUrl}
            download={`Idealy_10_Mensajes_y_Certificado_${cert.folioCode}.pdf`}
            className="flex-1 py-4 px-8 rounded-2xl bg-[#00b4a6] hover:bg-[#009b8e] text-white font-extrabold text-lg text-center shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Descargar PDF Completo ({cert.folioCode})</span>
          </a>

          <WhatsAppButton
            buttonText={`Usar Certificado ${cert.folioCode} por WhatsApp →`}
            locationTag="descarga_page_claim"
            presetMessage={`Hola, quiero usar mi certificado ${cert.folioCode}`}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#0069a9] hover:bg-[#00588f] text-white font-extrabold text-base shadow-xl text-center"
          />
        </div>

        {/* Messages Web Copy/Paste Preview Section */}
        <div className="bg-base-100/60 border border-white/10 rounded-3xl p-6 sm:p-8 mb-12">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                10 Mensajes listos para copiar y pegar
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Puedes copiarlos directamente desde aquí o ver la guía completa en tu PDF descargado.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {MESSAGES_PREVIEW.map((msg) => (
              <div
                key={msg.num}
                className="bg-base-200/80 border border-white/10 rounded-2xl p-5 hover:border-[#00b4a6]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#0069a9]/30 text-[#00b4a6]">
                    MENSAJE {msg.num}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{msg.title}</span>
                </div>
                <p className="text-sm text-gray-200 font-mono bg-black/30 p-3.5 rounded-xl border border-white/5 leading-relaxed whitespace-pre-line">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-500 pt-4">
          <p>© 2026 Idealy. Todos los derechos reservados. Puebla, México.</p>
          <Link href="/pagina-express" className="text-[#00b4a6] hover:underline mt-2 inline-block">
            ← Volver a la oferta principal de Página Express
          </Link>
        </div>
      </main>
    </div>
  );
}
