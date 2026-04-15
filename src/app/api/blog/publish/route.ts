import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');

  if (apiKey !== process.env.BLOG_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, content, summary, locale, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.post.upsert({
      where: { slug },
      update: {
        title,
        content: typeof content === 'object' ? JSON.stringify(content) : content,
        summary,
        locale: locale || 'es',
        published: published ?? true,
      },
      create: {
        title,
        slug,
        content: typeof content === 'object' ? JSON.stringify(content) : content,
        summary,
        locale: locale || 'es',
        published: published ?? true,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
