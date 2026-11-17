import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

function formatSpanishDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Mexico_City',
    }).format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

function normalizePhone(raw: string): string {
  const clean = (raw || '').replace(/\D/g, '');
  if (clean.length === 10) return `52${clean}`;
  if (clean.length === 13 && clean.startsWith('521')) return `52${clean.substring(3)}`;
  if (clean.length === 12 && clean.startsWith('52')) return clean;
  if (clean.length === 11 && clean.startsWith('1')) return `52${clean.substring(1)}`;
  return clean.startsWith('52') ? clean : `52${clean}`;
}

function isAuthorized(req: NextRequest, session: any): boolean {
  if (session?.user) return true;

  const validKeys = [
    process.env.BLOG_API_KEY,
    process.env.N8N_DIAGNOSTICO_SECRET,
    process.env.ADMIN_PASSWORD,
    process.env.EXPRESS_API_KEY,
  ].filter(Boolean);

  const authHeader = req.headers.get('authorization') || '';
  const apiKeyHeader = req.headers.get('x-api-key') || '';
  const searchParams = req.nextUrl.searchParams;
  const queryKey =
    searchParams.get('key') ||
    searchParams.get('apiKey') ||
    searchParams.get('secret') ||
    '';

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  for (const valid of validKeys) {
    if (valid && (token === valid || apiKeyHeader === valid || queryKey === valid)) {
      return true;
    }
  }

  // Permitir en local si no hay claves configuradas
  if (process.env.NODE_ENV === 'development' && validKeys.length === 0) {
    return true;
  }

  return false;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAuthorized(req, session)) {
      return NextResponse.json(
        {
          error:
            'No autorizado. Proporciona x-api-key en los headers, Bearer token o el parámetro ?key=...',
        },
        { status: 401 }
      );
    }

    const { searchParams } = req.nextUrl;
    const downloadedFilter = searchParams.get('downloaded'); // 'both' | 'any' | 'none' | 'guia' | 'cert' | 'all'
    const reminderFilter = searchParams.get('reminder'); // 'r1' | 'r2' | 'all'
    const redeemedFilter = searchParams.get('redeemed'); // 'true' | 'false'
    const searchQuery = searchParams.get('q') || searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const skip = (page - 1) * limit;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'https://www.idealy.com.mx';

    // Obtener todos los leads con su certificado para procesar métricas y recordatorios
    const leads = await prisma.expressLead.findMany({
      include: {
        certificate: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const now = new Date();

    // Mapear cada lead con su estado de descarga y cálculo de recordatorio
    const mappedLeads = leads.map((lead) => {
      const createdAt = new Date(lead.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();
      const daysSinceCreation = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const certValidUntil = lead.certificate?.validUntil
        ? new Date(lead.certificate.validUntil)
        : new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

      const isExpired = now > certValidUntil;
      const daysRemaining = Math.max(
        0,
        Math.ceil((certValidUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      );

      const hasDownloadedGuia = Boolean(lead.hasDownloadedPdf);
      const hasDownloadedCert = Boolean(lead.hasDownloadedCert);
      const hasDownloadedBoth = hasDownloadedGuia && hasDownloadedCert;
      const hasDownloadedAny = hasDownloadedGuia || hasDownloadedCert;
      const hasDownloadedNone = !hasDownloadedGuia && !hasDownloadedCert;

      const isRedeemed = Boolean(lead.isRedeemed);

      const personalDownloadUrl = `${baseUrl}/pagina-express/descarga?leadId=${lead.id}`;
      const fechaExactaCert = formatSpanishDate(certValidUntil);

      // Fecha prórroga para R2 (+7 días desde la fecha actual de vencimiento)
      const prorogaDate = new Date(
        certValidUntil.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      const fechaProroga = formatSpanishDate(prorogaDate);

      // Criterios de recordatorios según el reporte de Página Express:
      // R1: Día 2 sin descargar la guía ni el certificado, sin compra
      const eligibleForR1 =
        daysSinceCreation >= 2 &&
        daysSinceCreation < 5 &&
        hasDownloadedNone &&
        !isRedeemed;

      // R2: Día 5 desde el registro, sin compra ni redención
      const eligibleForR2 = daysSinceCreation >= 5 && !isRedeemed && !isExpired;

      let reminderStage: 'R1' | 'R2' | 'COMPLETED' | 'PURCHASED' | 'EXPIRED' | 'PENDING' =
        'PENDING';
      let reminderMessage = '';

      if (isRedeemed) {
        reminderStage = 'PURCHASED';
      } else if (isExpired) {
        reminderStage = 'EXPIRED';
      } else if (eligibleForR1) {
        reminderStage = 'R1';
        reminderMessage = `Hola ${lead.nombre}, tu guía y tu certificado siguen disponibles aquí: ${personalDownloadUrl}. El certificado vale hasta el ${fechaExactaCert}. Si ya no te interesa, dímelo y no te escribimos más.`;
      } else if (eligibleForR2) {
        reminderStage = 'R2';
        reminderMessage = `Hola ${lead.nombre}, tu certificado ${lead.folioCode || 'de Página Express'} vence el ${fechaExactaCert}. Si te interesa y necesitas más tiempo, responde SÍ y lo extendemos 7 días más, hasta el ${fechaProroga}, por única vez.`;
      } else if (hasDownloadedBoth) {
        reminderStage = 'COMPLETED';
      }

      return {
        id: lead.id,
        folio: lead.folio,
        folioCode: lead.folioCode,
        nombre: lead.nombre,
        whatsapp: lead.whatsapp,
        whatsappFormatted: normalizePhone(lead.whatsapp),
        nombreNegocio: lead.nombreNegocio || '',
        createdAt: lead.createdAt,
        daysSinceCreation,
        downloads: {
          hasDownloadedGuia,
          guiaDownloadedAt: lead.downloadedAt,
          hasDownloadedCert,
          certDownloadedAt: lead.certDownloadedAt,
          hasDownloadedBoth,
          hasDownloadedAny,
          hasDownloadedNone,
        },
        certificate: {
          folioCode: lead.certificate?.folioCode || lead.folioCode,
          issuedAt: lead.certificate?.issuedAt || lead.createdAt,
          validUntil: certValidUntil,
          validUntilFormatted: fechaExactaCert,
          isExpired,
          daysRemaining,
          isRedeemed,
          redeemedAt: lead.redeemedAt,
          downloadCount: lead.certificate?.downloadCount ?? 0,
        },
        urls: {
          personalDownloadUrl,
          guiaDirectPdfUrl: `${baseUrl}/api/pagina-express/descargar-pdf?type=guia&leadId=${lead.id}`,
          certDirectPdfUrl: `${baseUrl}/api/pagina-express/descargar-pdf?type=certificado&leadId=${lead.id}`,
        },
        reminder: {
          stage: reminderStage,
          eligibleForR1,
          eligibleForR2,
          messageText: reminderMessage,
        },
      };
    });

    // Métricas globales
    const totalLeads = mappedLeads.length;
    const downloadedBothCount = mappedLeads.filter(
      (l) => l.downloads.hasDownloadedBoth
    ).length;
    const downloadedGuiaCount = mappedLeads.filter(
      (l) => l.downloads.hasDownloadedGuia
    ).length;
    const downloadedCertCount = mappedLeads.filter(
      (l) => l.downloads.hasDownloadedCert
    ).length;
    const downloadedNoneCount = mappedLeads.filter(
      (l) => l.downloads.hasDownloadedNone
    ).length;
    const redeemedCount = mappedLeads.filter(
      (l) => l.certificate.isRedeemed
    ).length;
    const eligibleForR1Count = mappedLeads.filter(
      (l) => l.reminder.eligibleForR1
    ).length;
    const eligibleForR2Count = mappedLeads.filter(
      (l) => l.reminder.eligibleForR2
    ).length;

    // Aplicar filtros
    let filtered = mappedLeads;

    // Filtro por descargas
    if (downloadedFilter === 'both' || downloadedFilter === 'true') {
      filtered = filtered.filter((l) => l.downloads.hasDownloadedBoth);
    } else if (downloadedFilter === 'any') {
      filtered = filtered.filter((l) => l.downloads.hasDownloadedAny);
    } else if (downloadedFilter === 'none' || downloadedFilter === 'false') {
      filtered = filtered.filter((l) => l.downloads.hasDownloadedNone);
    } else if (downloadedFilter === 'guia') {
      filtered = filtered.filter((l) => l.downloads.hasDownloadedGuia);
    } else if (downloadedFilter === 'cert') {
      filtered = filtered.filter((l) => l.downloads.hasDownloadedCert);
    }

    // Filtro por recordatorio
    if (reminderFilter === 'r1') {
      filtered = filtered.filter((l) => l.reminder.eligibleForR1);
    } else if (reminderFilter === 'r2') {
      filtered = filtered.filter((l) => l.reminder.eligibleForR2);
    }

    // Filtro por redención / compra
    if (redeemedFilter === 'true') {
      filtered = filtered.filter((l) => l.certificate.isRedeemed);
    } else if (redeemedFilter === 'false') {
      filtered = filtered.filter((l) => !l.certificate.isRedeemed);
    }

    // Búsqueda por texto
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.nombreNegocio.toLowerCase().includes(q) ||
          l.whatsapp.includes(q) ||
          (l.folioCode && l.folioCode.toLowerCase().includes(q))
      );
    }

    const filteredTotal = filtered.length;
    const paginatedLeads = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      summary: {
        totalLeads,
        downloadedGuiaCount,
        downloadedCertCount,
        downloadedBothCount,
        downloadedNoneCount,
        redeemedCount,
        eligibleForR1Count,
        eligibleForR2Count,
      },
      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages: Math.ceil(filteredTotal / limit) || 1,
      },
      leads: paginatedLeads,
    });
  } catch (error) {
    console.error('Error al consultar leads para recordatorios:', error);
    return NextResponse.json(
      { error: 'Error al procesar la consulta de leads' },
      { status: 500 }
    );
  }
}
