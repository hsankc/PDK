"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useFoundPaws } from "@/components/pets/PawHunt";
import { PawIcon } from "@/components/pets/PawIcon";
import { PAW_SPOTS } from "@/lib/paw-hunt";

/** Oyunlar sayfasında pati avı ilerlemesi ve ipuçları. */
export function PawHuntCard() {
  const found = useFoundPaws();
  const done = found.length === PAW_SPOTS.length;

  return (
    <div className="card bg-ink text-paper shadow-hard-red relative overflow-hidden p-6 sm:p-8">
      <PawIcon className="fill-paper/10 absolute -right-6 -bottom-8 size-40 -rotate-12" />
      <div className="relative">
        <p className="text-brand text-sm font-extrabold tracking-wider uppercase">Gizli pati avı</p>
        <h2 className="font-display mt-1 text-3xl font-extrabold">
          {done ? "Hepsini buldun! 🎉" : `${found.length} / ${PAW_SPOTS.length} pati bulundu`}
        </h2>
        <p className="text-paper/80 mt-2 max-w-xl">
          Sitenin {PAW_SPOTS.length} farklı sayfasına küçük patiler sakladık. Sayfa başlıklarındaki pati desenine
          dikkatli bak, birini görünce üstüne tıkla!
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {PAW_SPOTS.map((spot) => {
            const isFound = found.includes(spot.id);
            return (
              <li key={spot.id}>
                <Link
                  href={spot.href}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 font-bold transition-colors ${
                    isFound ? "border-brand bg-brand text-paper" : "border-paper/25 hover:border-paper"
                  }`}
                >
                  {isFound ? (
                    <Check className="size-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <PawIcon className="fill-paper/40 size-4 shrink-0" />
                  )}
                  {spot.label}
                  <span className="sr-only">{isFound ? "(bulundu)" : "(henüz bulunmadı)"}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
