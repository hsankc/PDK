import type { MetadataRoute } from "next";
import { getAdoptions, getEvents, getPosts, getProjects } from "@/lib/data";
import { navItems, isGroup } from "@/lib/nav";
import { SITE_URL } from "@/lib/site-url";

/** Arama motorları için sayfa listesi: menüdeki sayfalar + etkinlik, ilan, proje, yazı ve rehberler. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, adoptions, projects, posts, guides] = await Promise.all([
    getEvents(),
    getAdoptions(),
    getProjects(),
    getPosts("yazi"),
    getPosts("rehber"),
  ]);

  const staticPaths = new Set<string>(["/", "/katil", "/kvkk"]);
  for (const item of navItems) {
    if (isGroup(item)) item.children.forEach((child) => staticPaths.add(child.href));
    else staticPaths.add(item.href);
  }

  const url = (path: string) => `${SITE_URL}${path}`;
  return [
    ...[...staticPaths].map((path) => ({
      url: url(path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...events.map((event) => ({ url: url(`/etkinlikler/${event.id}`), lastModified: event.starts_at, priority: 0.6 })),
    ...adoptions.map((animal) => ({ url: url(`/sahiplendirme/${animal.id}`), priority: 0.8 })),
    ...projects.map((project) => ({ url: url(`/projeler/${project.id}`), priority: 0.6 })),
    ...posts.map((post) => ({ url: url(`/yazilar/${post.slug}`), lastModified: post.published_at, priority: 0.6 })),
    ...guides.map((guide) => ({ url: url(`/rehberler/${guide.slug}`), priority: 0.7 })),
  ];
}
