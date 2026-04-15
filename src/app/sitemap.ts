import { MetadataRoute } from 'next';
import { locales } from '../i18n/routing';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.idealy.com.mx';

  // Base pages (Home)
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  // Localized home pages
  const localeHomeEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Localized blog list pages
  const blogListEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch all published posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, locale: true, updatedAt: true }
  });

  // Dynamic blog post entries
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/${post.locale}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...baseEntries,
    ...localeHomeEntries,
    ...blogListEntries,
    ...postEntries,
  ];
}
