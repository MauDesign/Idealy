'use client';

import { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import MediaGallery from './MediaGallery';

interface ImageSelectorProps {
  name: string;
  initialValue?: string;
  label?: string;
}

export default function ImageSelector({ name, initialValue = '', label = 'Imagen destacada' }: ImageSelectorProps) {
  const [url, setUrl] = useState(initialValue);
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="form-control">
      <label className="label pb-1">
        <span className="label-text font-medium text-sm">{label}</span>
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="input input-bordered rounded-xl w-full text-sm"
        />
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="btn btn-square btn-primary rounded-xl"
          title="Abrir galería"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      {url && (
        <div className="mt-2 relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            className="w-full aspect-video object-cover rounded-lg border border-base-300"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => setUrl('')}
            className="absolute top-2 right-2 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {showGallery && (
        <MediaGallery
          onSelect={(selectedUrl) => {
            setUrl(selectedUrl);
            setShowGallery(false);
          }}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}
