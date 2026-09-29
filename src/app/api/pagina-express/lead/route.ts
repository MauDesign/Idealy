import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre = '',
      whatsapp = '',
      nombreNegocio = '',
      dedicacion = 'No especificado',
      tienePagina = 'No especificado',
      urgencia = 'No especificado',
      socialLink = '',
      utm = {},
    } = body;

    const now = new Date();
    const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1. SEQUENTIAL STEP: Save Certificate to Postgres first
    const tempFolioCode = `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const certRecord = await prisma.expressCertificate.create({
      data: {
        folioCode: tempFolioCode,
        nombre,
        nombreNegocio,
        whatsapp,
        issuedAt: now,
        validUntil,
      },
    });

    // 2. Format the real unique folio code from Postgres autoincremented `certRecord.folio`
    const realFolioCode = `PE-${String(certRecord.folio).padStart(4, '0')}`;

    const updatedCert = await prisma.expressCertificate.update({
      where: { id: certRecord.id },
      data: { folioCode: realFolioCode },
    });

    // 3. Save Lead in Postgres linked to certificate
    const leadRecord = await prisma.expressLead.create({
      data: {
        folio: updatedCert.folio,
        folioCode: updatedCert.folioCode,
        certificateId: updatedCert.id,
        nombre,
        whatsapp,
        nombreNegocio,
        dedicacion,
        tienePagina,
        urgencia,
        prioridad: urgencia.toLowerCase().includes('semana') ? 'ALTA' : 'MEDIA',
        socialLink,
        utmSource: utm.source || null,
        utmMedium: utm.medium || null,
        utmCampaign: utm.campaign || null,
        gclid: utm.gclid || null,
      },
    });

    // Extract exact saved values from database records
    const leadId = leadRecord.id;
    const folioCode = updatedCert.folioCode;
    const folioNumber = updatedCert.folio;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.idealy.com.mx';
    const personalDownloadUrl = `${baseUrl}/pagina-express/descarga?leadId=${leadId}`;

    // 4. Send Email Notification
    const mailOptions = {
      from: `"Página Express Leads" <${process.env.SMTP_USER || 'admin@idealy.com.mx'}>`,
      replyTo: 'hello@idealy.com.mx',
      to: process.env.LEAD_NOTIFICATION_EMAIL || 'admin@idealy.com.mx',
      subject: `🚀 NUEVO LEAD Página Express (${folioCode}): ${nombreNegocio} (${nombre})`,
      text: `NUEVO LEAD DE PÁGINA EXPRESS
Folio: ${folioCode}
Lead ID: ${leadId}
Nombre: ${nombre}
WhatsApp: ${whatsapp}
Negocio: ${nombreNegocio}
Giro / Dedicación: ${dedicacion}
Página actual: ${tienePagina}
Urgencia: ${urgencia}
Redes: ${socialLink}
UTM Source: ${utm.source || '-'}
UTM Campaign: ${utm.campaign || '-'}
GCLID: ${utm.gclid || '-'}
`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #00b4a6; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0069a9; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 22px;">🚀 Nuevo Lead — Página Express (${folioCode})</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Recibido desde idealy.com.mx/pagina-express</p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff; color: #333333;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px;">Folio:</td>
                <td style="padding: 8px 0;"><strong style="color: #0069a9;">${folioCode}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Lead ID:</td>
                <td style="padding: 8px 0;"><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${leadId}</code></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Nombre:</td>
                <td style="padding: 8px 0;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">WhatsApp:</td>
                <td style="padding: 8px 0;"><a href="https://wa.me/52${whatsapp.replace(/\D/g, '')}" style="color: #00b4a6; font-weight: bold; text-decoration: none;">+52 ${whatsapp}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Negocio:</td>
                <td style="padding: 8px 0;">${nombreNegocio}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Giro:</td>
                <td style="padding: 8px 0;"><span style="background-color: #e6f7f5; color: #008075; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${dedicacion}</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Página actual:</td>
                <td style="padding: 8px 0;">${tienePagina}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Urgencia:</td>
                <td style="padding: 8px 0;"><strong style="color: ${urgencia.includes('semana') ? '#d97706' : '#2563eb'};">${urgencia}</strong></td>
              </tr>
              ${socialLink ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Redes:</td>
                <td style="padding: 8px 0;"><a href="${socialLink}" target="_blank">${socialLink}</a></td>
              </tr>
              ` : ''}
            </table>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            
            <h4 style="margin: 0 0 10px 0; color: #0069a9;">Detalles de atribución (UTM):</h4>
            <div style="background-color: #f8fafc; padding: 10px; border-radius: 6px; font-size: 13px; color: #475569;">
              <p style="margin: 3px 0;"><strong>Source:</strong> ${utm.source || 'Direct'}</p>
              <p style="margin: 3px 0;"><strong>Medium:</strong> ${utm.medium || '-'}</p>
              <p style="margin: 3px 0;"><strong>Campaign:</strong> ${utm.campaign || '-'}</p>
              <p style="margin: 3px 0;"><strong>GCLID:</strong> ${utm.gclid || '-'}</p>
              <p style="margin: 3px 0;"><strong>Referer:</strong> ${utm.referer || '-'}</p>
            </div>
          </div>
        </div>
      `,
    };

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

        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error('Error sending email notification:', mailErr);
      }
    }

    // 5. Optional Evolution API direct WhatsApp dispatch
    if (process.env.EVOLUTION_API_URL && process.env.EVOLUTION_API_KEY && process.env.EVOLUTION_INSTANCE_NAME) {
      try {
        const cleanNumber = whatsapp.replace(/\D/g, '');
        const targetNumber = cleanNumber.startsWith('52') ? cleanNumber : `52${cleanNumber}`;
        const autoText = `Hola ${nombre}, soy Mauricio de Idealy. Ya recibimos los datos de *${nombreNegocio}*. Aquí tienes tu enlace personal para descargar tus 10 Mensajes y activar tu Certificado Página Express (${folioCode}) con $5,000 congelados + 1 mes de mantenimiento gratis:\n\n${personalDownloadUrl}`;

        await fetch(
          `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.EVOLUTION_API_KEY,
            },
            body: JSON.stringify({
              number: targetNumber,
              options: {
                delay: 1200,
                presence: 'composing',
              },
              textMessage: {
                text: autoText,
              },
            }),
          }
        );
      } catch (evoErr) {
        console.error('Evolution API dispatch error:', evoErr);
      }
    }

    // 6. DISPATCH TO WEBHOOK (N8N) WITH SAVED DB VALUES & PRE-FORMATTED PHONE
    if (process.env.N8N_LEAD_WEBHOOK_URL) {
      try {
        const cleanWhatsapp = (whatsapp || '').replace(/\D/g, '');
        let numberFormatted = cleanWhatsapp;

        if (cleanWhatsapp.length === 10) {
          numberFormatted = `52${cleanWhatsapp}`;
        } else if (cleanWhatsapp.length === 13 && cleanWhatsapp.startsWith('521')) {
          numberFormatted = `52${cleanWhatsapp.substring(3)}`;
        } else if (cleanWhatsapp.length === 11 && cleanWhatsapp.startsWith('1')) {
          numberFormatted = `52${cleanWhatsapp.substring(1)}`;
        } else if (!cleanWhatsapp.startsWith('52') && cleanWhatsapp.length > 0) {
          numberFormatted = `52${cleanWhatsapp}`;
        }

        await fetch(process.env.N8N_LEAD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...body,
            leadId,
            lead_id: leadId,
            id: leadId,
            folioCode,
            folio: folioCode,
            folioNum: folioNumber,
            downloadUrl: personalDownloadUrl,
            personalDownloadUrl,
            whatsappClean: cleanWhatsapp,
            numberFormatted,
          }),
        });
      } catch (webhookErr) {
        console.error('N8N webhook dispatch error:', webhookErr);
      }
    }

    const redirectUrl = `/pagina-express/gracias?nombre=${encodeURIComponent(nombre)}&leadId=${encodeURIComponent(leadId)}`;

    return NextResponse.json(
      {
        success: true,
        leadId,
        folioCode,
        downloadUrl: personalDownloadUrl,
        redirectUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Error al procesar el formulario' },
      { status: 500 }
    );
  }
}
