import type { Metadata } from "next";
import { AdoptionBrowser } from "@/components/site/adoption/AdoptionBrowser";
import { AdoptionCard } from "@/components/site/adoption/AdoptionCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getAdoptions } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Sahiplendirme" };

export default async function AdoptionsPage() {
  const [settings, animals] = await Promise.all([getSettings(), getAdoptions()]);
  const waiting = animals.filter((animal) => animal.status !== "sahiplendirildi");
  const adopted = animals.filter((animal) => animal.status === "sahiplendirildi");

  return (
    <>
      <PageHeader
        eyebrow="Yuva arıyoruz"
        title="Sahiplendirme"
        paw={{ id: "sahiplendirme", className: "bottom-3 left-[45%] rotate-45" }}
      >
        {settings.adoption_intro ? (
          <p className="whitespace-pre-line">{settings.adoption_intro}</p>
        ) : (
          <p>Her biri sıcak bir yuvayı hak ediyor. Tanışmak istediğin dostun kartına tıkla.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {waiting.length > 0 ? (
          <AdoptionBrowser animals={waiting} />
        ) : (
          <EmptyState title="Şu an yuva arayan dostumuz yok">Yeni ilanlar için bizi takipte kal!</EmptyState>
        )}

        {adopted.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold">Mutlu sonlar</h2>
              <p className="text-ink-soft mt-2 text-lg">{adopted.length} dostumuz yuvasına kavuştu.</p>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {adopted.map((animal, index) => (
                <Reveal key={animal.id} delay={(index % 4) * 0.06}>
                  <AdoptionCard animal={animal} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
