import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { briefSchema } from '@/lib/pagina-express/brief-schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, brief } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'El parámetro token es requerido.' },
        { status: 400 }
      );
    }

    // 1. Honeypot check
    if (brief?.website_hp && String(brief.website_hp).trim() !== '') {
      return NextResponse.json(
        { error: 'Validación anti-bot fallida.' },
        { status: 400 }
      );
    }

    // 2. Validate brief with Zod
    const validation = briefSchema.safeParse(brief);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos del brief inválidos.',
          details: validation.error.flatten(),
        },
        { status: 422 }
      );
    }

    const cleanToken = token.trim();

    // 3. Find lead by token, id or folioCode
    const lead = await prisma.expressLead.findFirst({
      where: {
        OR: [
          { token: cleanToken },
          { id: cleanToken },
          { folioCode: cleanToken.toUpperCase() },
        ],
      },
      include: {
        certificate: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'No se encontró el cupón o el enlace ha caducado.' },
        { status: 404 }
      );
    }

    // 4. Update lead with brief and status
    const dedicacionGiro =
      validation.data.giro === 'Otro' && validation.data.giro_otro
        ? validation.data.giro_otro
        : validation.data.giro;

    const updatedLead = await prisma.expressLead.update({
      where: { id: lead.id },
      data: {
        brief: validation.data as any,
        status: 'brief_completado',
        nombreNegocio: validation.data.negocio_nombre || lead.nombreNegocio,
        dedicacion: dedicacionGiro || lead.dedicacion,
      },
    });

    // 5. Notify n8n if webhook URL is configured
    const n8nWebhookUrl =
      process.env.N8N_ACTIVACION_WEBHOOK_URL ||
      process.env.N8N_LEAD_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            evento: 'brief_completado',
            leadId: updatedLead.id,
            folioCode: updatedLead.folioCode,
            nombre: updatedLead.nombre,
            whatsapp: updatedLead.whatsapp,
            nombreNegocio: updatedLead.nombreNegocio,
            dedicacion: updatedLead.dedicacion,
            status: updatedLead.status,
            brief: validation.data,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.error('Error notificando a n8n brief_completado:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: updatedLead.id,
      status: updatedLead.status,
      folioCode: updatedLead.folioCode,
    });
  } catch (error) {
    console.error('Error en endpoint POST /api/pagina-express/brief:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el brief.' },
      { status: 500 }
    );
  }
}

