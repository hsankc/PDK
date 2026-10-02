import { CalendarClock, Check, HandHeart, Landmark, Receipt, TriangleAlert } from "lucide-react";
import { CopyButton } from "@/components/site/CopyButton";
import { ProgressBar } from "@/components/site/ProgressBar";
import { Reveal } from "@/components/site/Reveal";
import type { Debt, Need } from "@/lib/data";
import { formatDay, formatMoney } from "@/lib/format";
import { compactIban, formatIban, qrDataUri } from "@/lib/qr";
import type { SiteSettings } from "@/lib/settings";

export async function DonationCard({ settings }: { settings: SiteSettings }) {
  const iban = compactIban(settings.iban);
  const qr = await qrDataUri(iban);

  return (
    <Reveal delay={0.1} className="card p-6 sm:p-8" id="bagis">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-brand text-xs font-extrabold tracking-widest uppercase">Bağış yap</p>
          {settings.bank_name && (
            <p className="mt-2 flex items-center gap-2 font-bold">
              <Landmark className="text-brand size-5" aria-hidden="true" /> {settings.bank_name}
            </p>
          )}
          {settings.account_holder && <p className="text-ink-soft mt-1">Alıcı: {settings.account_holder}</p>}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt="IBAN için QR kod"
          className="border-ink size-24 shrink-0 rounded-xl border-2 sm:size-28"
          title="Telefonunun kamerasıyla okut"
        />
      </div>

      <p className="text-ink-soft mt-6 text-xs font-extrabold tracking-widest uppercase">IBAN</p>
      <p className="bg-mist mt-1 rounded-2xl px-4 py-3 font-mono text-lg font-bold break-all select-all sm:text-xl">
        {formatIban(iban)}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CopyButton text={iban} label="IBAN'ı kopyala" />
        {settings.account_holder && <CopyButton text={settings.account_holder} label="Alıcı adını kopyala" />}
      </div>
      {settings.donation_note && (
        <p className="border-brand bg-brand-soft text-brand-dark mt-5 rounded-2xl border-2 px-4 py-3 font-bold">
          {settings.donation_note}
        </p>
      )}
    </Reveal>
  );
}

export function NeedItem({ need }: { need: Need }) {
  const tone = need.is_fulfilled
    ? "border-ink/20 text-ink/45"
    : need.is_urgent
      ? "border-brand shadow-hard-red"
      : "border-ink shadow-hard-sm";

  return (
    <li className={`bg-paper flex gap-3 rounded-3xl border-2 p-5 ${tone}`}>
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-full ${
          need.is_fulfilled ? "bg-mist" : need.is_urgent ? "bg-brand text-paper" : "bg-ink text-paper"
        }`}
      >
        {need.is_fulfilled ? (
          <Check className="size-5" aria-hidden="true" />
        ) : need.is_urgent ? (
          <TriangleAlert className="size-5" aria-hidden="true" />
        ) : (
          <HandHeart className="size-5" aria-hidden="true" />
        )}
      </span>
      <div className="min-w-0">
        <p className={`font-display text-xl leading-tight font-extrabold ${need.is_fulfilled ? "line-through" : ""}`}>
          {need.title}
        </p>
        <p className="mt-1 text-sm font-bold">
          {need.is_fulfilled
            ? "Karşılandı, teşekkürler!"
            : [need.is_urgent && "Acil", need.quantity].filter(Boolean).join(" · ")}
        </p>
        {need.description && !need.is_fulfilled && (
          <p className="text-ink-soft mt-1 text-sm whitespace-pre-line">{need.description}</p>
        )}
      </div>
    </li>
  );
}

export function DebtCard({ debt }: { debt: Debt }) {
  const paid = Math.min(debt.paid_amount, debt.amount);
  const remaining = debt.amount - paid;
  const done = remaining <= 0;

  return (
    <article className={`card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6 ${done ? "opacity-70" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-2xl leading-tight font-extrabold">{debt.creditor}</h3>
          {done && (
            <span className="sticker bg-ink text-paper text-xs">
              <Check className="size-3.5" aria-hidden="true" /> Ödendi
            </span>
          )}
        </div>
        {debt.description && <p className="text-ink-soft mt-1 whitespace-pre-line">{debt.description}</p>}
        <div className="mt-4">
          <ProgressBar
            percent={(paid / debt.amount) * 100}
            label={`${debt.creditor} borcunun ödenen oranı`}
            size="sm"
          />
        </div>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
          <span>Toplam {formatMoney(debt.amount)}</span>
          <span className="text-ink-soft">Ödenen {formatMoney(paid)}</span>
          {!done && <span className="text-brand">Kalan {formatMoney(remaining)}</span>}
        </p>
        {(debt.incurred_on || (debt.due_on && !done)) && (
          <p className="text-ink-soft mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <CalendarClock className="size-4" aria-hidden="true" />
            {debt.incurred_on && <span>Tarih: {formatDay(debt.incurred_on)}</span>}
            {debt.due_on && !done && <span>Son ödeme: {formatDay(debt.due_on)}</span>}
          </p>
        )}
      </div>
      {debt.receipt_url && (
        <a
          href={debt.receipt_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border-ink relative block w-full shrink-0 overflow-hidden rounded-2xl border-2 sm:w-36"
          aria-label={`${debt.creditor} faturasını aç`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={debt.receipt_url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <span className="bg-ink/80 text-paper absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold">
            <Receipt className="size-3.5" aria-hidden="true" /> Faturayı gör
          </span>
        </a>
      )}
    </article>
  );
}
