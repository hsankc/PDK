import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { postHref } from "@/components/site/PostCard";
import { Reveal } from "@/components/site/Reveal";
import { getPosts } from "@/lib/data";
import { autoExcerpt, readingMinutes } from "@/lib/richtext";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Rehberler" };

export default async function GuidesPage() {
  const [settings, guides] = await Promise.all([getSettings(), getPosts("rehber")]);

  return (
    <>
      <PageHeader eyebrow="Nasıl yardım ederim?" title="Rehberler">
        {settings.guides_intro ? (
          <p className="whitespace-pre-line">{settings.guides_intro}</p>
        ) : (
          <p>Yaralı bir hayvan, sahipsiz bir yavru ya da soğuk bir kış gecesi… Ne yapacağını adım adım anlattık.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {guides.length === 0 ? (
          <EmptyState title="Rehberler yakında">Adım adım yardım rehberlerini burada paylaşacağız.</EmptyState>
        ) : (
          <ol className="space-y-5">
            {guides.map((guide, index) => (
              <li key={guide.id}>
                <Reveal delay={Math.min(index, 4) * 0.05}>
                  <Link
                    href={postHref(guide)}
                    className="card group flex items-stretch overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                  >
                    <span className="bg-brand text-paper border-ink font-display grid w-20 shrink-0 place-items-center border-r-2 text-4xl font-extrabold sm:w-24 sm:text-5xl">
                      {index + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
                      <span className="font-display group-hover:text-brand text-2xl leading-tight font-extrabold transition-colors">
                        {guide.title}
                      </span>
                      <span className="text-ink-soft mt-2 line-clamp-2">
                        {guide.excerpt || autoExcerpt(guide.content, 160)}
                      </span>
                      <span className="text-ink-soft mt-3 flex items-center gap-1.5 text-sm font-bold">
                        <Clock className="text-brand size-4" aria-hidden="true" /> {readingMinutes(guide.content)} dk
                      </span>
                    </span>
                    {guide.cover_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={guide.cover_url}
                        alt=""
                        loading="lazy"
                        className="border-ink hidden w-44 shrink-0 border-l-2 object-cover sm:block"
                      />
                    )}
                    <span className="hidden items-center pr-5 sm:flex">
                      <ArrowRight className="text-ink/40 size-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
