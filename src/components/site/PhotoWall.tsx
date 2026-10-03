"use client";

import { useState } from "react";
import { Lightbox, type LightboxPhoto } from "./Lightbox";

export type WallPhoto = LightboxPhoto & { album?: string | null };

/** Taşlı duvar düzeninde fotoğraflar; tıklanınca büyür. Birden çok albüm varsa filtre çıkar. */
export function PhotoWall({ photos, filterable = false }: { photos: WallPhoto[]; filterable?: boolean }) {
  const albums = filterable
    ? [...new Set(photos.map((photo) => photo.album?.trim()).filter((album): album is string => Boolean(album)))]
    : [];
  const [album, setAlbum] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const visible = album ? photos.filter((photo) => photo.album?.trim() === album) : photos;

  return (
    <>
      {albums.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Albümler">
          {[null, ...albums].map((name) => (
            <button
              key={name ?? "hepsi"}
              type="button"
              onClick={() => {
                setAlbum(name);
                setOpen(null);
              }}
              aria-pressed={album === name}
              className={`rounded-full border-2 px-4 py-1.5 font-bold transition-colors ${
                album === name ? "bg-ink text-paper border-ink" : "border-ink/20 hover:border-ink"
              }`}
            >
              {name ?? "Tümü"}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {visible.map((photo, index) => (
          <button
            key={`${photo.src}-${index}`}
            type="button"
            onClick={() => setOpen(index)}
            className={`group border-ink shadow-hard-sm relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border-2 transition-transform duration-200 hover:-translate-y-1 sm:mb-4 ${
              index % 3 === 1 ? "hover:rotate-1" : "hover:-rotate-1"
            }`}
            aria-label={photo.caption ? `${photo.caption} fotoğrafını büyüt` : `${index + 1}. fotoğrafı büyüt`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt="" loading="lazy" className="bg-mist min-h-32 w-full" />
            {(photo.caption || photo.credit) && (
              <span className="from-ink/85 text-paper absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent px-3 pt-8 pb-2 text-left text-sm font-bold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.caption ?? `📷 ${photo.credit}`}
              </span>
            )}
          </button>
        ))}
      </div>

      <Lightbox photos={visible} index={open} onChange={setOpen} />
    </>
  );
}
