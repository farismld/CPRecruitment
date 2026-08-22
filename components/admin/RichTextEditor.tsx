"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  LinkIcon,
  Undo,
  Redo,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis konten di sini...",
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose-content min-h-[220px] px-4 py-3 focus:outline-none",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sinkronkan jika content berubah dari luar (misal saat load data edit)
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="min-h-[260px] rounded-xl border border-gray-200 bg-gray-50 animate-pulse" />
    );
  }

  function ToolbarButton({
    onClick,
    active,
    children,
    label,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    label: string;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={cn(
          "h-8 w-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors",
          active && "bg-brand-50 text-brand-700"
        )}
      >
        {children}
      </button>
    );
  }

  function addLink() {
    const url = window.prompt("Masukkan URL tautan:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("Masukkan URL gambar:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet List">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} label="Tambah tautan">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} label="Tambah gambar">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} label="Undo">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} label="Redo">
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
