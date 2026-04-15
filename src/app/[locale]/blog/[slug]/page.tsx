import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import Footer from '@/app/ui/Footer/Footer';
import { Calendar, Clock, ArrowLeft, Tag, FolderOpen, Languages } from 'lucide-react';
import type { Metadata } from 'next';
import ShareButton from '@/app/ui/components/ShareButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, include: { category: true } });
  if (!post) return {};

  const otherLocale = locale === 'es' ? 'en' : 'es';
  let translatedUrl = undefined;
  if (post.translationGroupId) {
    const translatedPost = await prisma.post.findFirst({
      where: { translationGroupId: post.translationGroupId, locale: otherLocale },
      select: { slug: true }
    });
    if (translatedPost) {
      translatedUrl = `https://www.idealy.com.mx/${otherLocale}/blog/${translatedPost.slug}`;
    }
  }

  const canonicalUrl =
    post.canonicalUrl || `https://www.idealy.com.mx/${locale}/blog/${slug}`;

  return {
    title: `${post.seoTitle || post.title} | Idea.ly`,
    description: post.seoDescription || post.summary || '',
    keywords: post.tags.join(', '),
    alternates: { 
      canonical: canonicalUrl,
      ...(translatedUrl ? { languages: { [otherLocale]: translatedUrl } } : {})
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary || '',
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }]
        : [],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.tags,
      url: canonicalUrl,
      siteName: 'Idea.ly',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary || '',
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Find translation
  let translatedPost = null;
  const otherLocale = locale === 'es' ? 'en' : 'es';
  if (post.translationGroupId) {
    translatedPost = await prisma.post.findFirst({
      where: { translationGroupId: post.translationGroupId, locale: otherLocale },
      select: { slug: true }
    });
  }

  const readTime = estimateReadTime(post.content);
  const canonicalUrl =
    post.canonicalUrl || `https://www.idealy.com.mx/${locale}/blog/${slug}`;

  const formattedDate = new Date(post.createdAt).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Related posts — same category first, then same locale
  const relatedPosts = await prisma.post.findMany({
    where: {
      locale,
      published: true,
      NOT: { id: post.id },
      ...(post.categoryId ? { categoryId: post.categoryId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { category: true },
  });

  // JSON-LD: Article structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.summary || '',
    image: post.featuredImage || undefined,
    url: canonicalUrl,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    keywords: post.tags.join(', '),
    inLanguage: locale,
    author: {
      '@type': 'Person',
      name: 'Leo',
      url: 'https://www.idealy.com.mx',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Idea.ly',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.idealy.com.mx/img/Logo-Idealy.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    ...(post.category
      ? { articleSection: post.category.name }
      : {}),
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* JSON-LD Structured Data — uses Next.js Script to avoid React 19 warning */}
      <Script
        id="article-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navbar spacer */}
      <div className="pt-24" />

      <main className="flex-grow">
        <article>
          {/* ── Article Header ── */}
          <header className="container mx-auto px-6 max-w-4xl pt-12 pb-10 text-center">
            {/* Back link */}
            <div className="flex justify-start mb-8">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/50 hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {locale === 'es' ? 'Volver al Blog' : 'Back to Blog'}
              </Link>
            </div>

            {/* Translation Link */}
            {translatedPost && (
              <div className="flex justify-center mb-6">
                <Link 
                  href={`/${otherLocale}/blog/${translatedPost.slug}`} 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors border border-primary/20"
                >
                  <Languages className="w-4 h-4" />
                  {locale === 'es' ? 'Read article in English' : 'Leer artículo en Español'}
                </Link>
              </div>
            )}

            {/* Category + meta bar */}
            <div className="flex items-center justify-center flex-wrap gap-3 mb-8">
              {post.category ? (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: post.category.color
                      ? `${post.category.color}18`
                      : 'oklch(var(--p)/0.1)',
                    borderColor: post.category.color
                      ? `${post.category.color}40`
                      : 'oklch(var(--p)/0.2)',
                    color: post.category.color || 'oklch(var(--p))',
                  }}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  {post.category.name}
                </span>
              ) : (
                <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/20">
                  Tecnología
                </span>
              )}

              <span className="flex items-center gap-1.5 text-sm text-base-content/50">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-base-content/50">
                <Clock className="w-4 h-4" />
                {readTime} min de lectura
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter mb-8">
              {post.title}
            </h1>

            {/* Summary */}
            {post.summary && (
              <p className="text-xl text-base-content/60 leading-relaxed italic max-w-2xl mx-auto">
                {post.summary}
              </p>
            )}
          </header>

          {/* ── Featured Image ── */}
          {post.featuredImage && (
            <div className="container mx-auto px-6 max-w-5xl mb-16">
              <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-base-200">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* ── Content + Share Sidebar ── */}
          <div className="container mx-auto px-6 max-w-5xl mb-20">
            <div className="flex gap-12 items-start">

              {/* Share Sidebar (desktop) */}
              <aside className="hidden lg:flex flex-col items-center gap-4 sticky top-28 w-12 shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-base-content/30 -rotate-90 mb-8 whitespace-nowrap">
                  Compartir
                </div>
                <ShareButton url="" title={post.title} platform="facebook" />
                <ShareButton url="" title={post.title} platform="twitter" />
                <ShareButton url="" title={post.title} platform="linkedin" />
                <ShareButton url="" title={post.title} platform="copy" />
              </aside>

              {/* Article Body */}
              <div className="flex-1 min-w-0">
                <div
                  className="prose prose-lg md:prose-xl max-w-none
                    prose-headings:font-black prose-headings:tracking-tight prose-headings:text-base-content
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                    prose-p:text-base-content/75 prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-base-content
                    prose-blockquote:border-l-4 prose-blockquote:border-primary
                    prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1
                    prose-code:bg-base-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-base-200 prose-pre:rounded-2xl prose-pre:shadow-inner
                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                    prose-li:text-base-content/75"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags cloud */}
                {post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-base-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-base-content/30 shrink-0" />
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-base-200 text-base-content/60 font-medium px-3 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Share Row */}
                <div className="flex lg:hidden items-center gap-3 mt-8 pt-6 border-t border-base-200">
                  <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 mr-2">
                    Compartir:
                  </span>
                  <ShareButton url="" title={post.title} platform="facebook" />
                  <ShareButton url="" title={post.title} platform="twitter" />
                  <ShareButton url="" title={post.title} platform="linkedin" />
                  <ShareButton url="" title={post.title} platform="copy" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Author Card ── */}
          <div className="container mx-auto px-6 max-w-4xl mb-20">
            <div className="bg-base-200/60 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border border-base-300">
              <div className="shrink-0 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-content text-3xl font-black shadow-lg shadow-primary/25">
                L
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Autor</p>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Leo — Idea.ly</h3>
                <p className="text-base-content/60 leading-relaxed max-w-xl">
                  Consultor de innovación digital apasionado por transformar ideas en soluciones
                  tecnológicas escalables. Co-fundador de Idea.ly.
                </p>
                <div className="mt-4 flex items-center gap-4 justify-center md:justify-start">
                  <Link
                    href={`/${locale}/#contact`}
                    className="text-sm text-primary font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Contactar →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related Posts ── */}
          {relatedPosts.length > 0 && (
            <div className="container mx-auto px-6 max-w-5xl mb-20">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-primary" />
                <h2 className="text-2xl font-black tracking-tight">
                  {post.category
                    ? `Más sobre ${post.category.name}`
                    : 'Artículos relacionados'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/${locale}/blog/${related.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-base-200 bg-base-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="relative aspect-[16/9] bg-base-300 overflow-hidden">
                      {related.featuredImage ? (
                        <Image
                          src={related.featuredImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                          <span className="text-primary/20 font-black text-3xl">IDEA.LY</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {related.category && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                          {related.category.name} ·{' '}
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                        {new Date(related.createdAt).toLocaleDateString(locale, {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <h3 className="text-base font-bold mt-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
