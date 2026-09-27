import { NextRequest, NextResponse } from 'next/server';

const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '522227179352';
const DEFAULT_TEXT = 'Hola, quiero mi Página Express 🚀';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customMessage = searchParams.get('text');
  const message = customMessage || DEFAULT_TEXT;
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

  return NextResponse.redirect(whatsappUrl, 307);
}
