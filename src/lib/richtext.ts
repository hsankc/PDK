import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

/**
 * Yazı editörünün ve sitedeki gösterimin ortak ayarları.
 * Editör ile gösterim aynı listeyi kullanmalı; yoksa bazı öğeler sitede görünmez.
 */
export const richTextExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
  Image.configure({ inline: false }),
];

export type RichTextDoc = { type: "doc"; content?: RichTextNode[] };
type RichTextNode = { type: string; text?: string; content?: RichTextNode[]; attrs?: Record<string, unknown> };

export const emptyDoc: RichTextDoc = { type: "doc", content: [] };

export function isRichTextDoc(value: unknown): value is RichTextDoc {
  return Boolean(value && typeof value === "object" && (value as { type?: unknown }).type === "doc");
}

/** Belgedeki düz metin (özet ve okuma süresi için). */
export function plainText(doc: unknown): string {
  if (!isRichTextDoc(doc)) return "";
  const parts: string[] = [];
  const walk = (node: RichTextNode) => {
    if (node.text) parts.push(node.text);
    node.content?.forEach(walk);
    if (["paragraph", "heading", "listItem", "blockquote"].includes(node.type)) parts.push(" ");
  };
  doc.content?.forEach(walk);
  return parts.join("").replace(/\s+/g, " ").trim();
}

export function readingMinutes(doc: unknown) {
  const words = plainText(doc).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Özet yazılmamışsa metnin başından kısa bir özet çıkarır. */
export function autoExcerpt(doc: unknown, length = 180) {
  const text = plainText(doc);
  if (text.length <= length) return text;
  return `${text.slice(0, length).replace(/\s+\S*$/, "")}…`;
}
