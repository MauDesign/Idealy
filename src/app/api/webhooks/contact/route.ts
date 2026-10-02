import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requiere name, email y message.' },
        { status: 400 }
      );
    }

    const contactRecord = await prisma.contact.create({
      data: {
        name,
        email,
        whatsapp: whatsapp || null,
        subject: subject || 'Contacto vía Webhook',
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook de contacto recibido y procesado con éxito',
        contactId: contactRecord.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al recibir webhook de contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el webhook' },
      { status: 500 }
    );
  }
}
