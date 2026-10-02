import type { Metadata } from "next";
import { SuggestionForm } from "@/components/site/forms/SuggestionForm";
import { PageHeader } from "@/components/site/PageHeader";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "İstek & Öneri" };

export default async function SuggestionPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader eyebrow="Sesini duyur" title="İstek & Öneri Köşesi">
        {settings.suggestions_intro ? (
          <p className="whitespace-pre-line">{settings.suggestions_intro}</p>
        ) : (
          <p>İsteğini, önerini ya da teşekkürünü yaz. İstersen isimsiz gönderebilirsin.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <SuggestionForm />
      </div>
    </>
  );
}
