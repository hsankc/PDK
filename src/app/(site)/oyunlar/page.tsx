import type { Metadata } from "next";
import { CatchGame } from "@/components/games/CatchGame";
import { Leaderboard } from "@/components/games/Leaderboard";
import { MemoryGame } from "@/components/games/MemoryGame";
import { PawHuntCard } from "@/components/games/PawHuntCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getCampusPets, getLeaderboard } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Pati Oyunları",
  description: "Mama Yakala, kampüs kedileriyle Hafıza Kartları ve gizli pati avı. Skor tablosuna adını yazdır!",
};

export default async function GamesPage() {
  const [settings, pets, mamaScores, memoryScores] = await Promise.all([
    getSettings(),
    getCampusPets(),
    getLeaderboard("mama"),
    getLeaderboard("hafiza"),
  ]);
  const faces = pets.filter((pet) => pet.photo_url).map((pet) => ({ name: pet.name, src: pet.photo_url! }));

  return (
    <>
      <PageHeader eyebrow="Mola zamanı" title="Pati Oyunları">
        {settings.games_intro ? (
          <p className="whitespace-pre-line">{settings.games_intro}</p>
        ) : (
          <p>Ders arasında biraz eğlence: oyna, öğren, skor tablosunun zirvesine adını yazdır!</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6">
        <section aria-labelledby="mama-yakala">
          <h2 id="mama-yakala" className="font-display mb-2 text-3xl font-extrabold sm:text-4xl">
            Mama Yakala
          </h2>
          <p className="text-ink-soft mb-6 max-w-2xl">
            Mamaları ve suyu topla; çikolata, soğan, üzüm ve süt kediler için zararlı, onlardan kaç! Bilgisayarda ok
            tuşları ya da fare, telefonda parmağınla oyna.
          </p>
          <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
            <CatchGame />
            <Reveal>
              <Leaderboard game="mama" rows={mamaScores} />
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="hafiza-kartlari">
          <h2 id="hafiza-kartlari" className="font-display mb-2 text-3xl font-extrabold sm:text-4xl">
            Hafıza Kartları
          </h2>
          <p className="text-ink-soft mb-6 max-w-2xl">
            Kartlarda kampüsün yerlileri var. Eşlerini en az hamlede bul; berabere kalırsan kısa süren kazanır.
          </p>
          <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="mx-auto w-full max-w-xl lg:max-w-none">
              <MemoryGame faces={faces} />
            </div>
            <Reveal>
              <Leaderboard game="hafiza" rows={memoryScores} />
            </Reveal>
          </div>
        </section>

        {settings.paw_hunt_enabled && (
          <Reveal>
            <PawHuntCard />
          </Reveal>
        )}
      </div>
    </>
  );
}
