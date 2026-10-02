import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { PawIcon } from "@/components/pets/PawIcon";
import type { Project } from "@/lib/data";
import { formatDay } from "@/lib/format";
import { labelOf, projectStatusOptions } from "@/lib/options";
import { ProgressBar } from "./ProgressBar";

export const projectStatusTone: Record<Project["status"], string> = {
  devam: "bg-brand text-paper",
  planlaniyor: "bg-paper text-ink",
  tamamlandi: "bg-ink text-paper",
};

export function projectDates(project: Pick<Project, "started_on" | "finished_on">) {
  const options = { day: undefined, month: "long", year: "numeric" } as const;
  const start = project.started_on ? formatDay(project.started_on, options) : "";
  const end = project.finished_on ? formatDay(project.finished_on, options) : "";
  if (start && end) return start === end ? start : `${start} – ${end}`;
  // Ek kullanmıyoruz ("Ekim 2026'dan"): ünlü uyumu kelimeye göre değişir
  if (start) return `Başlangıç: ${start}`;
  return end ? `Bitiş: ${end}` : "";
}

export function ProjectCard({ project }: { project: Project }) {
  const dates = projectDates(project);

  return (
    <Link
      href={`/projeler/${project.id}`}
      className="card group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="border-ink relative aspect-video overflow-hidden border-b-2">
        {project.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_url}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-brand bg-paws-light grid size-full place-items-center">
            <PawIcon className="fill-paper/90 size-20 -rotate-12" />
          </div>
        )}
        <span className={`sticker shadow-hard-sm absolute top-3 left-3 -rotate-2 ${projectStatusTone[project.status]}`}>
          {labelOf(projectStatusOptions, project.status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-tight font-extrabold">{project.title}</h3>
        {project.summary && <p className="text-ink-soft mt-2">{project.summary}</p>}
        {dates && (
          <p className="text-ink-soft mt-3 flex items-center gap-1.5 text-sm font-bold">
            <CalendarDays className="text-brand size-4" aria-hidden="true" /> {dates}
          </p>
        )}
        {project.status !== "planlaniyor" && (
          <div className="mt-auto pt-5">
            <div className="mb-1.5 flex justify-between text-sm font-bold">
              <span>İlerleme</span>
              <span>%{project.progress}</span>
            </div>
            <ProgressBar
              percent={project.progress}
              label={`${project.title} ilerlemesi`}
              size="sm"
              tone={project.status === "tamamlandi" ? "ink" : "brand"}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
