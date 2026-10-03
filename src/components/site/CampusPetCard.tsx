"use client";

import { Images, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { CatFace } from "@/components/pets/CatFace";
import { DogFace } from "@/components/pets/DogFace";
import type { CampusPet } from "@/lib/data";
import { Lightbox } from "./Lightbox";

export function CampusPetCard({ pet, index }: { pet: CampusPet; index: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const photos = [pet.photo_url, ...pet.photos]
    .filter((url, i, all): url is string => Boolean(url && all.indexOf(url) === i))
    .map((src) => ({ src, caption: pet.name }));
  const tilt = index % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1";

  return (
    <article
      className={`card group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${tilt}`}
    >
      <div className="border-ink relative aspect-square overflow-hidden border-b-2">
        {photos.length > 0 ? (
          <button
            type="button"
            onClick={() => setOpen(0)}
            className="size-full"
            aria-label={`${pet.name} fotoğrafları`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[0].src}
              alt={pet.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {photos.length > 1 && (
              <span className="bg-ink/75 text-paper absolute right-3 bottom-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
                <Images className="size-3.5" aria-hidden="true" /> {photos.length}
              </span>
            )}
          </button>
        ) : (
          <div
            className={`bg-paws-light grid size-full place-items-end justify-center ${index % 2 ? "bg-ink" : "bg-brand"}`}
          >
            {pet.species === "kopek" ? <DogFace paws className="w-3/4" /> : <CatFace paws className="w-3/4" />}
          </div>
        )}
        {pet.title && (
          <span className="sticker bg-paper shadow-hard-sm absolute top-3 left-3 max-w-[85%] -rotate-2 text-sm">
            {pet.title}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-2xl leading-tight font-extrabold">{pet.name}</h3>
        {(pet.zodiac || pet.favorite_spot) && (
          <ul className="text-ink-soft space-y-1 text-sm font-bold">
            {pet.zodiac && (
              <li className="flex items-center gap-1.5">
                <Sparkles className="text-brand size-4 shrink-0" aria-hidden="true" /> {pet.zodiac} burcu
              </li>
            )}
            {pet.favorite_spot && (
              <li className="flex items-center gap-1.5">
                <MapPin className="text-brand size-4 shrink-0" aria-hidden="true" /> {pet.favorite_spot}
              </li>
            )}
          </ul>
        )}
        {pet.personality && <p className="text-ink-soft whitespace-pre-line">{pet.personality}</p>}
      </div>

      <Lightbox photos={photos} index={open} onChange={setOpen} />
    </article>
  );
}
