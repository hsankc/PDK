"use client";

import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { uploadImage } from "@/lib/admin/upload";
import { emptyDoc, isRichTextDoc, richTextExtensions, type RichTextDoc } from "@/lib/richtext";
import { safeHref } from "@/lib/url";

type Props = {
  id: string;
  value: unknown;
  onChange: (doc: RichTextDoc) => void;
  folder: string;
};

/** Word'e benzer yazı editörü: başlık, kalın, liste, bağlantı, resim. */
export function RichTextField({ id, value, onChange, folder }: Props) {
  const editor = useEditor({
    extensions: richTextExtensions,
    content: isRichTextDoc(value) ? value : emptyDoc,
    // Next.js sunucuda çizerken uyumsuzluk olmasın
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        class: "prose-article min-h-72 max-w-none px-4 py-4 outline-none sm:px-6",
        "aria-label": "Yazı içeriği",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as RichTextDoc),
  });

  return (
    <div className="border-ink bg-paper focus-within:shadow-hard-red overflow-hidden rounded-2xl border-2 transition-shadow">
      {editor ? <Toolbar editor={editor} folder={folder} /> : <div className="bg-mist h-12" />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, folder }: { editor: Editor; folder: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      paragraph: editor.isActive("paragraph"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      link: editor.isActive("link"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const setLink = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("Bağlantı adresi (boş bırakırsan bağlantı kaldırılır):", current ?? "https://");
    if (input === null) return;
    const href = safeHref(input);
    if (!href || href === "https://") {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }
    chain().extendMarkRange("link").setLink({ href }).run();
  };

  const addImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const src = await uploadImage(file, folder);
      chain().setImage({ src, alt: "" }).run();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resim yüklenemedi.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="border-ink bg-mist sticky top-16 z-10 border-b-2 lg:top-0">
      <div className="flex flex-wrap items-center gap-1 p-1.5" role="toolbar" aria-label="Biçimlendirme">
        <ToolButton label="Paragraf" active={state.paragraph} onClick={() => chain().setParagraph().run()}>
          <Pilcrow />
        </ToolButton>
        <ToolButton label="Büyük başlık" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          <Heading2 />
        </ToolButton>
        <ToolButton label="Küçük başlık" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          <Heading3 />
        </ToolButton>
        <Divider />
        <ToolButton label="Kalın" active={state.bold} onClick={() => chain().toggleBold().run()}>
          <Bold />
        </ToolButton>
        <ToolButton label="İtalik" active={state.italic} onClick={() => chain().toggleItalic().run()}>
          <Italic />
        </ToolButton>
        <ToolButton label="Altı çizili" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
          <Underline />
        </ToolButton>
        <ToolButton label="Üstü çizili" active={state.strike} onClick={() => chain().toggleStrike().run()}>
          <Strikethrough />
        </ToolButton>
        <Divider />
        <ToolButton
          label="Madde işaretli liste"
          active={state.bulletList}
          onClick={() => chain().toggleBulletList().run()}
        >
          <List />
        </ToolButton>
        <ToolButton label="Numaralı liste" active={state.orderedList} onClick={() => chain().toggleOrderedList().run()}>
          <ListOrdered />
        </ToolButton>
        <ToolButton label="Alıntı" active={state.blockquote} onClick={() => chain().toggleBlockquote().run()}>
          <Quote />
        </ToolButton>
        <ToolButton label="Ayırıcı çizgi" onClick={() => chain().setHorizontalRule().run()}>
          <Minus />
        </ToolButton>
        <Divider />
        <ToolButton label="Bağlantı ekle" active={state.link} onClick={setLink}>
          <Link2 />
        </ToolButton>
        <ToolButton label="Resim ekle" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
        </ToolButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => addImage(event.target.files?.[0])}
        />
        <Divider />
        <ToolButton label="Geri al" onClick={() => chain().undo().run()} disabled={!state.canUndo}>
          <Undo2 />
        </ToolButton>
        <ToolButton label="Yinele" onClick={() => chain().redo().run()} disabled={!state.canRedo}>
          <Redo2 />
        </ToolButton>
      </div>
      {error && <p className="text-brand px-3 pb-2 text-sm font-bold">{error}</p>}
    </div>
  );
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-lg transition-colors disabled:opacity-30 [&>svg]:size-4.5 ${
        active ? "bg-ink text-paper" : "hover:bg-paper"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="bg-ink/15 mx-0.5 h-6 w-px" aria-hidden="true" />;
}
