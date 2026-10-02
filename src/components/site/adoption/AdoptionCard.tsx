import { Mars, Scissors, Syringe, Venus } from "lucide-react";
import Link from "next/link";
import { CatFace } from "@/components/pets/CatFace";
import { DogFace } from "@/components/pets/DogFace";
import type { Adoption } from "@/lib/data";
import { ageGroupOptions, labelOf } from "@/lib/options";

export function adoptionPhoto(animal: Pick<Adoption, "cover_url" | "photos">) {
  return animal.cover_url || animal.photos[0] || null;
}

export function PetPlaceholder({ species, className = "" }: { species: string; className?: string }) {
  return (
    <div
      className={`bg-paws-light grid size-full place-items-end justify-center ${species === "kopek" ? "bg-ink" : "bg-brand"} ${className}`}
    >
      {species === "kopek" ? <DogFace paws className="w-3/4" /> : <CatFace paws className="w-3/4" />}
    </div>
  );
}

export function AdoptionCard({ animal }: { animal: Adoption }) {
  const photo = adoptionPhoto(animal);
  const adopted = animal.status === "sahiplendirildi";

  return (
    <Link
      href={`/sahiplendirme/${animal.id}`}
      className="card group block h-full overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-0.5deg]"
    >
      <div className="border-ink relative aspect-[4/5] overflow-hidden border-b-2">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={animal.name}
            loading="lazy"
            className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${adopted ? "saturate-50" : ""}`}
          />
        ) : (
          <PetPlaceholder species={animal.species} />
        )}

        {animal.status !== "sahiplendirilebilir" && (
          <span
            className={`sticker shadow-hard-sm absolute top-3 right-3 rotate-6 ${adopted ? "bg-brand text-paper" : "bg-paper text-ink"}`}
          >
            {adopted ? "Yuvasını buldu ♥" : "Rezerve"}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display truncate text-2xl leading-tight font-extrabold">{animal.name}</h3>
          {animal.sex && (
            <span
              className="border-ink grid size-8 shrink-0 place-items-center rounded-full border-2"
              title={animal.sex === "disi" ? "Dişi" : "Erkek"}
            >
              {animal.sex === "disi" ? (
                <Venus className="text-brand size-4" aria-label="Dişi" />
              ) : (
                <Mars className="size-4" aria-label="Erkek" />
              )}
            </span>
          )}
        </div>
        <p className="text-ink-soft mt-0.5 text-sm font-bold">
          {[labelOf(ageGroupOptions, animal.age_group), animal.age_text].filter(Boolean).join(" · ") || " "}
        </p>
        {(animal.vaccinated || animal.neutered) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {animal.vaccinated && (
              <span className="bg-mist inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
                <Syringe className="text-brand size-3.5" aria-hidden="true" /> Aşılı
              </span>
            )}
            {animal.neutered && (
              <span className="bg-mist inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
                <Scissors className="text-brand size-3.5" aria-hidden="true" /> Kısır
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
