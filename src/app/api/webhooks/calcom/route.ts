import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // 1. Signature Verification (HMAC-SHA256)
    const secret = process.env.CALCOM_WEBHOOK_SECRET;
    const signature = request.headers.get('x-cal-signature-256');

    if (secret) {
      if (!signature) {
        return NextResponse.json(
          { error: 'Encabezado x-cal-signature-256 faltante' },
          { status: 401 }
        );
      }

      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      const sigBuffer = Buffer.from(signature, 'utf8');
      const compBuffer = Buffer.from(computedSignature, 'utf8');

      if (
        sigBuffer.length !== compBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, compBuffer)
      ) {
        console.warn('Firma de webhook Cal.com inválida');
        return NextResponse.json(
          { error: 'Firma de webhook inválida' },
          { status: 401 }
        );
      }
    }

    // 2. Parse Payload
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de webhook JSON inválido' },
        { status: 400 }
      );
    }

    const triggerEvent = body.triggerEvent;
    const bookingPayload = body.payload || {};
    const metadata = bookingPayload.metadata || {};
    const notes = bookingPayload.notes || bookingPayload.description || '';

    // Smart Token Detection:
    // 1. Check explicit metadata fields
    let token =
      metadata.token ||
      metadata.leadId ||
      metadata.folio;

    // 2. Fallback: extract Folio pattern (e.g. PE-0045) from notes
    if (!token && typeof notes === 'string') {
      const match = notes.match(/PE-\d+/i);
      if (match) {
        token = match[0].toUpperCase();
      }
    }

    // 3. Check if it's a Diagnóstico Digital booking
    const isDiagnostico =
      metadata.diagnosticoId ||
      metadata.diagnostico_id ||
      (typeof notes === 'string' && notes.toLowerCase().includes('diagnóstico'));

    // CASO A: LEAD DE PÁGINA EXPRESS
    if (token) {
      const cleanToken = String(token).trim();
      const lead = await prisma.expressLead.findFirst({
        where: {
          OR: [
            { token: cleanToken },
            { id: cleanToken },
            { folioCode: cleanToken.toUpperCase() },
          ],
        },
      });

      if (lead) {
        let newStatus = lead.status;
        let updatedCita: any = lead.cita || {};
        let cuponCongeladoHasta: Date | null = lead.cupon_congelado_hasta;

        const startTime = bookingPayload.startTime ? new Date(bookingPayload.startTime) : null;
        const endTime = bookingPayload.endTime ? new Date(bookingPayload.endTime) : null;

        if (triggerEvent === 'BOOKING_CREATED') {
          newStatus = 'cita_agendada';
          updatedCita = {
            uid: bookingPayload.uid,
            title: bookingPayload.title || 'Entrega Página Express',
            startTime: bookingPayload.startTime,
            endTime: bookingPayload.endTime,
            status: 'ACCEPTED',
            eventTypeId: bookingPayload.eventTypeId,
            meetingUrl: bookingPayload.metadata?.videoCallUrl || null,
            scheduledAt: new Date().toISOString(),
          };

          // Congelar cupón hasta 48 horas después de la cita programada
          if (startTime) {
            cuponCongeladoHasta = new Date(startTime.getTime() + 48 * 60 * 60 * 1000);
          }
        } else if (triggerEvent === 'BOOKING_RESCHEDULED') {
          newStatus = 'cita_agendada';
          updatedCita = {
            ...(typeof updatedCita === 'object' ? updatedCita : {}),
            uid: bookingPayload.uid,
            startTime: bookingPayload.startTime,
            endTime: bookingPayload.endTime,
            rescheduledAt: new Date().toISOString(),
          };

          if (startTime) {
            cuponCongeladoHasta = new Date(startTime.getTime() + 48 * 60 * 60 * 1000);
          }
        } else if (triggerEvent === 'BOOKING_CANCELLED') {
          newStatus = 'brief_completado';
          updatedCita = {
            ...(typeof updatedCita === 'object' ? updatedCita : {}),
            cancelled: true,
            cancelledAt: new Date().toISOString(),
          };
        }

        // Actualizar Lead en PostgreSQL
        const updatedLead = await prisma.expressLead.update({
          where: { id: lead.id },
          data: {
            status: newStatus,
            cita: updatedCita,
            cupon_congelado_hasta: cuponCongeladoHasta,
          },
        });

        // Notificar al Webhook de n8n para Página Express
        const n8nExpressWebhook =
          process.env.N8N_ACTIVACION_WEBHOOK_URL ||
          process.env.N8N_LEAD_WEBHOOK_URL;

        if (n8nExpressWebhook) {
          try {
            await fetch(n8nExpressWebhook, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tipo: 'pagina_express',
                evento: `calcom_${(triggerEvent || 'evento').toLowerCase()}`,
                triggerEvent,
                leadId: updatedLead.id,
                folioCode: updatedLead.folioCode,
                nombre: updatedLead.nombre,
                whatsapp: updatedLead.whatsapp,
                nombreNegocio: updatedLead.nombreNegocio,
                status: updatedLead.status,
                cita: updatedLead.cita,
                cupon_congelado_hasta: updatedLead.cupon_congelado_hasta,
                timestamp: new Date().toISOString(),
              }),
            });
          } catch (n8nErr) {
            console.error('Error notificando a n8n evento Cal.com Página Express:', n8nErr);
          }
        }

        return NextResponse.json({
          received: true,
          canal: 'pagina_express',
          leadId: updatedLead.id,
          status: updatedLead.status,
        });
      }
    }

    // CASO B: CITA DE DIAGNÓSTICO DIGITAL
    if (isDiagnostico) {
      const n8nDiagWebhook = process.env.N8N_DIAGNOSTICO_URL;
      if (n8nDiagWebhook) {
        try {
          await fetch(n8nDiagWebhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-webhook-secret': process.env.N8N_DIAGNOSTICO_SECRET || '',
            },
            body: JSON.stringify({
              tipo: 'diagnostico_digital',
              evento: `calcom_${(triggerEvent || 'evento').toLowerCase()}`,
              triggerEvent,
              booking: bookingPayload,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (diagErr) {
          console.error('Error notificando a n8n evento Cal.com Diagnóstico:', diagErr);
        }
      }

      return NextResponse.json({
        received: true,
        canal: 'diagnostico_digital',
      });
    }

    // Evento genérico registrado
    return NextResponse.json({
      received: true,
      message: 'Evento de Cal.com procesado sin vinculación específica',
    });
  } catch (error) {
    console.error('Error procesando webhook Cal.com:', error);
    return NextResponse.json(
      { error: 'Error interno en webhook de Cal.com' },
      { status: 500 }
    );
  }
}
