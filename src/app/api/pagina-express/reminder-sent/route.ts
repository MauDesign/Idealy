import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function validateApiKey(request: NextRequest): boolean {
  const expectedKey = process.env.N8N_API_KEY || process.env.BLOG_API_KEY || 'idealy_secret_auto_key';

  const headerKey = request.headers.get('x-api-key');
  const authHeader = request.headers.get('authorization');
  const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const queryKey = request.nextUrl.searchParams.get('apiKey');

  const providedKey = headerKey || bearerKey || queryKey;
  return Boolean(providedKey && providedKey === expectedKey);
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'No autorizado. Proporciona un x-api-key válido.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { leadId, tipo } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId es requerido' }, { status: 400 });
    }

    if (!tipo || (tipo !== 'day2' && tipo !== 'day5')) {
      return NextResponse.json(
        { error: 'tipo debe ser "day2" o "day5"' },
        { status: 400 }
      );
    }

    const lead = await prisma.expressLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const now = new Date();
    const updateData: { reminder2SentAt?: Date; reminder5SentAt?: Date } = {};

    if (tipo === 'day2') {
      updateData.reminder2SentAt = now;
    } else if (tipo === 'day5') {
      updateData.reminder5SentAt = now;
    }

    const updated = await prisma.expressLead.update({
      where: { id: leadId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      leadId: updated.id,
      tipo,
      reminder2SentAt: updated.reminder2SentAt?.toISOString() || null,
      reminder5SentAt: updated.reminder5SentAt?.toISOString() || null,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error registrando recordatorio enviado:', error);
    return NextResponse.json(
      { error: 'Error interno al registrar el recordatorio' },
      { status: 500 }
    );
  }
}
