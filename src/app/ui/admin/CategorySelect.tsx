'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, FolderOpen, Plus, X, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface CategorySelectProps {
  categories: Category[];
  initialCategoryId?: string | null;
  name?: string;
}

export default function CategorySelect({
  categories,
  initialCategoryId,
  name = 'categoryId',
}: CategorySelectProps) {
  const router = useRouter();
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [selectedId, setSelectedId] = useState<string>(initialCategoryId || '');
  const [isOpen, setIsOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Sync with props when they change
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const selected = localCategories.find((c) => c.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsOpen(false);
  };

  const clear = () => {
    setSelectedId('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selectedId} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 input input-bordered rounded-xl text-sm text-left h-10 px-3"
      >
        <span className="flex items-center gap-2 min-w-0">
          <FolderOpen className="w-4 h-4 text-base-content/30 shrink-0" />
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.color && (
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: selected.color }}
                />
              )}
              <span className="truncate font-medium">{selected.name}</span>
            </span>
          ) : (
            <span className="text-base-content/40">Sin categoría</span>
          )}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {selectedId && (
            <span
              onClick={(e) => { e.stopPropagation(); clear(); }}
              className="hover:text-error cursor-pointer p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5 text-base-content/40" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-base-content/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-full bg-base-100 border border-base-300 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {localCategories.length > 0 ? (
            <ul className="py-1 max-h-48 overflow-y-auto">
              <li>
                <button
                  type="button"
                  onClick={clear}
                  className="w-full text-left px-3 py-2 text-sm text-base-content/50 hover:bg-base-200 transition-colors"
                >
                  Sin categoría
                </button>
              </li>
              {localCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors ${
                      selectedId === cat.id ? 'bg-primary/10 text-primary font-semibold' : ''
                    }`}
                  >
                    {cat.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                    )}
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-base-content/40 px-3 py-4 text-center">
              No hay categorías. Crea la primera.
            </p>
          )}

          <div className="border-t border-base-300 p-2">
            {showNew ? (
              <div className="flex gap-1">
                <input
                  autoFocus
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const btn = e.currentTarget.nextSibling as HTMLButtonElement;
                      btn?.click();
                    }
                  }}
                  placeholder="Nueva categoría..."
                  className="input input-bordered input-sm flex-1 rounded-lg text-xs"
                  maxLength={40}
                  disabled={isAdding}
                />
                <button 
                  type="button"
                  disabled={isAdding || !newCategoryName.trim()}
                  onClick={async () => {
                    if (!newCategoryName.trim() || isAdding) return;
                    setIsAdding(true);
                    try {
                      const res = await fetch('/api/admin/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newCategoryName.trim() }),
                      });
                      if (res.ok) {
                        const cat = await res.json();
                        setLocalCategories((prev) => [...prev, cat]);
                        handleSelect(cat.id);
                        setNewCategoryName('');
                        setShowNew(false);
                        router.refresh();
                      }
                    } catch {} finally {
                      setIsAdding(false);
                    }
                  }}
                  className="btn btn-primary btn-sm btn-square rounded-lg"
                >
                  {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="btn btn-ghost btn-sm btn-square rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNew(true)}
                className="w-full text-left flex items-center gap-1.5 text-xs text-base-content/50 hover:text-primary px-1 py-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva categoría
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
