import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { PostCard } from "@/components/site/PostCard";
import { Reveal } from "@/components/site/Reveal";
import { getPosts } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Yazı Köşesi" };

export default async function PostsPage() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts("yazi")]);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader eyebrow="Blog" title="Yazı Köşesi">
        {settings.posts_intro ? (
          <p className="whitespace-pre-line">{settings.posts_intro}</p>
        ) : (
          <p>Kulüpten haberler, anılar ve patili dostlarımızın hikâyeleri.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {!featured ? (
          <EmptyState title="İlk yazı yakında">Kulüpten haberleri ve hikâyeleri burada paylaşacağız.</EmptyState>
        ) : (
          <>
            <Reveal>
              <PostCard post={featured} featured />
            </Reveal>
            {rest.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, index) => (
                  <Reveal key={post.id} delay={(index % 3) * 0.08}>
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
