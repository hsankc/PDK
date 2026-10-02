import { notFound } from "next/navigation";
import { ArticleView, articleMetadata } from "@/components/site/ArticleView";
import { getPost, getPosts } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/rehberler/[slug]">) {
  const { slug } = await params;
  return articleMetadata(await getPost("rehber", slug));
}

export default async function GuidePage({ params }: PageProps<"/rehberler/[slug]">) {
  const { slug } = await params;
  const [guide, guides] = await Promise.all([getPost("rehber", slug), getPosts("rehber")]);
  if (!guide) notFound();

  return (
    <ArticleView
      post={guide}
      back={{ href: "/rehberler", label: "Tüm rehberler" }}
      related={guides.filter((item) => item.id !== guide.id).slice(0, 3)}
      relatedTitle="Diğer rehberler"
    />
  );
}
