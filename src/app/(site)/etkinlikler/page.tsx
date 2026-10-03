import type { Metadata } from "next";
import { Countdown } from "@/components/site/Countdown";
import { EmptyState } from "@/components/site/EmptyState";
import { EventCard, PastEventCard } from "@/components/site/EventCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getEventTimeline } from "@/lib/data";

export const metadata: Metadata = { title: "Etkinlikler" };

const yearOf = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", year: "numeric" }).format(new Date(iso));

export default async function EventsPage() {
  const { events, upcoming, past, next } = await getEventTimeline();
  const years = [...new Set(past.map((event) => yearOf(event.starts_at)))];

  return (
    <>
      <PageHeader eyebrow="Takvim" title="Etkinlikler">
        {next ? (
          <div className="mt-2 space-y-3">
            <p className="text-ink font-bold">
              Sıradaki: <span className="text-brand">{next.title}</span>
            </p>
            <Countdown target={next.starts_at} size="sm" />
          </div>
        ) : null}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {events.length === 0 && (
          <EmptyState title="Henüz etkinlik yok">Yeni etkinlikler için bizi takipte kal!</EmptyState>
        )}

        {upcoming.length > 0 && (
          <section>
            <h2 className="font-display mb-6 text-3xl font-extrabold">Yaklaşan etkinlikler</h2>
            <div className="max-w-4xl space-y-6">
              {upcoming.map((event, index) => (
                <Reveal key={event.id} delay={index * 0.05}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className={upcoming.length ? "mt-20" : ""}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-extrabold">Geçmiş etkinlikler</h2>
              {years.length > 1 && (
                <nav aria-label="Yıllar" className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <a
                      key={year}
                      href={`#yil-${year}`}
                      className="border-ink/20 hover:border-ink rounded-full border-2 px-3 py-1 text-sm font-bold"
                    >
                      {year}
                    </a>
                  ))}
                </nav>
              )}
            </div>
            <div className="space-y-12">
              {years.map((year) => (
                <div key={year} id={`yil-${year}`} className="scroll-mt-28">
                  <p className="sticker bg-ink text-paper mb-5 -rotate-1">{year}</p>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                    {past
                      .filter((event) => yearOf(event.starts_at) === year)
                      .map((event, index) => (
                        <Reveal key={event.id} delay={(index % 4) * 0.04}>
                          <PastEventCard event={event} />
                        </Reveal>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
