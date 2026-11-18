import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, tipo, customText } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId es requerido' }, { status: 400 });
    }

    if (!tipo || !['descarga', 'agenda', 'vence'].includes(tipo)) {
      return NextResponse.json(
        { error: 'tipo debe ser "descarga", "agenda" o "vence"' },
        { status: 400 }
      );
    }

    const lead = await prisma.expressLead.findUnique({
      where: { id: leadId },
      include: { certificate: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const host = request.headers.get('host') || 'www.idealy.com.mx';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    const folioCode =
      lead.folioCode ||
      lead.certificate?.folioCode ||
      (lead.folio ? `PE-${String(lead.folio).padStart(4, '0')}` : 'PE-0000');

    const effectiveToken = lead.token || folioCode || lead.id;
    const downloadUrl = `${baseUrl}/pagina-express/descarga?leadId=${lead.id}`;
    const activarUrl = `${baseUrl}/es/pagina-express/activar?token=${effectiveToken}`;

    const diffHours = (Date.now() - new Date(lead.createdAt).getTime()) / 3600000;
    const diasTranscurridos = Math.max(1, Math.floor(diffHours / 24) + 1);

    // Formatear número de teléfono (México 52)
    let cleanWa = lead.whatsapp.replace(/\D/g, '');
    if (cleanWa.length === 10) cleanWa = `52${cleanWa}`;
    else if (cleanWa.length === 13 && cleanWa.startsWith('521')) cleanWa = `52${cleanWa.substring(3)}`;

    const saludo = lead.nombre ? `Hola ${lead.nombre.trim()} 👋` : 'Hola 👋';
    const negocio = lead.nombreNegocio ? ` para ${lead.nombreNegocio}` : '';

    // Generar mensaje predeterminado si no viene personalizado
    let defaultTexto = '';
    if (tipo === 'descarga') {
      defaultTexto = `${saludo} Soy Mauricio de Idealy. Vi que aún no descargas tu guía de *10 mensajes para vender por WhatsApp* ni activas tu *Certificado Página Express* (${folioCode})${negocio}.\n\nAquí sigue tu enlace personal:\n📲 ${downloadUrl}\n\nSi tienes alguna duda, respóndeme por aquí y con gusto te ayudo.`;
    } else if (tipo === 'agenda') {
      defaultTexto = `${saludo} Tu *Certificado de $5,000 + IVA* de Página Express (${folioCode}) está activo y listo.\n\nEl siguiente paso es elegir el día y hora de tu videollamada estratégica de 20 minutos con tu asesor:\n📲 ${activarUrl}\n\nSolo te tomará 1 minuto apartar tu lugar. Quedamos a tus órdenes. 🚀`;
    } else if (tipo === 'vence') {
      defaultTexto = `${saludo} Soy Mauricio de Idealy. Tu *Certificado Página Express* (${folioCode}) con precio congelado está por vencer.\n\nSi aún te interesa, puedo *extenderte la vigencia 7 días más*. Respóndeme "Sí" a este mensaje y te lo reactivo de inmediato.`;
    }

    const textoFinal = customText?.trim() || defaultTexto;
    const linkCorrespondiente = tipo === 'descarga' ? downloadUrl : activarUrl;

    // Disparar Webhook de n8n si está configurado
    const n8nWebhookUrl =
      process.env.N8N_RECORDATORIO_MANUAL_WEBHOOK_URL ||
      process.env.N8N_RECORDATORIO_URL ||
      'https://n8n.idealy.com.mx/webhook/pagina-express-recordatorio-manual';

    const payload = {
      leadId: lead.id,
      folioCode,
      nombre: lead.nombre,
      nombreNegocio: lead.nombreNegocio,
      whatsapp: lead.whatsapp,
      numberFormatted: cleanWa,
      tipo,
      texto: textoFinal,
      link: linkCorrespondiente,
      dias: diasTranscurridos,
      horas: Number(diffHours.toFixed(1)),
      timestamp: new Date().toISOString(),
    };

    let n8nResponseOk = false;
    let n8nError: string | null = null;

    try {
      const n8nRes = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.N8N_API_KEY || 'idealy_secret_auto_key',
        },
        body: JSON.stringify(payload),
      });

      n8nResponseOk = n8nRes.ok;
      if (!n8nRes.ok) {
        n8nError = `n8n respondió con status ${n8nRes.status}`;
      }
    } catch (err: any) {
      console.warn('No se pudo conectar al webhook de n8n para recordatorio manual:', err?.message);
      n8nError = err?.message || 'Error de conexión con webhook n8n';
    }

    // Registrar en BD el envío del recordatorio
    const now = new Date();
    const updateData: any = {};
    if (tipo === 'descarga') {
      updateData.reminder2SentAt = now;
    } else if (tipo === 'vence' || tipo === 'agenda') {
      updateData.reminder5SentAt = now;
    }

    await prisma.expressLead.update({
      where: { id: lead.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      n8nSent: n8nResponseOk,
      n8nError,
      payload,
      waUrl: `https://wa.me/${cleanWa}?text=${encodeURIComponent(textoFinal)}`,
    });
  } catch (error) {
    console.error('Error enviando recordatorio manual:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar el recordatorio' },
      { status: 500 }
    );
  }
}
