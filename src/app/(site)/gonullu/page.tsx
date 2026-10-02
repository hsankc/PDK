import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { VolunteerForm } from "@/components/site/forms/VolunteerForm";
import { PageHeader } from "@/components/site/PageHeader";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Gönüllü Ol & Geçici Yuva" };

export default async function VolunteerPage({ searchParams }: PageProps<"/gonullu">) {
  const [settings, { tur }] = await Promise.all([getSettings(), searchParams]);

  return (
    <>
      <PageHeader eyebrow="El ele" title="Gönüllü Ol & Geçici Yuva">
        {settings.volunteer_intro ? (
          <p className="whitespace-pre-line">{settings.volunteer_intro}</p>
        ) : (
          <p>
            Kulüp üyesi olmasan da destek olabilirsin: sahada gönüllü ol ya da bir dostu birkaç hafta evinde misafir et.
          </p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {settings.volunteer_open ? (
          <VolunteerForm initialKind={tur === "gecici-yuva" ? "gecici_yuva" : "gonullu"} />
        ) : (
          <EmptyState title="Başvurular şu an kapalı">Yeni dönemde başvuruları burada açacağız.</EmptyState>
        )}
      </div>
    </>
  );
}
