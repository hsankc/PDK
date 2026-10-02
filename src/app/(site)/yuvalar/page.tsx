import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { ShelterExplorer } from "@/components/site/ShelterExplorer";
import { getShelterLocations } from "@/lib/data";
import { mapViewOf } from "@/lib/map";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Yuva & Besleme Noktaları" };

export default async function SheltersPage() {
  const [settings, locations] = await Promise.all([getSettings(), getShelterLocations()]);

  return (
    <>
      <PageHeader eyebrow="Harita" title="Yuva & Besleme Noktaları">
        {settings.shelters_intro ? (
          <p className="whitespace-pre-line">{settings.shelters_intro}</p>
        ) : (
          <p>Mama ve su koyduğumuz, kulübe kurduğumuz noktalar. Yolun düşerse bir kap su tazelemeyi unutma!</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {locations.length === 0 ? (
          <EmptyState title="Harita yakında">Besleme noktalarımızı burada paylaşacağız.</EmptyState>
        ) : (
          <ShelterExplorer locations={locations} fallback={mapViewOf(settings)} />
        )}
      </div>
    </>
  );
}
