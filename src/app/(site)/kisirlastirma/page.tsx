import { Check, MapPin, Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import { PetPlaceholder } from "@/components/site/adoption/AdoptionCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { StatCounter } from "@/components/site/StatCounter";
import { getNeuterOverview, type NeuterRecord } from "@/lib/data";
import { formatDay, todayInIstanbul } from "@/lib/format";
import { labelOf, sexOptions, speciesOptions } from "@/lib/options";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Kısırlaştırma Takvimi" };

export default async function NeuterPage() {
  const today = todayInIstanbul();
  const [settings, overview] = await Promise.all([getSettings(), getNeuterOverview(today)]);
  const total = overview.done + Math.max(0, Number(settings.neuter_count_offset) || 0);
  const isEmpty = total === 0 && overview.upcoming.length === 0;

  // Yaklaşanları aylara göre grupla: "2026-10" → kayıtlar
  const months = new Map<string, NeuterRecord[]>();
  for (const record of overview.upcoming) {
    const key = record.scheduled_on.slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), record]);
  }

  const stats = [
    { label: "Toplam kısırlaştırma", value: total },
    { label: `${today.slice(0, 4)} yılında`, value: overview.doneThisYear },
    { label: "Planlanan", value: overview.upcoming.length },
  ];

  return (
    <>
      <PageHeader eyebrow="Takvim" title="Kısırlaştırma">
        {settings.neuter_intro ? (
          <p className="whitespace-pre-line">{settings.neuter_intro}</p>
        ) : (
          <p>Sokaktaki dostlarımızın sağlıklı ve güvende yaşaması için düzenli kısırlaştırma yapıyoruz.</p>
        )}
      </PageHeader>

      {isEmpty ? (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <EmptyState title="Takvim yakında">Kısırlaştırma çalışmalarımızı burada paylaşacağız.</EmptyState>
        </div>
      ) : (
        <>
          <section className="bg-paws-light border-ink bg-ink text-paper border-b-4">
            <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4 py-12 sm:px-6">
              {stats.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 0.08} className="text-center">
                  <p className="font-display text-brand text-4xl leading-none font-extrabold sm:text-6xl">
                    <StatCounter value={stat.value} />
                  </p>
                  <p className="text-paper/80 mt-2 text-sm font-bold sm:text-base">{stat.label}</p>
                </Reveal>
              ))}
            </div>
          </section>

          <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6">
            <section>
              <Reveal>
                <h2 className="font-display text-4xl font-extrabold">Yaklaşan kısırlaştırmalar</h2>
              </Reveal>
              {months.size === 0 ? (
                <p className="text-ink-soft mt-4 text-lg">Şu an planlanmış bir kısırlaştırma yok.</p>
              ) : (
                <div className="mt-8 space-y-10">
                  {[...months.entries()].map(([month, records]) => (
                    <div key={month}>
                      <h3 className="text-brand mb-4 text-sm font-extrabold tracking-widest uppercase">
                        {formatDay(`${month}-01`, { day: undefined, month: "long", year: "numeric" })}
                      </h3>
                      <ul className="space-y-3">
                        {records.map((record) => (
                          <ScheduleRow key={record.id} record={record} isToday={record.scheduled_on === today} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {overview.recent.length > 0 && (
              <section>
                <Reveal>
                  <h2 className="font-display text-4xl font-extrabold">Son kısırlaştırılanlar</h2>
                </Reveal>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {overview.recent.map((record, index) => (
                    <Reveal key={record.id} delay={(index % 4) * 0.06}>
                      <article className="card overflow-hidden">
                        <div className="border-ink aspect-square overflow-hidden border-b-2">
                          {record.photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={record.photo_url}
                              alt={record.animal_name}
                              loading="lazy"
                              className="size-full object-cover"
                            />
                          ) : (
                            <PetPlaceholder species={record.species} />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-display truncate text-lg leading-tight font-extrabold">
                            {record.animal_name}
                          </p>
                          <p className="text-ink-soft mt-1 flex items-center gap-1 text-xs font-bold">
                            <Check className="text-brand size-3.5" aria-hidden="true" />{" "}
                            {formatDay(record.scheduled_on)}
                          </p>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </>
  );
}

function ScheduleRow({ record, isToday }: { record: NeuterRecord; isToday: boolean }) {
  const meta = [labelOf(speciesOptions, record.species), labelOf(sexOptions, record.sex)].filter(Boolean).join(" · ");

  return (
    <li
      className={`card flex items-center gap-4 p-3 sm:p-4 ${isToday ? "shadow-hard-red border-brand" : "shadow-hard-sm"}`}
    >
      <div
        className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-2 ${isToday ? "bg-brand text-paper" : "bg-ink text-paper"}`}
      >
        <span className="font-display text-3xl leading-none font-extrabold">
          {formatDay(record.scheduled_on, { day: "numeric", month: undefined, year: undefined })}
        </span>
        <span className="text-xs font-bold">
          {isToday
            ? "Bugün"
            : formatDay(record.scheduled_on, { day: undefined, month: undefined, year: undefined, weekday: "short" })}
        </span>
      </div>

      <div className="border-ink size-14 shrink-0 overflow-hidden rounded-full border-2">
        {record.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={record.photo_url} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <PetPlaceholder species={record.species} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-display truncate text-xl leading-tight font-extrabold">{record.animal_name}</p>
        {meta && <p className="text-ink-soft text-sm font-bold">{meta}</p>}
        <p className="text-ink-soft mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm">
          {record.area && (
            <span className="flex items-center gap-1">
              <MapPin className="text-brand size-3.5" aria-hidden="true" /> {record.area}
            </span>
          )}
          {record.vets?.name && (
            <span className="flex items-center gap-1">
              <Stethoscope className="text-brand size-3.5" aria-hidden="true" /> {record.vets.name}
            </span>
          )}
        </p>
        {record.note && <p className="text-ink-soft mt-1 text-sm whitespace-pre-line">{record.note}</p>}
      </div>
    </li>
  );
}
