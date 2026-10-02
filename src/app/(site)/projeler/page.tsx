import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { getProjects, type Project } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Projelerimiz" };

const sections: { status: Project["status"]; title: string }[] = [
  { status: "devam", title: "Devam edenler" },
  { status: "planlaniyor", title: "Planladıklarımız" },
  { status: "tamamlandi", title: "Tamamladıklarımız" },
];

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);

  return (
    <>
      <PageHeader eyebrow="Çalışmalarımız" title="Projelerimiz">
        {settings.projects_intro ? (
          <p className="whitespace-pre-line">{settings.projects_intro}</p>
        ) : (
          <p>Kampüsteki ve şehirdeki dostlarımız için hayata geçirdiğimiz projeler.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6">
        {projects.length === 0 && (
          <EmptyState title="Projeler yakında">Yürüttüğümüz projeleri burada paylaşacağız.</EmptyState>
        )}

        {sections.map(({ status, title }) => {
          const items = projects.filter((project) => project.status === status);
          if (!items.length) return null;
          return (
            <section key={status}>
              <Reveal>
                <h2 className="font-display text-3xl font-extrabold">{title}</h2>
              </Reveal>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project, index) => (
                  <Reveal key={project.id} delay={(index % 3) * 0.08}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
