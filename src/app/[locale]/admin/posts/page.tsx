import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, Globe, FileText } from 'lucide-react';
import Image from 'next/image';
import DeletePostButton from '@/app/ui/admin/DeletePostButton';

export default async function AdminPostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await prisma.post.findMany({
    where: { locale },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publicaciones</h1>
          <p className="text-base-content/60 text-sm mt-1">
            {posts.length} {posts.length === 1 ? 'publicación' : 'publicaciones'} en{' '}
            <span className="font-semibold uppercase">{locale}</span>
          </p>
        </div>
        <Link href={`/${locale}/admin/posts/new`} className="btn btn-primary gap-2 rounded-xl">
          <Plus className="w-5 h-5" />
          Nueva Publicación
        </Link>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="bg-base-200/50">
                <th>Imagen</th>
                <th>Título / Slug</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="w-14 h-14 rounded-xl bg-base-200 overflow-hidden relative shrink-0">
                        {post.featuredImage ? (
                          <Image src={post.featuredImage} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-base-content/20" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold leading-snug">{post.title}</div>
                      <div className="text-xs text-base-content/40 flex items-center gap-1 mt-0.5 font-mono">
                        <Globe className="w-3 h-3" />
                        /blog/{post.slug}
                      </div>
                    </td>
                    <td>
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/40 bg-base-200 border border-base-300 px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-base-content/30" />
                          Borrador
                        </span>
                      )}
                    </td>
                    <td className="text-sm text-base-content/50 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString(locale, {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/${locale}/admin/posts/edit/${post.id}`}
                          className="btn btn-ghost btn-sm btn-square hover:text-primary hover:bg-primary/10"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeletePostButton
                          postId={post.id}
                          postTitle={post.title}
                          locale={locale}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-24 text-base-content/40">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="w-12 h-12 opacity-20" />
                      <p className="font-medium">No hay publicaciones aún.</p>
                      <Link href={`/${locale}/admin/posts/new`} className="btn btn-sm btn-primary btn-outline rounded-xl">
                        Crear la primera
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
