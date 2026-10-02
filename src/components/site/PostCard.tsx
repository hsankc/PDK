import { Clock } from "lucide-react";
import Link from "next/link";
import { PawIcon } from "@/components/pets/PawIcon";
import type { Post } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { autoExcerpt, readingMinutes } from "@/lib/richtext";

export function postHref(post: Pick<Post, "kind" | "slug">) {
  return `${post.kind === "rehber" ? "/rehberler" : "/yazilar"}/${post.slug}`;
}

/** Yazı köşesi kartı. `featured` ilk yazıyı geniş gösterir. */
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const excerpt = post.excerpt || autoExcerpt(post.content);

  return (
    <Link
      href={postHref(post)}
      className={`card group grid h-full overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${
        featured ? "lg:grid-cols-[1.2fr_1fr]" : ""
      }`}
    >
      <div
        className={`border-ink relative overflow-hidden ${featured ? "aspect-video border-b-2 lg:aspect-auto lg:min-h-80 lg:border-r-2 lg:border-b-0" : "aspect-video border-b-2"}`}
      >
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-ink bg-paws-light absolute inset-0 grid place-items-center">
            <PawIcon className="fill-brand size-16 -rotate-12" />
          </div>
        )}
        {post.category && (
          <span className="sticker shadow-hard-sm absolute top-3 left-3 -rotate-2">{post.category}</span>
        )}
      </div>
      <div className={`flex flex-col ${featured ? "p-6 sm:p-8" : "p-5"}`}>
        <h3
          className={`font-display group-hover:text-brand leading-tight font-extrabold transition-colors ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}
        >
          {post.title}
        </h3>
        {excerpt && <p className={`text-ink-soft mt-3 ${featured ? "text-lg" : "line-clamp-3"}`}>{excerpt}</p>}
        <p className="text-ink-soft mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-sm font-bold">
          {post.kind === "yazi" && <span>{formatDate(post.published_at)}</span>}
          <span className="flex items-center gap-1">
            <Clock className="text-brand size-4" aria-hidden="true" /> {readingMinutes(post.content)} dk okuma
          </span>
        </p>
      </div>
    </Link>
  );
}
