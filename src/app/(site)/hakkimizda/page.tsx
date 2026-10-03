import { ArrowRight, ExternalLink, Eye, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getMilestones, type Milestone } from "@/lib/data";
import { formatDay } from "@/lib/format";
import { getSettings, paragraphs } from "@/lib/settings";
import { safeHref } from "@/lib/url";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const [settings, milestones] = await Promise.all([getSettings(), getMilestones()]);
  const text = paragraphs(settings.about_text);
  const hasContent = text.length > 0 || settings.mission || settings.vision || milestones.length > 0;

  return (
    <>
      <PageHeader eyebrow="Biz kimiz?" title={settings.about_title || "Hakkımızda"} />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {!hasContent && <EmptyState title="Bu sayfa yakında dolacak">Kulübümüzü anlatan yazı hazırlanıyor.</EmptyState>}

        {text.length > 0 && (
          <Reveal className={`grid gap-12 ${settings.about_image_url ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}>
            <div className="prose-club max-w-3xl">
              {text.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-ink text-xl font-bold" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
            {settings.about_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.about_image_url}
                alt=""
                className="border-ink shadow-hard-lg aspect-[4/5] w-full -rotate-2 rounded-[2rem] border-4 object-cover"
              />
            )}
          </Reveal>
        )}

        {(settings.mission || settings.vision) && (
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {settings.mission && (
              <Reveal className="card bg-brand text-paper p-8">
                <Target className="mb-4 size-10" aria-hidden="true" />
                <h2 className="font-display text-3xl font-extrabold">Misyonumuz</h2>
                <p className="text-paper/90 mt-3 text-lg whitespace-pre-line">{settings.mission}</p>
              </Reveal>
            )}
            {settings.vision && (
              <Reveal delay={0.1} className="card bg-ink text-paper shadow-hard-red p-8">
                <Eye className="text-brand mb-4 size-10" aria-hidden="true" />
                <h2 className="font-display text-3xl font-extrabold">Vizyonumuz</h2>
                <p className="text-paper/90 mt-3 text-lg whitespace-pre-line">{settings.vision}</p>
              </Reveal>
            )}
          </div>
        )}

        {milestones.length > 0 && (
          <section className="mt-20" id="tarihce">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Tarihçemiz</h2>
            {settings.history_intro && (
              <p className="text-ink-soft mt-3 max-w-2xl text-lg whitespace-pre-line">{settings.history_intro}</p>
            )}
            <ol className="border-ink relative mt-10 ml-3 space-y-10 border-l-4 sm:ml-6">
              {milestones.map((milestone, index) => (
                <MilestoneItem key={milestone.id} milestone={milestone} index={index} />
              ))}
            </ol>
          </section>
        )}

        <Reveal className="mt-16 flex flex-wrap gap-3">
          <Link href="/ekibimiz" className="btn btn-black">
            Ekibimizle tanış <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          {settings.membership_open && (
            <Link href="/katil" className="btn btn-red">
              Kulübe Katıl
            </Link>
          )}
        </Reveal>
      </div>
    </>
  );
}

function MilestoneItem({ milestone, index }: { milestone: Milestone; index: number }) {
  const link = safeHref(milestone.link_url);

  return (
    <li className="relative pl-8 sm:pl-12">
      <span
        className={`border-ink absolute top-1 -left-[0.9rem] size-6 rounded-full border-4 ${
          index % 2 ? "bg-ink" : "bg-brand"
        }`}
        aria-hidden="true"
      />
      <Reveal className={`grid gap-5 ${milestone.image_url ? "md:grid-cols-[1.4fr_1fr]" : ""}`}>
        <div>
          <p className="text-brand font-display text-lg font-extrabold">
            {formatDay(milestone.happened_on, { day: undefined })}
          </p>
          <h3 className="font-display text-2xl leading-tight font-extrabold sm:text-3xl">{milestone.title}</h3>
          {milestone.description && (
            <p className="text-ink-soft mt-2 text-lg whitespace-pre-line">{milestone.description}</p>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand mt-3 inline-flex items-center gap-1.5 font-bold underline underline-offset-4"
            >
              Haberi oku <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
        {milestone.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={milestone.image_url}
            alt=""
            loading="lazy"
            className={`border-ink shadow-hard aspect-[4/3] w-full rounded-2xl border-2 object-cover ${
              index % 2 ? "rotate-1" : "-rotate-1"
            }`}
          />
        )}
      </Reveal>
    </li>
  );
}
