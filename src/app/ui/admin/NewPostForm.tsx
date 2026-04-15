'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2, Globe, Eye, EyeOff, Sparkles, Link2, Languages } from 'lucide-react';
import Editor from '@/app/ui/admin/Editor';
import TagsInput from '@/app/ui/admin/TagsInput';
import CategorySelect from '@/app/ui/admin/CategorySelect';
import SeoPreview from '@/app/ui/admin/SeoPreview';
import { createPost } from '@/lib/actions/posts';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface NewPostFormProps {
  categories: Category[];
  translateFromPost?: {
    translationGroupId: string | null;
    categoryId: string | null;
    featuredImage: string | null;
  } | null;
}

export default function NewPostForm({ categories, translateFromPost }: NewPostFormProps) {
  const { locale } = useParams() as { locale: string };
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSeo, setShowSeo] = useState(false);
  const [published, setPublished] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(translateFromPost?.featuredImage || '');

  const translationGroupId = translateFromPost?.translationGroupId;

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    formData.set('published', published ? 'true' : 'false');
    const result = await createPost(formData, content, locale);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const slugInput = document.getElementById('slug-input') as HTMLInputElement;
    if (slugInput && !slugInput.value) {
      slugInput.value = e.target.value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/posts`} className="btn btn-ghost btn-circle btn-sm">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nueva publicación</h1>
          {translateFromPost ? (
            <p className="text-sm font-semibold text-primary flex items-center gap-1.5 mt-0.5">
              <Languages className="w-4 h-4" />
              Escribiendo traducción al {locale.toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-base-content/50 mt-0.5">Crea contenido optimizado para tu audiencia.</p>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error rounded-xl text-sm">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">

        {/* ── Main Editor Column ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Title */}
          <input
            id="post-title-input"
            type="text"
            name="title"
            onBlur={handleTitleBlur}
            placeholder="Título de la publicación..."
            className="input input-ghost text-4xl font-black w-full focus:bg-base-200/30 p-4 h-auto rounded-xl border-none outline-none focus:outline-none tracking-tight leading-tight"
            required
          />

          {/* Editor */}
          <Editor content={content} onChange={setContent} />

          {/* SEO Panel */}
          <div className="card bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="flex items-center justify-between w-full p-5 text-left hover:bg-base-200/40 transition-colors"
            >
              <span className="flex items-center gap-2 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                SEO & Optimización
              </span>
              <span className="text-xs text-base-content/40 font-mono">
                {showSeo ? '▲ Ocultar' : '▼ Mostrar'}
              </span>
            </button>

            {showSeo && (
              <div className="px-5 pb-6 space-y-5 border-t border-base-300 pt-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-base-content/40 mb-3">
                    Previsualización en Google
                  </p>
                  <SeoPreview
                    titleInputId="seo-title-input"
                    descInputId="seo-desc-input"
                    slugInputId="slug-input"
                    locale={locale}
                  />
                </div>

                <div className="divider my-0" />

                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">Meta título</span>
                    <span className="label-text-alt text-base-content/40">Óptimo: 50–60 caracteres</span>
                  </label>
                  <input
                    id="seo-title-input"
                    type="text"
                    name="seoTitle"
                    placeholder="Título SEO personalizado..."
                    className="input input-bordered rounded-xl w-full text-sm"
                    maxLength={80}
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">Meta descripción</span>
                    <span className="label-text-alt text-base-content/40">Óptimo: 140–160 caracteres</span>
                  </label>
                  <textarea
                    id="seo-desc-input"
                    name="seoDescription"
                    placeholder="Descripción para buscadores..."
                    className="textarea textarea-bordered rounded-xl text-sm h-24 resize-none"
                    maxLength={200}
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" />
                      URL Canónica
                    </span>
                    <span className="label-text-alt text-base-content/40">Opcional</span>
                  </label>
                  <input
                    type="url"
                    name="canonicalUrl"
                    placeholder="https://idealy.com.mx/es/blog/..."
                    className="input input-bordered rounded-xl w-full text-sm font-mono"
                  />
                  <p className="text-xs text-base-content/40 mt-1.5">
                    Solo si este contenido existe en otra URL.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          <div className="card bg-base-100 shadow-sm border border-base-300 rounded-2xl p-6 space-y-5 sticky top-6">

            {/* Publish Toggle */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-3">Estado</p>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                  published
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-base-300 bg-base-200/40 text-base-content/50'
                }`}
              >
                <span className="flex items-center gap-2 font-semibold text-sm">
                  {published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {published ? 'Publicado' : 'Borrador'}
                </span>
                <div className={`w-9 h-5 rounded-full transition-all duration-200 relative ${published ? 'bg-primary' : 'bg-base-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${published ? 'left-4' : 'left-0.5'}`} />
                </div>
              </button>
              <input type="hidden" name="published" value={published ? 'true' : 'false'} />
            </div>

            {/* Slug */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Slug (URL)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-base-content/30 font-mono">/blog/</span>
                <input
                  id="slug-input"
                  type="text"
                  name="slug"
                  placeholder="mi-nueva-publicacion"
                  className="input input-bordered rounded-xl w-full text-sm pl-14 font-mono"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Categoría</span>
              </label>
              <CategorySelect categories={categories} initialCategoryId={translateFromPost?.categoryId || null} name="categoryId" />
            </div>

            {/* Tags */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Palabras clave (Tags)</span>
              </label>
              <TagsInput name="tags" />
            </div>

            {/* Featured Image */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Imagen destacada (URL)</span>
              </label>
              <input
                type="text"
                name="featuredImage"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="https://..."
                className="input input-bordered rounded-xl w-full text-sm"
              />
              {featuredImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredImageUrl}
                  alt="Preview"
                  className="mt-2 w-full aspect-video object-cover rounded-lg border border-base-300"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>

            {/* Summary */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Resumen / Excerpt</span>
              </label>
              <textarea
                name="summary"
                placeholder="Descripción breve del artículo..."
                className="textarea textarea-bordered rounded-xl text-sm h-20 resize-none"
              />
            </div>

            {/* Hidden Translation Group Id */}
            {translationGroupId && (
               <input type="hidden" name="translationGroupId" value={translationGroupId} />
            )}

            {/* Save */}
            <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-xl gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Guardando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
