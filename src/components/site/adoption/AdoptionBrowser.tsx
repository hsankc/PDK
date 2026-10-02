"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Adoption } from "@/lib/data";
import type { Option } from "@/lib/admin/types";
import { ageGroupOptions, sexOptions, speciesOptions } from "@/lib/options";
import { AdoptionCard } from "./AdoptionCard";

type Filters = { species: string; sex: string; age_group: string };

/** Yuva arayan dostlar: tür / cinsiyet / yaş filtreleriyle. */
export function AdoptionBrowser({ animals }: { animals: Adoption[] }) {
  const [filters, setFilters] = useState<Filters>({ species: "", sex: "", age_group: "" });

  // Sadece ilanlarda gerçekten olan seçenekleri göster
  const present = (key: keyof Filters, options: Option[]) =>
    options.filter((option) => animals.some((animal) => animal[key] === option.value));

  const groups = [
    { key: "species" as const, label: "Tür", options: present("species", speciesOptions) },
    { key: "sex" as const, label: "Cinsiyet", options: present("sex", sexOptions) },
    { key: "age_group" as const, label: "Yaş", options: present("age_group", ageGroupOptions) },
  ].filter((group) => group.options.length > 1);

  const visible = animals.filter((animal) =>
    (Object.keys(filters) as (keyof Filters)[]).every((key) => !filters[key] || animal[key] === filters[key]),
  );

  return (
    <div>
      {groups.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-x-8 gap-y-4">
          {groups.map((group) => (
            <div key={group.key} role="group" aria-label={group.label} className="flex flex-wrap items-center gap-2">
              <span className="text-ink/50 mr-1 text-xs font-extrabold tracking-widest uppercase">{group.label}</span>
              {[{ value: "", label: "Tümü" }, ...group.options].map((option) => {
                const active = filters[group.key] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters((current) => ({ ...current, [group.key]: option.value }))}
                    className={`sticker text-sm transition-colors ${active ? "bg-ink text-paper" : "hover:bg-mist"}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-ink-soft py-12 text-center text-lg font-bold">Bu filtreye uyan dostumuz yok.</p>
      ) : (
        <motion.ul layout className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((animal) => (
              <motion.li
                key={animal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <AdoptionCard animal={animal} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
