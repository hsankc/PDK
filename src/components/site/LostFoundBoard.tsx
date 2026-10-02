"use client";

import { CalendarDays, Heart, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { LostFound } from "@/lib/data";
import { formatDay } from "@/lib/format";
import { labelOf, speciesOptions } from "@/lib/options";
import { PetPlaceholder } from "./adoption/AdoptionCard";

type Tab = "kayip" | "bulundu" | "kavustu";

const TABS: { id: Tab; label: string; empty: string }[] = [
  { id: "kayip", label: "Kayıplar", empty: "Şu an kayıp ilanı yok." },
  { id: "bulundu", label: "Sahibi aranıyor", empty: "Şu an sahibini arayan bir dost yok." },
  { id: "kavustu", label: "Kavuşanlar", empty: "Kavuşma hikâyeleri burada görünecek." },
];

const tabOf = (item: LostFound): Tab => (item.status === "kavustu" ? "kavustu" : item.kind);

/** İletişim metnindeki telefon numarasını bulur (arama düğmesi için). */
function phoneIn(contact: string | null) {
  const match = contact?.match(/\+?\d[\d\s()-]{8,}\d/);
  return match ? match[0].replace(/[^\d+]/g, "") : null;
}

export function LostFoundBoard({ items }: { items: LostFound[] }) {
  const counts = Object.fromEntries(TABS.map((tab) => [tab.id, items.filter((item) => tabOf(item) === tab.id).length]));
  const [tab, setTab] = useState<Tab>(TABS.find((t) => counts[t.id] > 0)?.id ?? "kayip");
  const visible = items.filter((item) => tabOf(item) === tab);

  return (
    <div>
      <div role="tablist" aria-label="İlan türü" className="mb-8 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`sticker text-base transition-colors ${tab === item.id ? "bg-ink text-paper" : "hover:bg-mist"}`}
          >
            {item.label}
            <span
              className={`rounded-full px-2 text-xs ${tab === item.id ? "bg-brand text-paper" : "bg-mist text-ink-soft"}`}
            >
              {counts[item.id]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-ink-soft py-10 text-center text-lg font-bold">{TABS.find((t) => t.id === tab)?.empty}</p>
      ) : (
        <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
              >
                <LostFoundCard item={item} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

function LostFoundCard({ item }: { item: LostFound }) {
  const reunited = item.status === "kavustu";
  const phone = reunited ? null : phoneIn(item.contact);
  const name = item.animal_name || `İsimsiz ${labelOf(speciesOptions, item.species).toLocaleLowerCase("tr-TR")}`;
  const badge = reunited
    ? { text: "Kavuştu ♥", tone: "bg-brand text-paper" }
    : item.kind === "kayip"
      ? { text: "KAYIP", tone: "bg-brand text-paper" }
      : { text: "BULUNDU", tone: "bg-ink text-paper" };

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="border-ink relative aspect-[4/3] overflow-hidden border-b-2">
        {item.photo_url || item.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.photo_url || item.photos[0]} alt={name} loading="lazy" className="size-full object-cover" />
        ) : (
          <PetPlaceholder species={item.species} />
        )}
        <span className={`sticker shadow-hard-sm absolute top-3 left-3 -rotate-3 ${badge.tone}`}>{badge.text}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-tight font-extrabold">{name}</h3>
        <ul className="text-ink-soft mt-2 space-y-1 text-sm font-bold">
          {item.area && (
            <li className="flex items-center gap-1.5">
              <MapPin className="text-brand size-4 shrink-0" aria-hidden="true" /> {item.area}
            </li>
          )}
          {item.seen_on && (
            <li className="flex items-center gap-1.5">
              <CalendarDays className="text-brand size-4 shrink-0" aria-hidden="true" /> {formatDay(item.seen_on)}
            </li>
          )}
        </ul>
        {item.description && <p className="text-ink-soft mt-3 whitespace-pre-line">{item.description}</p>}
        {reunited ? (
          <p className="text-brand mt-auto flex items-center gap-1.5 pt-4 font-bold">
            <Heart className="size-4 fill-current" aria-hidden="true" /> Mutlu son!
          </p>
        ) : (
          item.contact && (
            <div className="mt-auto pt-4">
              <p className="text-sm font-bold">{item.contact}</p>
              {phone && (
                <a href={`tel:${phone}`} className="btn btn-red btn-sm mt-2">
                  <Phone className="size-4" aria-hidden="true" /> Ara
                </a>
              )}
            </div>
          )
        )}
      </div>
    </article>
  );
}
