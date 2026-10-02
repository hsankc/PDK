import { ArrowRight, Eye, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getSettings, paragraphs } from "@/lib/settings";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const settings = await getSettings();
  const text = paragraphs(settings.about_text);
  const hasContent = text.length > 0 || settings.mission || settings.vision;

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
