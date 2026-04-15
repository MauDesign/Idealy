import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Post } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Rss, FolderOpen } from 'lucide-react';
import Footer from '@/app/ui/Footer/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Idea.ly — Tecnología, Estrategia & Diseño',
  description: 'Explora nuestros artículos sobre desarrollo de software, inteligencia artificial, diseño UX y estrategia digital.',
};

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = (await prisma.post.findMany({
    where: { locale, published: true },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  } as any)) as any[];

  const [featuredPost, ...restPosts] = posts;

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* Hero Banner */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-base-100">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Accent glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Rss className="w-3.5 h-3.5" />
            Idea.ly Blog
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            Ideas que <span className="text-primary">transforman</span>
          </h1>
          <p className="text-lg text-base-content/60 max-w-xl mx-auto leading-relaxed">
            Tecnología, estrategia y diseño aplicados al mundo real. Contenido creado por el equipo de Idea.ly.
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-6 pb-24">
        {posts.length > 0 ? (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-16">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-primary inline-block" />
                  Artículo destacado
                </p>
                <Link
                  href={`/${locale}/blog/${featuredPost.slug}`}
                  className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-base-200 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] md:aspect-auto bg-base-300 overflow-hidden">
                    {featuredPost.featuredImage ? (
                      <Image
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full min-h-[320px] flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <span className="text-primary/20 font-black text-6xl tracking-tighter">IDEA.LY</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-10 md:p-14 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        {featuredPost.category ? (
                          <span
                            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1"
                            style={{
                              backgroundColor: featuredPost.category.color ? `${featuredPost.category.color}18` : 'oklch(var(--p)/0.1)',
                              color: featuredPost.category.color || 'oklch(var(--p))',
                            }}
                          >
                            <FolderOpen className="w-3 h-3" />
                            {featuredPost.category.name}
                          </span>
                        ) : (
                          <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Blog</span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-base-content/40 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(featuredPost.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-base-content/40 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {estimateReadTime(featuredPost.content)} min
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black leading-tight mb-5 group-hover:text-primary transition-colors duration-300 tracking-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-base-content/60 leading-relaxed line-clamp-3">
                        {featuredPost.summary}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-sm font-bold text-primary">
                      <span>Leer artículo completo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Rest of Posts Grid */}
            {restPosts.length > 0 && (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                  <span className="w-8 h-px bg-primary inline-block" />
                  Más artículos
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restPosts.map((post: any) => (
                    <Link
                      key={post.id}
                      href={`/${locale}/blog/${post.slug}`}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-base-200 bg-base-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/9] bg-base-300 overflow-hidden">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-600"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                            <span className="text-primary/20 font-black text-4xl tracking-tighter">IDEA.LY</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-7 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-4">
                          {/* Category badge - dynamic */}
                          {(post as any).category ? (
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: (post as any).category.color ? `${(post as any).category.color}18` : 'oklch(var(--p)/0.1)',
                                color: (post as any).category.color || 'oklch(var(--p))',
                              }}
                            >
                              {(post as any).category.name}
                            </span>
                          ) : (
                            <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Blog</span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-base-content/40 font-medium">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 tracking-tight">
                          {post.title}
                        </h2>
                        <p className="text-base-content/55 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                          {post.summary}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-base-200">
                          <span className="flex items-center gap-1.5 text-xs text-base-content/40 font-medium">
                            <Clock className="w-3 h-3" />
                            {estimateReadTime(post.content)} min de lectura
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2.5 transition-all duration-300">
                            Leer <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
              <Rss className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight">Próximamente...</h2>
            <p className="text-base-content/60 max-w-sm mx-auto leading-relaxed mb-8">
              Estamos preparando contenido de valor para ti. Vuelve pronto.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-content font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Volver al inicio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
