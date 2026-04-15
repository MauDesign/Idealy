'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { X, Tag } from 'lucide-react';

interface TagsInputProps {
  initialTags?: string[];
  name?: string;
}

export default function TagsInput({ initialTags = [], name = 'tags' }: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !tags.includes(trimmed) && tags.length < 15) {
      setTags([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      {/* Hidden input with comma-separated tags for form submission */}
      <input type="hidden" name={name} value={tags.join(',')} />

      {/* Tag display + input container */}
      <div
        className="flex flex-wrap gap-1.5 min-h-[2.75rem] p-2 border border-base-300 rounded-xl bg-base-100 cursor-text focus-within:border-primary/60 transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20"
          >
            <Tag className="w-2.5 h-2.5" />
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="ml-0.5 hover:text-error transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue) addTag(inputValue); }}
          placeholder={tags.length === 0 ? 'seo, marketing, desarrollo...' : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-base-content/30 px-1"
        />
      </div>

      <p className="text-xs text-base-content/40">
        Presiona <kbd className="kbd kbd-xs">Enter</kbd> o <kbd className="kbd kbd-xs">,</kbd> para agregar. Máx. 15 etiquetas.
        <span className="ml-2 font-mono">{tags.length}/15</span>
      </p>
    </div>
  );
}
