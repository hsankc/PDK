"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import type { Fact } from "@/lib/data";
import { factCategoryOptions } from "@/lib/options";
import { FactCard } from "./FactCard";

/** Konuya göre filtrelenen bilgi kartları. */
export function FactsBoard({ facts }: { facts: Fact[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [order, setOrder] = useState<string[] | null>(null);
  const categories = factCategoryOptions.filter((option) => facts.some((fact) => fact.category === option.value));

  const filtered = category ? facts.filter((fact) => fact.category === category) : facts;
  const visible = order ? [...filtered].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)) : filtered;

  const shuffle = () => {
    const ids = facts.map((fact) => fact.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setOrder(ids);
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {categories.length > 1 &&
          [{ value: null, label: "Hepsi" }, ...categories].map((option) => (
            <button
              key={option.value ?? "hepsi"}
              type="button"
              onClick={() => setCategory(option.value)}
              aria-pressed={category === option.value}
              className={`rounded-full border-2 px-4 py-1.5 font-bold transition-colors ${
                category === option.value ? "bg-ink text-paper border-ink" : "border-ink/20 hover:border-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        <button type="button" onClick={shuffle} className="btn btn-white btn-sm ml-auto">
          <Shuffle className="size-4" aria-hidden="true" /> Karıştır
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((fact, index) => (
          <FactCard key={fact.id} fact={fact} index={index} />
        ))}
      </div>
    </>
  );
}
