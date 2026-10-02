import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, isRedeemed } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId es requerido' }, { status: 400 });
    }

    const lead = await prisma.expressLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const nextState = typeof isRedeemed === 'boolean' ? isRedeemed : !lead.isRedeemed;
    const now = nextState ? new Date() : null;

    const updatedLead = await prisma.expressLead.update({
      where: { id: leadId },
      data: {
        isRedeemed: nextState,
        redeemedAt: now,
      },
    });

    if (lead.certificateId) {
      await prisma.expressCertificate.update({
        where: { id: lead.certificateId },
        data: {
          isRedeemed: nextState,
          redeemedAt: now,
        },
      }).catch((err: unknown) => console.error('Error updating certificate redeem state:', err));
    }

    return NextResponse.json({
      success: true,
      leadId: updatedLead.id,
      isRedeemed: updatedLead.isRedeemed,
      redeemedAt: updatedLead.redeemedAt,
    });
  } catch (error) {
    console.error('Error updating redemption status:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar el estado del certificado' },
      { status: 500 }
    );
  }
}
