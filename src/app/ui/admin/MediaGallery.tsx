'use client';

import { useState, useEffect } from 'react';
import { UploadDropzone } from '@/lib/uploadthing';
import { X, Image as ImageIcon, Loader2, CheckCircle2, Search } from 'lucide-react';
import Image from 'next/image';

interface Media {
  id: string;
  url: string;
  name: string | null;
  createdAt: Date;
}

interface MediaGalleryProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function MediaGallery({ onSelect, onClose }: MediaGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = media.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-base-100 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-base-300">
        
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Galería de Imágenes</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-base-300 bg-base-200/50">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-base-100 text-primary border-b-2 border-primary'
                : 'text-base-content/50 hover:text-base-content'
            }`}
          >
            Explorar Biblioteca
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-base-100 text-primary border-b-2 border-primary'
                : 'text-base-content/50 hover:text-base-content'
            }`}
          >
            Subir Nueva
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'gallery' ? (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="input input-bordered w-full pl-10 rounded-xl text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-base-content/50">Cargando biblioteca...</p>
                </div>
              ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedUrl(item.url)}
                      className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedUrl === item.url
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-base-300'
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt={item.name || 'Media'}
                        fill
                        className="object-cover"
                      />
                      {selectedUrl === item.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white truncate">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <ImageIcon className="w-12 h-12 text-base-content/10 mx-auto mb-4" />
                  <p className="text-base-content/40">No se encontraron imágenes.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  fetchMedia();
                  setActiveTab('gallery');
                  if (res?.[0]) setSelectedUrl(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  container: "border-2 border-dashed border-base-300 bg-base-200/30 rounded-2xl w-full max-w-xl p-10",
                  label: "text-primary hover:text-primary-focus",
                  button: "btn btn-primary rounded-xl px-8",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300 flex justify-end gap-3 bg-base-200/30">
          <button onClick={onClose} className="btn btn-ghost rounded-xl">
            Cancelar
          </button>
          <button
            disabled={!selectedUrl}
            onClick={() => selectedUrl && onSelect(selectedUrl)}
            className="btn btn-primary rounded-xl px-8"
          >
            Seleccionar Imagen
          </button>
        </div>
      </div>
    </div>
  );
}
