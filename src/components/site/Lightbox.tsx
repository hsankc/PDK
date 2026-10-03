"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export type LightboxPhoto = { src: string; caption?: string | null; credit?: string | null };

/** Tam ekran fotoğraf görüntüleyici. index null ise kapalıdır. Ok tuşları ve Esc ile kullanılır. */
export function Lightbox({
  photos,
  index,
  onChange,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const open = index !== null && photos.length > 0;
  const count = photos.length;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onChange(null);
      if (event.key === "ArrowLeft") onChange(((index ?? 0) - 1 + count) % count);
      if (event.key === "ArrowRight") onChange(((index ?? 0) + 1) % count);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, index, count, onChange]);

  if (index === null || !photos[index]) return null;
  const photo = photos[index];
  const go = (step: number) => onChange((index + step + count) % count);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fotoğraf görüntüleyici"
      className="bg-ink/95 fixed inset-0 z-[100] flex flex-col"
      onClick={() => onChange(null)}
    >
      <div className="text-paper flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-sm font-bold">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Kapat"
          className="border-paper/40 hover:bg-paper hover:text-ink grid size-11 place-items-center rounded-full border-2 transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        <motion.img
          key={photo.src}
          src={photo.src}
          alt={photo.caption ?? ""}
          onClick={(event) => event.stopPropagation()}
          className="max-h-full max-w-full rounded-xl object-contain"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                go(-1);
              }}
              aria-label="Önceki fotoğraf"
              className="bg-paper border-ink absolute left-2 grid size-11 place-items-center rounded-full border-2 sm:left-4"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                go(1);
              }}
              aria-label="Sonraki fotoğraf"
              className="bg-paper border-ink absolute right-2 grid size-11 place-items-center rounded-full border-2 sm:right-4"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      <div className="text-paper min-h-14 px-4 py-3 text-center">
        {photo.caption && <p className="font-bold">{photo.caption}</p>}
        {photo.credit && <p className="text-paper/70 text-sm">📷 {photo.credit}</p>}
      </div>
    </div>,
    document.body,
  );
}
