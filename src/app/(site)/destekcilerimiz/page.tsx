import { ArrowRight, Globe } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SocialIcon } from "@/components/site/SocialLinks";
import { getPartners, type Partner } from "@/lib/data";
import { partnerKindOptions } from "@/lib/options";
import { getSettings } from "@/lib/settings";
import { safeHref } from "@/lib/url";

export const metadata: Metadata = {
  title: "Destekçilerimiz",
  description: "Birlikte çalıştığımız kurumlar, dernekler, kulüpler ve işletmeler.",
};

export default async function PartnersPage() {
  const [settings, partners] = await Promise.all([getSettings(), getPartners()]);
  const groups = partnerKindOptions
    .map((option) => ({ ...option, items: partners.filter((partner) => partner.kind === option.value) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHeader eyebrow="Birlikte daha güçlüyüz" title="Destekçilerimiz">
        {settings.partners_intro ? (
          <p className="whitespace-pre-line">{settings.partners_intro}</p>
        ) : (
          <p>Mama bağışından ortak etkinliğe, bize el uzatan herkese teşekkürler!</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {groups.length === 0 && (
          <EmptyState title="Liste hazırlanıyor">Destekçilerimizi yakında burada göreceksin.</EmptyState>
        )}

        <div className="space-y-16">
          {groups.map((group) => (
            <section key={group.value}>
              <h2 className="font-display mb-6 text-3xl font-extrabold">{group.label}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((partner, index) => (
                  <Reveal key={partner.id} delay={(index % 3) * 0.05}>
                    <PartnerCard partner={partner} index={index} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Reveal className="card bg-brand text-paper mt-16 flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <p className="font-display text-2xl font-extrabold">Sen de destek olmak ister misin?</p>
          <Link href="/destek" className="btn btn-black">
            Nasıl destek olurum? <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </>
  );
}

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  const instagram = safeHref(partner.instagram_url);
  const website = safeHref(partner.website_url);
  const initials = partner.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase("tr-TR");

  return (
    <article className="card flex h-full gap-4 p-5">
      {partner.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.logo_url}
          alt=""
          loading="lazy"
          className="border-ink size-16 shrink-0 rounded-full border-2 object-cover"
        />
      ) : (
        <span
          className={`border-ink font-display grid size-16 shrink-0 place-items-center rounded-full border-2 text-xl font-extrabold ${
            index % 2 ? "bg-ink text-paper" : "bg-brand text-paper"
          }`}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="font-display text-xl leading-tight font-extrabold">{partner.name}</h3>
        {partner.description && <p className="text-ink-soft text-sm">{partner.description}</p>}
        {(instagram || website) && (
          <div className="mt-auto flex flex-wrap gap-3 pt-1 text-sm font-bold">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand flex items-center gap-1"
              >
                <SocialIcon name="instagram" className="size-4" /> Instagram
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand flex items-center gap-1"
              >
                <Globe className="size-4" aria-hidden="true" /> Web sitesi
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
