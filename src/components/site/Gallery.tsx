"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

/** Büyük fotoğraf + küçük resimler; oklarla gezilir. */
export function Gallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const go = (step: number) => setIndex((current) => (current + step + count) % count);

  return (
    <div
      className="space-y-3"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(-1);
        if (event.key === "ArrowRight") go(1);
      }}
    >
      <div className="card relative aspect-[4/5] overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={photos[index]}
            src={photos[index]}
            alt={`${alt} (${index + 1}/${count})`}
            className="absolute inset-0 size-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Önceki fotoğraf"
              className="bg-paper border-ink absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border-2"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Sonraki fotoğraf"
              className="bg-paper border-ink absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border-2"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="bg-ink/70 text-paper absolute right-3 bottom-3 rounded-full px-2.5 py-1 text-xs font-bold">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}. fotoğraf`}
              aria-current={i === index}
              className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:size-20 ${
                i === index ? "border-brand shadow-hard-sm" : "border-ink/20 opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
