import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId es requerido' }, { status: 400 });
    }

    const lead = await prisma.expressLead.findUnique({
      where: { id: leadId },
      include: { certificate: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const now = new Date();
    const effectiveToken = lead.token || lead.folioCode || lead.id;

    // 1. Asegurar certificado
    let certificateId = lead.certificateId;
    if (!certificateId) {
      const folioCode =
        lead.folioCode ||
        (lead.folio ? `PE-${String(lead.folio).padStart(4, '0')}` : `PE-${lead.id.slice(-4).toUpperCase()}`);

      const existingCert = await prisma.expressCertificate.findUnique({
        where: { folioCode },
      });

      if (existingCert) {
        certificateId = existingCert.id;
      } else {
        const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días
        const newCert = await prisma.expressCertificate.create({
          data: {
            folioCode,
            nombre: lead.nombre,
            nombreNegocio: lead.nombreNegocio,
            whatsapp: lead.whatsapp,
            downloadCount: 1,
            issuedAt: now,
            validUntil,
          },
        });
        certificateId = newCert.id;
      }
    } else {
      await prisma.expressCertificate.update({
        where: { id: certificateId },
        data: { downloadCount: { increment: 1 } },
      }).catch((err) => console.error('Error incrementing downloadCount:', err));
    }

    // 2. Marcar como descargado y asignar token
    const updatedLead = await prisma.expressLead.update({
      where: { id: leadId },
      data: {
        hasDownloadedCert: true,
        certDownloadedAt: lead.certDownloadedAt || now,
        token: lead.token || effectiveToken,
        certificateId,
      },
    });

    return NextResponse.json({
      success: true,
      leadId: updatedLead.id,
      folioCode: updatedLead.folioCode,
      hasDownloadedCert: updatedLead.hasDownloadedCert,
      certDownloadedAt: updatedLead.certDownloadedAt,
      token: updatedLead.token,
    });
  } catch (error) {
    console.error('Error marking cert as downloaded:', error);
    return NextResponse.json(
      { error: 'Error interno al marcar cupón como descargado' },
      { status: 500 }
    );
  }
}

