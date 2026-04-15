'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { deletePost } from '@/lib/actions/posts';

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
  locale: string;
}

export default function DeletePostButton({ postId, postTitle, locale }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    await deletePost(postId, locale);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="btn btn-ghost btn-sm btn-square hover:text-error hover:bg-error/10"
        title="Eliminar publicación"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 p-8 max-w-sm w-full space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-error" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">¿Eliminar publicación?</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">
                Estás a punto de eliminar permanentemente{' '}
                <span className="font-semibold text-base-content">"{postTitle}"</span>.
                <br />Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-ghost flex-1 rounded-xl"
                disabled={loading}
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error flex-1 rounded-xl gap-2"
                disabled={loading}
                type="button"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
