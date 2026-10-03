import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { FactsBoard } from "@/components/site/FactsBoard";
import { PageHeader } from "@/components/site/PageHeader";
import { getFacts } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Biliyor musun?",
  description: "Kediler ve köpekler hakkında kısa, şaşırtıcı bilgiler.",
};

export default async function FactsPage() {
  const [settings, facts] = await Promise.all([getSettings(), getFacts()]);

  return (
    <>
      <PageHeader eyebrow="Pati bilgileri" title="Biliyor musun?">
        {settings.facts_intro ? (
          <p className="whitespace-pre-line">{settings.facts_intro}</p>
        ) : (
          <p>Kediler ve köpekler hakkında kısa, şaşırtıcı bilgiler. Kartlara dokun, arkasını oku!</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {facts.length === 0 ? (
          <EmptyState title="Bilgiler yolda">Yakında burada şaşırtıcı pati bilgileri olacak.</EmptyState>
        ) : (
          <FactsBoard facts={facts} />
        )}
      </div>
    </>
  );
}
