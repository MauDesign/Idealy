import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPostForm from '@/app/ui/admin/EditPostForm';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <EditPostForm
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        featuredImage: post.featuredImage,
        published: post.published,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        canonicalUrl: post.canonicalUrl,
        categoryId: post.categoryId,
        tags: post.tags,
      }}
      locale={locale}
      categories={categories}
    />
  );
}
