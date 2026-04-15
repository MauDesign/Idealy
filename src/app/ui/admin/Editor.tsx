'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  Image as ImageIcon, Heading1, Heading2, Quote, Undo, Redo 
} from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-base-300 bg-base-100 rounded-t-xl sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('bold') ? 'btn-active' : ''}`}
        type="button"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('italic') ? 'btn-active' : ''}`}
        type="button"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('heading', { level: 1 }) ? 'btn-active' : ''}`}
        type="button"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('heading', { level: 2 }) ? 'btn-active' : ''}`}
        type="button"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="divider divider-horizontal mx-0"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('bulletList') ? 'btn-active' : ''}`}
        type="button"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('orderedList') ? 'btn-active' : ''}`}
        type="button"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('blockquote') ? 'btn-active' : ''}`}
        type="button"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={addLink}
        className={`btn btn-sm btn-ghost ${editor.isActive('link') ? 'btn-active' : ''}`}
        type="button"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('URL de la imagen');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="btn btn-sm btn-ghost"
        type="button"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
      <div className="divider divider-horizontal mx-0"></div>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="btn btn-sm btn-ghost"
        type="button"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="btn btn-sm btn-ghost"
        type="button"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none p-6 focus:outline-none min-h-[400px]',
      },
    },
  });

  return (
    <div className="border border-base-300 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors bg-base-100">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
