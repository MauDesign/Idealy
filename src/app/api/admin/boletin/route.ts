import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper to configure Nodemailer transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback to simulated mode if SMTP is not configured yet
  return null;
}

// Convert HTML content into clean plain text fallback for anti-spam multipart delivery
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// GET: Fetch list of campaigns, contacts, leads and overall stats
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recipients: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
            openedAt: true,
            openedCount: true,
            sentAt: true,
            errorMessage: true,
          },
        },
      },
    });

    const contacts = await prisma.contact.findMany({
      select: { email: true, name: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const leads = await prisma.expressLead.findMany({
      select: { nombre: true, whatsapp: true, nombreNegocio: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // Read local HTML template file content
    let defaultHtml = '';
    try {
      const templatePath = path.join(process.cwd(), 'public', 'templates', 'boletin_pyme_idealy.html');
      defaultHtml = fs.readFileSync(templatePath, 'utf-8');
    } catch (e) {
      console.error('Could not read default template file:', e);
    }

    // Replace image paths in HTML to ensure local/origin rendering
    const origin = req.nextUrl.origin || 'http://localhost:3000';
    if (defaultHtml) {
      defaultHtml = defaultHtml.replace(/src="https:\/\/idealy\.com\.mx\/img\//g, `src="${origin}/img/`);
    }

    // Stats summary
    const totalCampaigns = campaigns.length;
    const totalSent = campaigns.reduce((acc: number, c: { totalSent: number }) => acc + c.totalSent, 0);
    const totalOpened = campaigns.reduce((acc: number, c: { totalOpened: number }) => acc + c.totalOpened, 0);

    return NextResponse.json({
      campaigns,
      contacts,
      leadsCount: leads.length,
      defaultHtml,
      stats: {
        totalCampaigns,
        totalSent,
        totalOpened,
        openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create and dispatch a new email campaign with CCO (BCC) anti-spam protection
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      title, 
      subject, 
      preheader, 
      senderName, 
      senderEmail, 
      toAddress, 
      useBcc = true, 
      htmlContent, 
      recipientsList 
    } = body;

    if (!subject || !htmlContent || !recipientsList || !Array.isArray(recipientsList) || recipientsList.length === 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios o la lista de destinatarios está vacía' }, { status: 400 });
    }

    const cleanSenderEmail = (senderEmail || 'hello@idealy.com.mx').trim();
    const cleanSenderName = (senderName || 'Leo de Idealy').trim();
    const cleanToAddress = (toAddress || 'pymes@idealy.com.mx').trim();

    // Create Campaign record in DB
    const campaign = await prisma.emailCampaign.create({
      data: {
        title: title || subject,
        subject,
        preheader,
        senderName: cleanSenderName,
        senderEmail: cleanSenderEmail,
        htmlContent,
        status: 'SENDING',
      },
    });

    // Create Recipient entries in DB
    const createdRecipients = await Promise.all(
      recipientsList.map((rec: { email: string; name?: string }) =>
        prisma.campaignRecipient.create({
          data: {
            campaignId: campaign.id,
            email: rec.email.trim(),
            name: rec.name ? rec.name.trim() : null,
            status: 'PENDING',
          },
        })
      )
    );

    const transporter = getTransporter();
    const origin = req.nextUrl.origin || 'https://idealy.com.mx';

    // Ensure all images in HTML have absolute URLs (replacing relative /img/ with origin)
    let processedHtml = htmlContent
      .replace(/src="\/img\//g, `src="${origin}/img/`)
      .replace(/src="img\//g, `src="${origin}/img/`);

    const plainTextBody = htmlToPlainText(processedHtml);
    const recipientEmails = createdRecipients.map(r => r.email);

    let sentSuccessCount = 0;
    let failedCount = 0;

    // Dispatch Mode A: CCO (BCC) Batch Mode (Recommended for privacy and Anti-Spam compliance)
    if (useBcc) {
      const trackingPixel = `<img src="${origin}/api/email-tracker?cid=${campaign.id}&rid=${createdRecipients[0].id}" width="1" height="1" alt="" style="display:none; width:1px; height:1px; border:0;" />`;
      
      let finalHtml = processedHtml;
      if (finalHtml.includes('</body>')) {
        finalHtml = finalHtml.replace('</body>', `${trackingPixel}\n</body>`);
      } else {
        finalHtml += trackingPixel;
      }

      try {
        if (transporter) {
          await transporter.sendMail({
            from: `"${cleanSenderName}" <${cleanSenderEmail}>`,
            to: `"${cleanSenderName}" <${cleanToAddress}>`,
            bcc: recipientEmails, // Hidden recipients in CCO
            subject: subject,
            text: plainTextBody,
            html: finalHtml,
            headers: {
              'List-Unsubscribe': `<mailto:${cleanSenderEmail}?subject=BAJA>, <${origin}/privacidad>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              'Precedence': 'bulk',
              'X-Mailer': 'Idealy PyME Campaign Engine v1.0',
            },
          });
        }

        // Mark all recipients as SENT
        await prisma.campaignRecipient.updateMany({
          where: { campaignId: campaign.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        sentSuccessCount = createdRecipients.length;
      } catch (err: any) {
        console.error('Error sending CCO batch campaign:', err);
        await prisma.campaignRecipient.updateMany({
          where: { campaignId: campaign.id },
          data: {
            status: 'FAILED',
            errorMessage: err.message || 'Error al enviar por SMTP en CCO',
          },
        });
        failedCount = createdRecipients.length;
      }
    } else {
      // Dispatch Mode B: Individual dispatch per recipient
      for (const recipient of createdRecipients) {
        const trackingPixel = `<img src="${origin}/api/email-tracker?cid=${campaign.id}&rid=${recipient.id}" width="1" height="1" alt="" style="display:none; width:1px; height:1px; border:0;" />`;
        
        let finalHtml = processedHtml;
        if (finalHtml.includes('</body>')) {
          finalHtml = finalHtml.replace('</body>', `${trackingPixel}\n</body>`);
        } else {
          finalHtml += trackingPixel;
        }

        try {
          if (transporter) {
            await transporter.sendMail({
              from: `"${cleanSenderName}" <${cleanSenderEmail}>`,
              to: recipient.email,
              subject: subject,
              text: plainTextBody,
              html: finalHtml,
              headers: {
                'List-Unsubscribe': `<mailto:${cleanSenderEmail}?subject=BAJA>, <${origin}/privacidad>`,
                'Precedence': 'bulk',
                'X-Mailer': 'Idealy PyME Campaign Engine v1.0',
              },
            });
          }

          await prisma.campaignRecipient.update({
            where: { id: recipient.id },
            data: {
              status: 'SENT',
              sentAt: new Date(),
            },
          });
          sentSuccessCount++;
        } catch (err: any) {
          console.error(`Error sending email to ${recipient.email}:`, err);
          await prisma.campaignRecipient.update({
            where: { id: recipient.id },
            data: {
              status: 'FAILED',
              errorMessage: err.message || 'Error al enviar por SMTP',
            },
          });
          failedCount++;
        }
      }
    }

    // Update Campaign final status
    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        totalSent: sentSuccessCount,
        totalFailed: failedCount,
      },
      include: {
        recipients: true,
      },
    });

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      message: transporter
        ? `Campaña enviada exitosamente a ${sentSuccessCount} destinatarios ${useBcc ? 'en modo CCO (Privacidad Anti-Spam)' : 'individuales'}.`
        : `Campaña registrada en modo prueba. Se procesaron ${sentSuccessCount} destinatarios ${useBcc ? 'en modo CCO' : 'individuales'} (Configura SMTP_USER y SMTP_PASS en .env para envíos reales de producción).`,
    });
  } catch (error: any) {
    console.error('Error in campaign endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
