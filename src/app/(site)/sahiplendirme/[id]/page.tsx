import { ArrowLeft, Check, HeartHandshake, MapPin, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adoptionPhoto, PetPlaceholder } from "@/components/site/adoption/AdoptionCard";
import { AdoptionForm } from "@/components/site/forms/AdoptionForm";
import { Gallery } from "@/components/site/Gallery";
import { Reveal } from "@/components/site/Reveal";
import { getAdoption } from "@/lib/data";
import { adoptionStatusOptions, ageGroupOptions, labelOf, sexOptions, speciesOptions } from "@/lib/options";
import { getSettings, paragraphs } from "@/lib/settings";

export async function generateMetadata({ params }: PageProps<"/sahiplendirme/[id]">): Promise<Metadata> {
  const { id } = await params;
  const animal = await getAdoption(id);
  if (!animal) return { title: "İlan bulunamadı" };
  const photo = adoptionPhoto(animal);
  return {
    title: `${animal.name} yuva arıyor`,
    description: animal.description?.slice(0, 160) || undefined,
    openGraph: photo ? { images: [photo] } : undefined,
  };
}

export default async function AdoptionPage({ params }: PageProps<"/sahiplendirme/[id]">) {
  const { id } = await params;
  const [animal, settings] = await Promise.all([getAdoption(id), getSettings()]);
  if (!animal) notFound();

  const photos = [animal.cover_url, ...animal.photos].filter((url, index, all): url is string =>
    Boolean(url && all.indexOf(url) === index),
  );
  const traits = (animal.traits ?? "")
    .split(",")
    .map((trait) => trait.trim())
    .filter(Boolean);
  const facts = [
    labelOf(speciesOptions, animal.species),
    labelOf(sexOptions, animal.sex),
    labelOf(ageGroupOptions, animal.age_group),
    animal.age_text,
  ].filter(Boolean);
  const terms = (settings.adoption_terms ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);
  const available = animal.status === "sahiplendirilebilir";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/sahiplendirme"
        className="text-ink-soft hover:text-ink mb-6 inline-flex items-center gap-1.5 font-bold"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Tüm dostlarımız
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          {photos.length > 0 ? (
            <Gallery photos={photos} alt={animal.name} />
          ) : (
            <div className="card aspect-[4/5] overflow-hidden">
              <PetPlaceholder species={animal.species} />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className={`sticker mb-4 -rotate-2 ${available ? "bg-brand text-paper" : "bg-ink text-paper"} shadow-hard-sm`}
          >
            {labelOf(adoptionStatusOptions, animal.status)}
          </p>
          <h1 className="font-display text-5xl leading-none font-extrabold sm:text-6xl">{animal.name}</h1>
          {facts.length > 0 && <p className="text-ink-soft mt-3 text-lg font-bold">{facts.join(" · ")}</p>}

          {traits.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {traits.map((trait) => (
                <li key={trait} className="sticker bg-brand-soft border-brand text-brand-dark">
                  {trait}
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            <HealthItem ok={animal.vaccinated} label="Aşıları yapıldı" />
            <HealthItem ok={animal.neutered} label="Kısırlaştırıldı" />
          </ul>
          {animal.health_notes && (
            <p className="text-ink-soft mt-3 text-sm whitespace-pre-line">{animal.health_notes}</p>
          )}
          {animal.location && (
            <p className="mt-4 flex items-center gap-2 font-bold">
              <MapPin className="text-brand size-5" aria-hidden="true" /> {animal.location}
            </p>
          )}

          {animal.description && (
            <div className="prose-club mt-8">
              {paragraphs(animal.description).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {available && (
            <a href="#basvuru" className="btn btn-red mt-8 px-7 py-3.5 text-lg">
              <HeartHandshake className="size-5" aria-hidden="true" /> {animal.name} için başvur
            </a>
          )}
        </Reveal>
      </div>

      <section id="basvuru" className="mx-auto mt-20 max-w-3xl scroll-mt-24">
        {available ? (
          <>
            <h2 className="font-display text-4xl font-extrabold">Sahiplenme başvurusu</h2>
            {terms.length > 0 && (
              <div className="card bg-mist mt-6 p-6 shadow-none">
                <h3 className="font-display text-xl font-extrabold">Sahiplendirme şartlarımız</h3>
                <ul className="mt-3 space-y-2">
                  {terms.map((term) => (
                    <li key={term} className="flex gap-2.5">
                      <Check className="text-brand mt-1 size-4 shrink-0" aria-hidden="true" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6">
              <AdoptionForm adoptionId={animal.id} animalName={animal.name} />
            </div>
          </>
        ) : (
          <div className="card p-8 text-center">
            <p className="font-display text-2xl font-extrabold">
              {animal.status === "rezerve"
                ? `${animal.name} için bir aileyle görüşüyoruz.`
                : `${animal.name} yuvasına kavuştu!`}
            </p>
            <p className="text-ink-soft mt-2">Yuva arayan diğer dostlarımıza göz atabilirsin.</p>
            <Link href="/sahiplendirme" className="btn btn-black mt-6">
              Diğer dostlarımız
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function HealthItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 font-bold ${
        ok ? "border-ink bg-paper" : "border-ink/20 text-ink/40"
      }`}
    >
      <span
        className={`grid size-6 place-items-center rounded-full ${ok ? "bg-brand text-paper" : "bg-mist text-ink/40"}`}
      >
        {ok ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
      </span>
      {label}
      <span className="sr-only">{ok ? "(evet)" : "(hayır)"}</span>
    </li>
  );
}
