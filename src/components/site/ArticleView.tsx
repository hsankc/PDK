import { ArrowLeft, CalendarDays, Clock, PenLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { Post } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { autoExcerpt, readingMinutes } from "@/lib/richtext";
import { PostCard } from "./PostCard";
import { Reveal } from "./Reveal";
import { RichContent } from "./RichContent";
import { ShareBar } from "./ShareBar";

export function articleMetadata(post: Post | null): Metadata {
  if (!post) return { title: "Bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt || autoExcerpt(post.content, 160) || undefined,
    openGraph: {
      type: "article",
      title: post.title,
      publishedTime: post.published_at,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

/** Yazı ve rehber detay sayfası. */
export function ArticleView({
  post,
  back,
  related,
  relatedTitle,
}: {
  post: Post;
  back: { href: string; label: string };
  related: Post[];
  relatedTitle: string;
}) {
  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href={back.href} className="text-ink-soft hover:text-ink mb-8 inline-flex items-center gap-1.5 font-bold">
          <ArrowLeft className="size-4" aria-hidden="true" /> {back.label}
        </Link>

        <Reveal>
          {post.category && <p className="sticker bg-brand text-paper mb-4 -rotate-2">{post.category}</p>}
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl">{post.title}</h1>
          <p className="text-ink-soft mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-bold">
            {post.author_name && (
              <span className="flex items-center gap-1.5">
                <PenLine className="text-brand size-4" aria-hidden="true" /> {post.author_name}
              </span>
            )}
            {post.kind === "yazi" && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="text-brand size-4" aria-hidden="true" /> {formatDate(post.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="text-brand size-4" aria-hidden="true" /> {readingMinutes(post.content)} dk okuma
            </span>
          </p>
        </Reveal>

        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_url}
            alt=""
            className="border-ink shadow-hard-lg mt-8 aspect-video w-full rounded-[2rem] border-4 object-cover"
          />
        )}

        <RichContent doc={post.content} className="mt-10" />

        <div className="border-line mt-12 border-t-2 pt-6">
          <ShareBar title={post.title} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-paws border-ink bg-mist mt-10 border-y-2 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-extrabold">{relatedTitle}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
