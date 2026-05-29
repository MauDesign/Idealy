import { MetadataRoute } from 'next';
import { locales } from '../i18n/routing';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

  // Localized services list pages
  const servicesListEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/services`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Localized services detail pages (5 core slugs)
  const validSlugs = [
    'software-development',
    'ai-automation',
    'ux-ui-design',
    'digital-marketing',
    'consulting'
  ];

  const serviceEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const slug of validSlugs) {
      serviceEntries.push({
        url: `${baseUrl}/${locale}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // Localized privacy policy pages
  const privacyEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  // Fetch all published posts
  const posts = (await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, locale: true, updatedAt: true }
  })) as any[];

  // Dynamic blog post entries
  const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/${post.locale}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...baseEntries,
    ...localeHomeEntries,
    ...blogListEntries,
    ...servicesListEntries,
    ...serviceEntries,
    ...privacyEntries,
    ...postEntries,
  ];
}
