import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { MembershipForm } from "@/components/site/forms/MembershipForm";
import { PageHeader } from "@/components/site/PageHeader";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Kulübe Katıl" };

export default async function JoinPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader eyebrow="Aramıza katıl" title="Kulübe Katıl">
        {settings.membership_intro && <p className="whitespace-pre-line">{settings.membership_intro}</p>}
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {settings.membership_open ? (
          <MembershipForm />
        ) : (
          <EmptyState title="Başvurular şu an kapalı">Yeni dönem başvuruları açıldığında burada olacak.</EmptyState>
        )}
      </div>
    </>
  );
}
