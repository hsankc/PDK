import { HandHeart } from "lucide-react";
import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { ProgressBar } from "@/components/site/ProgressBar";
import { DebtCard, DonationCard, NeedItem } from "@/components/site/SupportBlocks";
import { Reveal } from "@/components/site/Reveal";
import { getDebts, getNeeds, summarizeDebts } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Destek Ol" };

export default async function SupportPage() {
  const [settings, debts, needs] = await Promise.all([getSettings(), getDebts(), getNeeds()]);
  const summary = summarizeDebts(debts);
  const otherSupport = settings.other_support
    .split("\n")
    .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);
  const hasIban = Boolean(settings.iban.trim());
  const isEmpty = !debts.length && !needs.length && !hasIban && !otherSupport.length;

  return (
    <>
      <PageHeader eyebrow="Şeffaflık" title="Destek Ol">
        {settings.support_intro ? (
          <p className="whitespace-pre-line">{settings.support_intro}</p>
        ) : (
          <p>Her kuruşun nereye gittiğini burada paylaşıyoruz. Küçük bir destek bile bir patiye umut olur.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6">
        {isEmpty && <EmptyState title="Bu sayfa yakında dolacak">Bağış bilgilerimizi burada paylaşacağız.</EmptyState>}

        {(debts.length > 0 || hasIban) && (
          <div className={`grid gap-6 ${debts.length > 0 && hasIban ? "lg:grid-cols-2" : ""}`}>
            {debts.length > 0 && (
              <Reveal className="card bg-ink text-paper bg-paws-light shadow-hard-red p-6 sm:p-8">
                <p className="text-brand text-xs font-extrabold tracking-widest uppercase">Güncel borcumuz</p>
                <p className="font-display mt-2 text-5xl leading-none font-extrabold sm:text-6xl">
                  {formatMoney(summary.remaining)}
                </p>
                <p className="text-paper/70 mt-2 font-bold">
                  Toplam {formatMoney(summary.total)} borcun {formatMoney(summary.paid)} kadarı ödendi.
                </p>
                <div className="mt-6">
                  <ProgressBar percent={summary.percent} label="Ödenen borç oranı" size="lg" />
                </div>
                <p className="mt-2 text-right text-sm font-bold">%{summary.percent} ödendi</p>
              </Reveal>
            )}
            {hasIban && <DonationCard settings={settings} />}
          </div>
        )}

        {needs.length > 0 && (
          <section>
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold">İhtiyaç listemiz</h2>
              <p className="text-ink-soft mt-2 text-lg">Bağış yerine doğrudan ürün de getirebilirsin.</p>
            </Reveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {needs.map((need) => (
                <NeedItem key={need.id} need={need} />
              ))}
            </ul>
          </section>
        )}

        {otherSupport.length > 0 && (
          <section>
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold">Başka nasıl destek olabilirsin?</h2>
            </Reveal>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {otherSupport.map((item) => (
                <li key={item} className="card flex items-start gap-3 p-5 shadow-none">
                  <HandHeart className="text-brand mt-0.5 size-6 shrink-0" aria-hidden="true" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {debts.length > 0 && (
          <section>
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold">Borçlarımızın ayrıntısı</h2>
              <p className="text-ink-soft mt-2 text-lg">Faturaları da paylaşıyoruz; her şey açık.</p>
            </Reveal>
            <div className="mt-8 space-y-4">
              {debts.map((debt) => (
                <Reveal key={debt.id}>
                  <DebtCard debt={debt} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
