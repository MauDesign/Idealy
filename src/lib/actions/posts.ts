'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(Boolean);
}

export async function createPost(formData: any, content: string, locale: string) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const summary = formData.get('summary') as string;
  const featuredImage = formData.get('featuredImage') as string;
  const seoTitle = formData.get('seoTitle') as string;
  const seoDescription = formData.get('seoDescription') as string;
  const canonicalUrl = formData.get('canonicalUrl') as string;
  const categoryId = formData.get('categoryId') as string;
  const tagsRaw = formData.get('tags') as string;
  const published = formData.get('published') === 'true';

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        summary: summary || null,
        content,
        featuredImage: featuredImage || null,
        published,
        locale,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || summary || null,
        canonicalUrl: canonicalUrl || null,
        categoryId: categoryId || null,
        tags: parseTags(tagsRaw),
      },
    });
  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.code === 'P2002') {
      return { error: 'Ya existe una publicación con ese slug. Por favor usa uno diferente.' };
    }
    return { error: 'No se pudo crear la publicación.' };
  }

  revalidatePath(`/${locale}/blog`);
  revalidatePath(`/${locale}/admin/posts`);
  redirect(`/${locale}/admin/posts`);
}

export async function updatePost(id: string, formData: any, content: string, locale: string) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const summary = formData.get('summary') as string;
  const featuredImage = formData.get('featuredImage') as string;
  const seoTitle = formData.get('seoTitle') as string;
  const seoDescription = formData.get('seoDescription') as string;
  const canonicalUrl = formData.get('canonicalUrl') as string;
  const categoryId = formData.get('categoryId') as string;
  const tagsRaw = formData.get('tags') as string;
  const published = formData.get('published') === 'true';

  const oldPost = await prisma.post.findUnique({ where: { id }, select: { slug: true } });

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        summary: summary || null,
        content,
        featuredImage: featuredImage || null,
        published,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || summary || null,
        canonicalUrl: canonicalUrl || null,
        categoryId: categoryId || null,
        tags: parseTags(tagsRaw),
      },
    });
  } catch (error: any) {
    console.error('Error updating post:', error);
    if (error.code === 'P2002') {
      return { error: 'Ya existe una publicación con ese slug. Por favor usa uno diferente.' };
    }
    return { error: 'No se pudo actualizar la publicación.' };
  }

  revalidatePath(`/${locale}/blog`);
  revalidatePath(`/${locale}/blog/${slug}`);
  if (oldPost?.slug && oldPost.slug !== slug) {
    revalidatePath(`/${locale}/blog/${oldPost.slug}`);
  }
  revalidatePath(`/${locale}/admin/posts`);
  redirect(`/${locale}/admin/posts`);
}

export async function deletePost(id: string, locale: string) {
  try {
    await prisma.post.delete({ where: { id } });
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: 'No se pudo eliminar la publicación.' };
  }

  revalidatePath(`/${locale}/blog`);
  revalidatePath(`/${locale}/admin/posts`);
}
