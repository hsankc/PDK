import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CampusPetCard } from "@/components/site/CampusPetCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getCampusPets } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Kampüs Kedileri",
  description: "Kampüsümüzün patili yerlileriyle tanış: adları, huyları, en sevdikleri köşeler.",
};

export default async function CampusPetsPage() {
  const [settings, pets] = await Promise.all([getSettings(), getCampusPets()]);

  return (
    <>
      <PageHeader
        eyebrow="Kampüsün yerlileri"
        title="Kampüs Kedileri"
        paw={{ id: "kampus-kedileri", className: "top-10 right-[30%] rotate-6" }}
      >
        {settings.campus_pets_intro ? (
          <p className="whitespace-pre-line">{settings.campus_pets_intro}</p>
        ) : (
          <p>Derse giderken selamlaştığın, kantinde yanına oturan o tanıdık yüzler. Tanışalım!</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {pets.length === 0 ? (
          <EmptyState title="Tanıtımlar hazırlanıyor">Kampüsün patili yerlileri yakında burada!</EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet, index) => (
              <Reveal key={pet.id} delay={(index % 3) * 0.06}>
                <CampusPetCard pet={pet} index={index} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="card bg-mist mt-16 flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <p className="font-display text-2xl font-extrabold">Kampüste tanıdığın bir dost mu var?</p>
          <Link href="/oneri" className="btn btn-black">
            Bize anlat <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </>
  );
}
