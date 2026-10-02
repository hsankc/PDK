import { ArrowLeft, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/site/Gallery";
import { ProgressBar } from "@/components/site/ProgressBar";
import { projectDates, projectStatusTone } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { getProject } from "@/lib/data";
import { labelOf, projectStatusOptions } from "@/lib/options";
import { paragraphs } from "@/lib/settings";

export async function generateMetadata({ params }: PageProps<"/projeler/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Proje bulunamadı" };
  return {
    title: project.title,
    description: project.summary ?? undefined,
    openGraph: project.cover_url ? { images: [project.cover_url] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projeler/[id]">) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const photos = [project.cover_url, ...project.photos].filter((url, index, all): url is string =>
    Boolean(url && all.indexOf(url) === index),
  );
  const dates = projectDates(project);
  const text = paragraphs(project.description);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/projeler" className="text-ink-soft hover:text-ink mb-6 inline-flex items-center gap-1.5 font-bold">
        <ArrowLeft className="size-4" aria-hidden="true" /> Tüm projeler
      </Link>

      <Reveal className="max-w-3xl">
        <p className={`sticker shadow-hard-sm mb-4 -rotate-2 ${projectStatusTone[project.status]}`}>
          {labelOf(projectStatusOptions, project.status)}
        </p>
        <h1 className="font-display text-4xl leading-tight font-extrabold sm:text-6xl">{project.title}</h1>
        {project.summary && <p className="text-ink-soft mt-4 text-xl">{project.summary}</p>}
        {dates && (
          <p className="mt-4 flex items-center gap-2 font-bold">
            <CalendarDays className="text-brand size-5" aria-hidden="true" /> {dates}
          </p>
        )}
        {project.status !== "planlaniyor" && (
          <div className="mt-6 max-w-md">
            <div className="mb-1.5 flex justify-between font-bold">
              <span>İlerleme</span>
              <span>%{project.progress}</span>
            </div>
            <ProgressBar percent={project.progress} label={`${project.title} ilerlemesi`} />
          </div>
        )}
      </Reveal>

      <div className={`mt-12 grid gap-10 ${photos.length ? "lg:grid-cols-[1fr_1.1fr]" : ""}`}>
        {photos.length > 0 && (
          <Reveal>
            <Gallery photos={photos} alt={project.title} />
          </Reveal>
        )}
        {text.length > 0 && (
          <Reveal delay={0.1} className="prose-club">
            {text.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Reveal>
        )}
      </div>
    </div>
  );
}
