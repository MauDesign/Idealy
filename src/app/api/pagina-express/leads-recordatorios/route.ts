import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Validador de API Key para n8n
function validateApiKey(request: NextRequest): boolean {
  const expectedKey = process.env.N8N_API_KEY || process.env.BLOG_API_KEY || 'idealy_secret_auto_key';

  const headerKey = request.headers.get('x-api-key');
  const authHeader = request.headers.get('authorization');
  const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const queryKey = request.nextUrl.searchParams.get('apiKey');

  const providedKey = headerKey || bearerKey || queryKey;
  return Boolean(providedKey && providedKey === expectedKey);
}

export async function GET(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'No autorizado. Proporciona un x-api-key válido.' },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const daysParam = parseInt(searchParams.get('days') || '14', 10);
    const days = isNaN(daysParam) || daysParam <= 0 ? 14 : daysParam;

    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const leads = await prisma.expressLead.findMany({
      where: {
        createdAt: {
          gte: cutoffDate,
        },
      },
      include: {
        certificate: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const host = request.headers.get('host') || 'www.idealy.com.mx';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    const mappedLeads = leads.map((l) => {
      const folioCode =
        l.folioCode ||
        l.certificate?.folioCode ||
        (l.folio ? `PE-${String(l.folio).padStart(4, '0')}` : 'PE-0000');

      const token = l.token || folioCode || l.id;

      const couponUsed = Boolean(
        l.isRedeemed ||
          l.status === 'cita_agendada' ||
          l.status === 'brief_completado' ||
          Boolean(l.cita) ||
          Boolean(l.brief)
      );

      return {
        leadId: l.id,
        folioCode,
        nombre: l.nombre,
        nombreNegocio: l.nombreNegocio,
        whatsapp: l.whatsapp,
        createdAt: l.createdAt.toISOString(),
        downloadUrl: `${baseUrl}/pagina-express/descarga?leadId=${l.id}`,
        activarUrl: `${baseUrl}/es/pagina-express/activar?token=${token}`,
        pdfDownloaded: Boolean(l.hasDownloadedPdf),
        certificateDownloaded: Boolean(l.hasDownloadedCert),
        couponUsed,
        reminder2SentAt: l.reminder2SentAt ? l.reminder2SentAt.toISOString() : null,
        reminder5SentAt: l.reminder5SentAt ? l.reminder5SentAt.toISOString() : null,
        status: l.status,
      };
    });

    return NextResponse.json({
      success: true,
      count: mappedLeads.length,
      leads: mappedLeads,
    });
  } catch (error) {
    console.error('Error al consultar leads para recordatorios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al consultar recordatorios' },
      { status: 500 }
    );
  }
}
