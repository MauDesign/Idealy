import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, whatsapp = '', subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Nombre, email y mensaje son campos requeridos.' },
        { status: 400 }
      );
    }

    const cleanSubject = subject || 'Mensaje de contacto sin asunto';
    const cleanWhatsapp = (whatsapp || '').replace(/\D/g, '');
    let numberFormatted = cleanWhatsapp;
    if (cleanWhatsapp.length === 10) {
      numberFormatted = `52${cleanWhatsapp}`;
    } else if (!cleanWhatsapp.startsWith('52') && cleanWhatsapp.length > 0) {
      numberFormatted = `52${cleanWhatsapp}`;
    }

    // 1. Guardar contacto en la Base de Datos Postgres mediante Prisma
    const contactRecord = await prisma.contact.create({
      data: {
        name,
        email,
        whatsapp: whatsapp || null,
        subject: cleanSubject,
        message,
      },
    });

    // 2. Disparar Webhook de notificación de contacto si está configurado
    const webhookUrl =
      process.env.CONTACT_WEBHOOK_URL || process.env.N8N_CONTACT_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'contact.created',
            contactId: contactRecord.id,
            id: contactRecord.id,
            name: contactRecord.name,
            email: contactRecord.email,
            whatsapp: contactRecord.whatsapp,
            whatsappClean: cleanWhatsapp,
            numberFormatted,
            subject: contactRecord.subject,
            message: contactRecord.message,
            createdAt: contactRecord.createdAt,
            source: 'website_home_contact_form',
          }),
        });
      } catch (webhookError) {
        console.error('Error al enviar el webhook de contacto:', webhookError);
      }
    }

    // 3. Notificación vía Correo Electrónico (SMTP)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"Idealy Contacto" <${process.env.SMTP_USER}>`,
          replyTo: email,
          to: process.env.CONTACT_NOTIFICATION_EMAIL || 'admin@idealy.com.mx',
          subject: `Nuevo mensaje de contacto de ${name}: ${cleanSubject}`,
          text: `ID Contacto: ${contactRecord.id}\nNombre: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nAsunto: ${cleanSubject}\n\nMensaje:\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #00b4a6; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0069a9; color: #ffffff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">📩 Nuevo Mensaje de Contacto</h2>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Recibido desde el formulario principal de idea.ly</p>
              </div>
              <div style="padding: 20px; background-color: #ffffff; color: #333333;">
                <p><strong>ID Contacto:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${contactRecord.id}</code></p>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${
                  whatsapp
                    ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${numberFormatted}" style="color: #25d366; font-weight: bold;">+${numberFormatted}</a> (${whatsapp})</p>`
                    : ''
                }
                <p><strong>Asunto:</strong> ${cleanSubject}</p>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
                <p><strong>Mensaje:</strong></p>
                <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 6px;">${message}</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error al enviar correo de notificación:', emailError);
      }
    }

    return NextResponse.json(
      {
        message: 'Mensaje enviado y guardado con éxito',
        contactId: contactRecord.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error procesando el contacto:', error);
    return NextResponse.json({ message: 'Error al enviar el mensaje' }, { status: 500 });
  }
}
