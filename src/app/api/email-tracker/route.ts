import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Check lib/prisma path

// 1x1 transparent PNG image buffer
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get('cid');
  const recipientId = searchParams.get('rid');

  if (campaignId && recipientId) {
    try {
      // Find recipient
      const recipient = await prisma.campaignRecipient.findUnique({
        where: { id: recipientId },
      });

      if (recipient) {
        const isFirstOpen = recipient.openedCount === 0;

        // Update recipient tracking
        await prisma.campaignRecipient.update({
          where: { id: recipientId },
          data: {
            openedAt: recipient.openedAt || new Date(),
            openedCount: { increment: 1 },
            status: 'DELIVERED', // If opened, it was successfully delivered
          },
        });

        // If first open for recipient, increment campaign totalOpened
        if (isFirstOpen) {
          await prisma.emailCampaign.update({
            where: { id: campaignId },
            data: {
              totalOpened: { increment: 1 },
            },
          });
        }
      }
    } catch (error) {
      console.error('Error tracking email open:', error);
    }
  }

  return new NextResponse(TRANSPARENT_PNG, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': TRANSPARENT_PNG.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
