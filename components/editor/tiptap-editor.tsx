"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { useEffect } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your masterpiece...',
      }),
      Typography,
    ],
    content: content,
    editable: editable,
    editorProps: {
      attributes: {
        class: 'prose prose-zinc max-w-none focus:outline-none min-h-[calc(100vh-12rem)] font-serif-display text-lg leading-relaxed text-zinc-800 prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-indigo-600 prose-blockquote:border-l-zinc-300 prose-blockquote:text-zinc-600',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content if it changes externally (e.g. loaded from DB)
  useEffect(() => {
    if (editor && content && editor.isEmpty) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {editable && (
        <div className="flex items-center gap-0.5 border-b border-zinc-200 pb-4 mb-8 sticky top-0 bg-white z-10 -mx-12 px-12 pt-4">
          <Toggle
            size="sm"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 1 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 2 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          <Toggle
            size="sm"
            pressed={editor.isActive('bulletList')}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('orderedList')}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          <Toggle
            size="sm"
            pressed={editor.isActive('blockquote')}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <Quote className="h-4 w-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
}
