'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface SeoPreviewProps {
  titleInputId: string;
  descInputId: string;
  slugInputId: string;
  baseUrl?: string;
  locale?: string;
}

export default function SeoPreview({
  titleInputId,
  descInputId,
  slugInputId,
  baseUrl = 'idealy.com.mx',
  locale = 'es',
}: SeoPreviewProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    const titleEl = document.getElementById(titleInputId) as HTMLInputElement | HTMLTextAreaElement | null;
    const descEl = document.getElementById(descInputId) as HTMLInputElement | HTMLTextAreaElement | null;
    const slugEl = document.getElementById(slugInputId) as HTMLInputElement | null;

    if (titleEl) setTitle(titleEl.value);
    if (descEl) setDesc(descEl.value);
    if (slugEl) setSlug(slugEl.value);

    const onInput = () => {
      if (titleEl) setTitle(titleEl.value);
      if (descEl) setDesc(descEl.value);
      if (slugEl) setSlug(slugEl.value);
    };

    titleEl?.addEventListener('input', onInput);
    descEl?.addEventListener('input', onInput);
    slugEl?.addEventListener('input', onInput);

    return () => {
      titleEl?.removeEventListener('input', onInput);
      descEl?.removeEventListener('input', onInput);
      slugEl?.removeEventListener('input', onInput);
    };
  }, [titleInputId, descInputId, slugInputId]);

  const displayTitle = title || 'Título del artículo | Idea.ly';
  const displayDesc = desc || 'Descripción del artículo que aparece en los resultados de búsqueda...';
  const displayUrl = `${baseUrl}/${locale}/blog/${slug || 'mi-articulo'}`;

  const titleLength = displayTitle.length;
  const descLength = displayDesc.length;

  const titleColor =
    titleLength > 70 ? 'text-error' : titleLength > 55 ? 'text-warning' : 'text-success';
  const descColor =
    descLength > 170 ? 'text-error' : descLength > 140 ? 'text-warning' : 'text-success';

  return (
    <div className="space-y-3">
      {/* SERP Mockup */}
      <div className="bg-base-200/50 rounded-xl p-4 border border-base-300">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-3.5 h-3.5 text-base-content/30" />
          <span className="text-xs text-base-content/40 font-medium">Vista previa en Google</span>
        </div>

        {/* Favicon + URL */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">I</div>
          <div>
            <div className="text-xs text-base-content/70 font-medium leading-none">Idea.ly</div>
            <div className="text-xs text-base-content/40 font-mono leading-none truncate max-w-xs">{displayUrl}</div>
          </div>
        </div>

        {/* Title */}
        <div
          className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-snug truncate"
          style={{ maxWidth: '600px' }}
        >
          {displayTitle.slice(0, 70)}{displayTitle.length > 70 ? '...' : ''}
        </div>

        {/* Description */}
        <div className="text-sm text-base-content/60 leading-snug mt-0.5" style={{ maxWidth: '600px' }}>
          {displayDesc.slice(0, 160)}{displayDesc.length > 160 ? '...' : ''}
        </div>
      </div>

      {/* Character counters */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2">
          <span className="text-base-content/50">Título</span>
          <span className={`font-mono font-semibold ${titleColor}`}>{titleLength}/60</span>
        </div>
        <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2">
          <span className="text-base-content/50">Descripción</span>
          <span className={`font-mono font-semibold ${descColor}`}>{descLength}/160</span>
        </div>
      </div>
    </div>
  );
}
