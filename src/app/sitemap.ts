import { MetadataRoute } from 'next';
import { locales } from '../i18n/routing';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.idealy.com.mx';
  // Fecha real de la última versión estable de contenidos
  const siteReleaseDate = new Date('2026-03-25T12:00:00.000Z');

  // 1. Home pages (/es y /en) — sin URL raíz que redirija
  const homeEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: siteReleaseDate,
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
      },
    },
  }));

  // 2. Las 3 páginas de oferta (Landing pages core por idioma)
  const offerPages = ['pagina-express', 'sitio-crecimiento', 'desarrollo-a-la-medida'];
  const offerEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const page of offerPages) {
      offerEntries.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: siteReleaseDate,
        changeFrequency: 'weekly',
        priority: 0.95,
        alternates: {
          languages: {
            es: `${baseUrl}/es/${page}`,
            en: `${baseUrl}/en/${page}`,
          },
        },
      });
    }
  }

  // 3. Blog list pages (/es/blog y /en/blog)
  const blogListEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/blog`,
    lastModified: siteReleaseDate,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        es: `${baseUrl}/es/blog`,
        en: `${baseUrl}/en/blog`,
      },
    },
  }));

  // 4. Services list pages (/es/services y /en/services)
  const servicesListEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/services`,
    lastModified: siteReleaseDate,
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: {
      languages: {
        es: `${baseUrl}/es/services`,
        en: `${baseUrl}/en/services`,
      },
    },
  }));

  // 5. Servicios individuales activos (excluyendo los que redirigen a páginas de oferta)
  const activeServiceSlugs = [
    'ai-automation',
    'ux-ui-design',
    'consulting',
  ];

  const serviceEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const slug of activeServiceSlugs) {
      serviceEntries.push({
        url: `${baseUrl}/${locale}/services/${slug}`,
        lastModified: siteReleaseDate,
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: {
          languages: {
            es: `${baseUrl}/es/services/${slug}`,
            en: `${baseUrl}/en/services/${slug}`,
          },
        },
      });
    }
  }

  // 6. Privacy policy
  const privacyEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/privacy-policy`,
    lastModified: siteReleaseDate,
    changeFrequency: 'yearly',
    priority: 0.3,
    alternates: {
      languages: {
        es: `${baseUrl}/es/privacy-policy`,
        en: `${baseUrl}/en/privacy-policy`,
      },
    },
  }));

  // 7. Blog posts dinámicos con fecha real (updatedAt) y alternates
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, locale: true, updatedAt: true, translationGroupId: true },
    });
  } catch {
    posts = [];
  }

  // Mapa de traducciones para asociar alternates es/en por translationGroupId
  const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => {
    let languages: { es?: string; en?: string } = {
      [post.locale]: `${baseUrl}/${post.locale}/blog/${post.slug}`,
    };

    if (post.translationGroupId) {
      const translation = posts.find(
        (p: any) => p.translationGroupId === post.translationGroupId && p.locale !== post.locale
      );
      if (translation) {
        languages = {
          es: `${baseUrl}/es/blog/${post.locale === 'es' ? post.slug : translation.slug}`,
          en: `${baseUrl}/en/blog/${post.locale === 'en' ? post.slug : translation.slug}`,
        };
      }
    }

    return {
      url: `${baseUrl}/${post.locale}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : siteReleaseDate,
      changeFrequency: 'weekly',
      priority: 0.7,
      ...(languages.es && languages.en ? { alternates: { languages: languages as { es: string; en: string } } } : {}),
    };
  });

  return [
    ...homeEntries,
    ...offerEntries,
    ...blogListEntries,
    ...servicesListEntries,
    ...serviceEntries,
    ...privacyEntries,
    ...postEntries,
  ];
}
