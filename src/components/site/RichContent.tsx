import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { ReactNode } from "react";
import { isRichTextDoc, richTextExtensions, type RichTextDoc } from "@/lib/richtext";
import { safeHref } from "@/lib/url";

type RenderOptions = NonNullable<Parameters<typeof renderToReactElement>[0]["options"]>;

/** Bağlantı ve resimleri kendi güvenli bileşenlerimizle çizeriz. */
const renderOptions: RenderOptions = {
  markMapping: {
    link: ({ mark, children }) => {
      const href = safeHref(String(mark.attrs.href ?? ""));
      if (!href) return <>{children}</>;
      const external = /^https?:/i.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  nodeMapping: {
    image: ({ node }) => {
      const src = String(node.attrs.src ?? "");
      if (!/^https:\/\//i.test(src)) return null;
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={String(node.attrs.alt ?? "")} loading="lazy" />;
    },
  },
};

/** Bozuk/uyumsuz içerikte sayfa çökmesin diye hata yakalanır. */
function renderDoc(doc: RichTextDoc): ReactNode | undefined {
  try {
    return renderToReactElement({ content: doc, extensions: richTextExtensions, options: renderOptions });
  } catch (error) {
    console.error("Yazı içeriği çizilemedi:", error);
    return undefined;
  }
}

/**
 * Editörde yazılan içeriği sunucuda çizer.
 * HTML saklanmadığı için içine kod gömülemez; bağlantı ve resim adresleri ayrıca süzülür.
 */
export function RichContent({ doc, className = "" }: { doc: unknown; className?: string }) {
  if (!isRichTextDoc(doc) || !doc.content?.length) return null;

  const content = renderDoc(doc);
  if (content === undefined) return <p className="text-ink-soft">Bu içerik şu an gösterilemiyor.</p>;
  return <div className={`prose-article ${className}`}>{content}</div>;
}
