import type { Metadata } from "next";
import { Countdown } from "@/components/site/Countdown";
import { EmptyState } from "@/components/site/EmptyState";
import { EventCard } from "@/components/site/EventCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getEventTimeline } from "@/lib/data";

export const metadata: Metadata = { title: "Etkinlikler" };

export default async function EventsPage() {
  const { events, upcoming, past, next } = await getEventTimeline();

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

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {events.length === 0 && (
          <EmptyState title="Henüz etkinlik yok">Yeni etkinlikler için bizi takipte kal!</EmptyState>
        )}

        {upcoming.length > 0 && (
          <section>
            <h2 className="font-display mb-6 text-3xl font-extrabold">Yaklaşan etkinlikler</h2>
            <div className="space-y-6">
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
            <h2 className="font-display mb-6 text-3xl font-extrabold">Geçmiş etkinlikler</h2>
            <div className="space-y-6">
              {past.map((event) => (
                <Reveal key={event.id}>
                  <EventCard event={event} past />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
