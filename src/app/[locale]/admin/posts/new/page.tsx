import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import NewPostForm from '@/app/ui/admin/NewPostForm';

export default async function NewPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return <NewPostForm categories={categories} />;
}
