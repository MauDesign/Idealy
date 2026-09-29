import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { generateExpressCertificatePdf } from '@/lib/pdf/generateExpressCertificatePdf';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folioParam = searchParams.get('folio') || searchParams.get('f');
    const nombreParam = searchParams.get('nombre') || searchParams.get('n') || '';
    const negocioParam = searchParams.get('negocio') || searchParams.get('b') || '';
    const leadIdParam = searchParams.get('leadId');
    const typeParam = searchParams.get('type') || searchParams.get('t');

    let certRecord = null;

    // 1. Search by existing lead if leadId provided
    if (leadIdParam) {
      const lead = await prisma.expressLead.findUnique({
        where: { id: leadIdParam },
      });
      if (lead) {
        // Search if certificate already created for this lead or by certificateId
        if (lead.certificateId) {
          certRecord = await prisma.expressCertificate.findUnique({
            where: { id: lead.certificateId },
          });
        }
        if (!certRecord) {
          certRecord = await prisma.expressCertificate.findFirst({
            where: { nombreNegocio: lead.nombreNegocio, nombre: lead.nombre },
          });
        }

        if (!certRecord) {
          // Count current certificates to assign next folio code safely
          const count = await prisma.expressCertificate.count();
          const nextFolioNum = count + 1;
          const generatedFolioCode = `PE-${String(nextFolioNum).padStart(4, '0')}`;
          const now = new Date();
          const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

          certRecord = await prisma.expressCertificate.create({
            data: {
              folioCode: generatedFolioCode,
              nombre: lead.nombre,
              nombreNegocio: lead.nombreNegocio,
              whatsapp: lead.whatsapp,
              issuedAt: now,
              validUntil: validUntil,
            },
          });
        }

        // Always update lead download tracking info
        await prisma.expressLead.update({
          where: { id: leadIdParam },
          data: {
            folio: certRecord.folio,
            folioCode: certRecord.folioCode,
            certificateId: certRecord.id,
            hasDownloadedPdf: true,
            downloadedAt: new Date(),
          },
        }).catch((err: unknown) => console.error('Error linking lead download state:', err));
      }
    }

    // 2. Search by Folio string (e.g. PE-0001 or 1)
    if (!certRecord && folioParam) {
      const cleanFolio = folioParam.toUpperCase().trim();
      const formattedFolio = cleanFolio.startsWith('PE-')
        ? cleanFolio
        : `PE-${String(cleanFolio).padStart(4, '0')}`;

      certRecord = await prisma.expressCertificate.findUnique({
        where: { folioCode: formattedFolio },
      });
    }

    // 3. If still no certRecord, create new certificate with provided params or fallback
    if (!certRecord) {
      const displayNombre = nombreParam.trim() || 'Titular del Negocio';
      const displayNegocio = negocioParam.trim() || 'Tu Negocio';

      const count = await prisma.expressCertificate.count();
      const nextFolioNum = count + 1;
      const generatedFolioCode = `PE-${String(nextFolioNum).padStart(4, '0')}`;
      const now = new Date();
      const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      certRecord = await prisma.expressCertificate.create({
        data: {
          folioCode: generatedFolioCode,
          nombre: displayNombre,
          nombreNegocio: displayNegocio,
          issuedAt: now,
          validUntil: validUntil,
        },
      });
    } else {
      // Increment download counter
      await prisma.expressCertificate.update({
        where: { id: certRecord.id },
        data: { downloadCount: { increment: 1 } },
      }).catch((e: unknown) => console.error('Error updating download count:', e));
    }

    const isInline = searchParams.get('inline') === 'true';

    // 4. Return Guide PDF if requested
    if (typeParam === 'guia' || typeParam === 'mensajes') {
      const pdfPath = path.join(
        process.cwd(),
        'public',
        'pdf',
        'Idealy-10-mensajes-para-vender-por-WhatsApp_1.pdf'
      );
      if (fs.existsSync(pdfPath)) {
        const fileBuffer = fs.readFileSync(pdfPath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `${isInline ? 'inline' : 'attachment'}; filename="Guia_10_Mensajes_WhatsApp_Idealy.pdf"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }
    }

    // 5. Return Certificate PDF (1 page)
    const pdfBytes = await generateExpressCertificatePdf({
      folioCode: certRecord.folioCode,
      nombre: certRecord.nombre,
      nombreNegocio: certRecord.nombreNegocio,
      issuedAt: certRecord.issuedAt,
      validUntil: certRecord.validUntil,
      includeGuide: false,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${isInline ? 'inline' : 'attachment'}; filename="Certificado_Pagina_Express_${certRecord.folioCode}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating PDF download:', error);
    return NextResponse.json(
      { error: 'Error al generar el PDF del certificado' },
      { status: 500 }
    );
  }
}
