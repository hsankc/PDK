"use client";

import { Lightbulb, RotateCw } from "lucide-react";
import { useState } from "react";
import type { Fact } from "@/lib/data";
import { factCategoryOptions, labelOf } from "@/lib/options";

const tones = ["bg-paper", "bg-brand text-paper", "bg-ink text-paper"];

/** Ön yüzde bilgi, arkada açıklaması; tıklanınca döner. */
export function FactCard({ fact, index }: { fact: Fact; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const tone = tones[index % tones.length];
  const canFlip = Boolean(fact.body);

  const front = (
    <div className={`card flex h-full min-h-56 flex-col gap-4 p-6 backface-hidden ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="sticker bg-paper text-ink text-xs">{labelOf(factCategoryOptions, fact.category)}</span>
        <Lightbulb className="size-6 opacity-70" aria-hidden="true" />
      </div>
      {fact.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fact.image_url}
          alt=""
          loading="lazy"
          className="border-ink aspect-video rounded-xl border-2 object-cover"
        />
      )}
      <p className="font-display text-2xl leading-tight font-extrabold">{fact.title}</p>
      {canFlip && (
        <span className="mt-auto flex items-center gap-1.5 text-sm font-bold opacity-70">
          <RotateCw className="size-4" aria-hidden="true" /> Çevir, devamını oku
        </span>
      )}
    </div>
  );

  if (!canFlip) return front;

  return (
    <button
      type="button"
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={flipped ? `${fact.title}: ön yüze dön` : `${fact.title}: açıklamayı göster`}
      className="group block h-full w-full text-left perspective-distant"
    >
      <span
        className={`grid h-full transition-transform duration-500 transform-3d ${flipped ? "rotate-y-180" : "group-hover:-translate-y-1"}`}
      >
        <span className="[grid-area:1/1]">{front}</span>
        <span className="rotate-y-180 [grid-area:1/1] backface-hidden">
          <span className="card bg-mist flex h-full min-h-56 flex-col gap-3 p-6">
            <span className="font-display text-brand text-lg leading-tight font-extrabold">{fact.title}</span>
            <span className="text-ink-soft whitespace-pre-line">{fact.body}</span>
            <span className="text-ink-soft mt-auto flex items-center gap-1.5 text-sm font-bold">
              <RotateCw className="size-4" aria-hidden="true" /> Geri çevir
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
