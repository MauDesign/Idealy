import { NextRequest, NextResponse } from 'next/server';

const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '522227179352';

const CHANNEL_MESSAGES: Record<string, string> = {
  encabezado: 'Hola, quiero mi Página Express 🚀',
  cierre: 'Hola, quiero apartar mi lugar de la Página Express',
  gracias: 'Hola, quiero usar mi certificado Página Express',
  google: 'Hola, vi su anuncio en Google y quiero mi página',
  estados: 'QUIERO MI PÁGINA',
  facebook: 'Hola, vi su publicación y quiero mi página',
  instagram: 'Hola, vi su publicación y quiero mi página',
  default: 'Hola, quiero mi Página Express 🚀',
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ channel: string }> }
) {
  const { channel } = await context.params;
  const channelKey = (channel || '').toLowerCase();
  const text = CHANNEL_MESSAGES[channelKey] || CHANNEL_MESSAGES.default;
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedText}`;

  return NextResponse.redirect(whatsappUrl, 307);
}
