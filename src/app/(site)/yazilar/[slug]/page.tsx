import { notFound } from "next/navigation";
import { ArticleView, articleMetadata } from "@/components/site/ArticleView";
import { getPost, getPosts } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/yazilar/[slug]">) {
  const { slug } = await params;
  return articleMetadata(await getPost("yazi", slug));
}

export default async function PostPage({ params }: PageProps<"/yazilar/[slug]">) {
  const { slug } = await params;
  const [post, latest] = await Promise.all([getPost("yazi", slug), getPosts("yazi", 4)]);
  if (!post) notFound();

  return (
    <ArticleView
      post={post}
      back={{ href: "/yazilar", label: "Tüm yazılar" }}
      related={latest.filter((item) => item.id !== post.id).slice(0, 3)}
      relatedTitle="Diğer yazılar"
    />
  );
}
