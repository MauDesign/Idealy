import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import NewPostForm from '@/app/ui/admin/NewPostForm';

export default async function NewPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ translateFromId?: string }>;
}) {
  const { locale } = await params;
  const { translateFromId } = await searchParams;
  setRequestLocale(locale);

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  
  let translateFromPost = null;
  if (translateFromId) {
    translateFromPost = await prisma.post.findUnique({
      where: { id: translateFromId },
      select: { translationGroupId: true, categoryId: true, featuredImage: true },
    });
  }

  return <NewPostForm categories={categories} translateFromPost={translateFromPost} />;
}
