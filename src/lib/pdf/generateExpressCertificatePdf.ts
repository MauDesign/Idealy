import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

interface CertificateData {
  folioCode: string;
  nombre: string;
  nombreNegocio: string;
  issuedAt?: Date;
  validUntil?: Date;
  includeGuide?: boolean;
}

export async function generateExpressCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Embed standard fonts
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Palette definition matching HTML Template (certificado_base_pagina_express.html)
  const colorOuterBg = rgb(0.0, 0.412, 0.663);   // #0069a9 (Blue)
  const colorCardBg = rgb(1, 1, 1);              // #ffffff (White)
  const colorBorderTeal = rgb(0.0, 0.706, 0.651); // #00b4a6 (Teal)
  const colorTextDark = rgb(0.12, 0.16, 0.19);   // #1f2a30
  const colorTextGray = rgb(0.30, 0.29, 0.30);   // #4d4b4d
  const colorBrandBlue = rgb(0.0, 0.412, 0.663);  // #0069a9
  const colorCardGray = rgb(0.94, 0.96, 0.98);   // #f0f6fa
  const colorOrangeVig = rgb(0.89, 0.34, 0.18);  // #e4572e
  const colorWhite = rgb(1, 1, 1);

  const issuedDate = data.issuedAt || new Date();
  const validUntilDate = data.validUntil || new Date(issuedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // ==========================================
  // PAGE 1: CERTIFICADO (LANDSCAPE LETTER: 792 x 612)
  // ==========================================
  const page1 = pdfDoc.addPage([792, 612]);
  const { width, height } = page1.getSize();

  // Outer Blue Background
  page1.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: colorOuterBg,
  });

  // Inner White Card Container
  const cardMargin = 20;
  const cardW = width - cardMargin * 2;
  const cardH = height - cardMargin * 2;
  page1.drawRectangle({
    x: cardMargin,
    y: cardMargin,
    width: cardW,
    height: cardH,
    color: colorCardBg,
  });

  // Inner Teal Border
  const innerMargin = 30;
  page1.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: width - innerMargin * 2,
    height: height - innerMargin * 2,
    borderColor: colorBorderTeal,
    borderWidth: 2.5,
  });

  // Top Ribbon Bar
  page1.drawRectangle({
    x: cardMargin,
    y: height - cardMargin - 8,
    width: cardW,
    height: 8,
    color: colorBorderTeal,
  });

  // Header Brand Logo text
  page1.drawText('IDEALY', {
    x: 45,
    y: height - 55,
    size: 22,
    font: fontHelveticaBold,
    color: colorBrandBlue,
  });

  page1.drawText('ESTUDIO WEB Y DESARROLLO', {
    x: 45,
    y: height - 68,
    size: 8,
    font: fontHelvetica,
    color: colorBorderTeal,
  });

  // Folio Badge Top Right
  const folioStr = `Folio ${data.folioCode}`;
  page1.drawRectangle({
    x: width - 180,
    y: height - 60,
    width: 135,
    height: 25,
    color: colorCardGray,
  });

  page1.drawText(folioStr, {
    x: width - 165,
    y: height - 48,
    size: 11,
    font: fontHelveticaBold,
    color: colorTextGray,
  });

  // Seal Circle Top Right ("LISTA EN 5 DÍAS")
  page1.drawCircle({
    x: width - 85,
    y: height - 130,
    size: 42,
    color: colorBrandBlue,
    borderColor: colorBorderTeal,
    borderWidth: 4,
  });

  page1.drawText('LISTA EN', {
    x: width - 108,
    y: height - 122,
    size: 9,
    font: fontHelveticaBold,
    color: colorWhite,
  });

  page1.drawText('5 DÍAS', {
    x: width - 110,
    y: height - 138,
    size: 14,
    font: fontHelveticaBold,
    color: colorWhite,
  });

  // Kicker
  const kickerY = height - 105;
  page1.drawText('CERTIFICADO', {
    x: width / 2 - 60,
    y: kickerY,
    size: 14,
    font: fontHelveticaBold,
    color: colorBorderTeal,
  });

  // Title "Página Express"
  page1.drawText('Página Express', {
    x: width / 2 - 135,
    y: kickerY - 45,
    size: 42,
    font: fontHelveticaBold,
    color: colorBrandBlue,
  });

  // "Otorgado a"
  page1.drawText('Otorgado a', {
    x: width / 2 - 32,
    y: kickerY - 70,
    size: 13,
    font: fontHelvetica,
    color: colorTextGray,
  });

  // Negocio Name
  const displayBusiness = (data.nombreNegocio || 'Tu Negocio').toUpperCase();
  const negocioFontSize = displayBusiness.length > 25 ? 20 : 26;
  const negocioX = width / 2 - (displayBusiness.length * (negocioFontSize * 0.28));
  page1.drawText(displayBusiness, {
    x: Math.max(50, negocioX),
    y: kickerY - 105,
    size: negocioFontSize,
    font: fontHelveticaBold,
    color: colorTextDark,
  });

  // Owner Name
  const displayOwner = data.nombre ? `Atn. ${data.nombre}` : '';
  if (displayOwner) {
    page1.drawText(displayOwner, {
      x: width / 2 - (displayOwner.length * 3.5),
      y: kickerY - 125,
      size: 13,
      font: fontHelvetica,
      color: colorTextGray,
    });
  }

  // Divider Line
  page1.drawRectangle({
    x: width / 2 - 140,
    y: kickerY - 142,
    width: 280,
    height: 1.5,
    color: rgb(0.85, 0.90, 0.94),
  });

  // Benefit Box 1
  const benY = kickerY - 215;
  const benW = 320;
  const benH = 60;
  
  page1.drawRectangle({
    x: width / 2 - benW - 12,
    y: benY,
    width: benW,
    height: benH,
    color: colorCardGray,
  });

  page1.drawCircle({
    x: width / 2 - benW + 15,
    y: benY + 30,
    size: 16,
    color: colorBorderTeal,
  });

  page1.drawText('$', {
    x: width / 2 - benW + 11,
    y: benY + 23,
    size: 16,
    font: fontHelveticaBold,
    color: colorWhite,
  });

  page1.drawText('Precio congelado en $5,000 + IVA', {
    x: width / 2 - benW + 40,
    y: benY + 36,
    size: 12,
    font: fontHelveticaBold,
    color: colorBrandBlue,
  });

  page1.drawText('Ahorra $1,000 sobre precio público ($6,000 + IVA)', {
    x: width / 2 - benW + 40,
    y: benY + 18,
    size: 9,
    font: fontHelvetica,
    color: colorTextGray,
  });

  // Benefit Box 2
  page1.drawRectangle({
    x: width / 2 + 12,
    y: benY,
    width: benW,
    height: benH,
    color: colorCardGray,
  });

  page1.drawCircle({
    x: width / 2 + 39,
    y: benY + 30,
    size: 16,
    color: colorBorderTeal,
  });

  page1.drawText('+', {
    x: width / 2 + 34,
    y: benY + 23,
    size: 18,
    font: fontHelveticaBold,
    color: colorWhite,
  });

  page1.drawText('1 mes de mantenimiento gratis', {
    x: width / 2 + 64,
    y: benY + 36,
    size: 13,
    font: fontHelveticaBold,
    color: colorBrandBlue,
  });

  page1.drawText('Valor $499 · cambios y soporte técnico', {
    x: width / 2 + 64,
    y: benY + 18,
    size: 10,
    font: fontHelvetica,
    color: colorTextGray,
  });

  // Footer: Validity & CTA
  const footY = 48;
  page1.drawText('Válido hasta:', {
    x: 45,
    y: footY + 18,
    size: 11,
    font: fontHelvetica,
    color: colorTextGray,
  });

  page1.drawText(formatDate(validUntilDate), {
    x: 45,
    y: footY,
    size: 16,
    font: fontHelveticaBold,
    color: colorOrangeVig,
  });

  // CTA Button Top/Bottom Right
  const ctaStr = `Escríbenos: "Quiero usar mi certificado ${data.folioCode}"`;
  const ctaW = 340;
  page1.drawRectangle({
    x: width - ctaW - 45,
    y: footY - 4,
    width: ctaW,
    height: 34,
    color: colorBorderTeal,
  });

  page1.drawText(ctaStr, {
    x: width - ctaW - 35,
    y: footY + 8,
    size: 11,
    font: fontHelveticaBold,
    color: colorWhite,
  });

  // ==========================================
  // PAGES 2+: MERGE UPLOADED PDF GUIDE (ONLY IF includeGuide IS TRUE)
  // ==========================================
  if (data.includeGuide) {
    try {
      const pdfPath = path.join(
        process.cwd(),
        'public',
        'pdf',
        'Idealy-10-mensajes-para-vender-por-WhatsApp_1.pdf'
      );

      if (fs.existsSync(pdfPath)) {
        const existingPdfBytes = fs.readFileSync(pdfPath);
        const existingPdfDoc = await PDFDocument.load(existingPdfBytes);
        const copiedPages = await pdfDoc.copyPages(
          existingPdfDoc,
          existingPdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
    } catch (mergeErr) {
      console.error('Error merging uploaded 10 mensajes PDF:', mergeErr);
    }
  }

  return await pdfDoc.save();
}
