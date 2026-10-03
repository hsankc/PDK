import { ArrowLeft, CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/site/Countdown";
import { PhotoWall } from "@/components/site/PhotoWall";
import { Reveal } from "@/components/site/Reveal";
import { getEvent, isEventPast } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/format";
import { paragraphs } from "@/lib/settings";
import { safeHref } from "@/lib/url";

export async function generateMetadata({ params }: PageProps<"/etkinlikler/[id]">): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return { title: "Etkinlik bulunamadı" };
  const image = event.cover_url ?? event.photos[0];
  return {
    title: event.title,
    description: event.description?.slice(0, 160),
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function EventPage({ params }: PageProps<"/etkinlikler/[id]">) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const past = isEventPast(event);
  const registration = safeHref(event.registration_url);
  const text = paragraphs(event.description);
  const sameDay = event.ends_at && formatDate(event.ends_at) === formatDate(event.starts_at);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/etkinlikler"
        className="text-ink-soft hover:text-ink mb-6 inline-flex items-center gap-1.5 font-bold"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Tüm etkinlikler
      </Link>

      <div className={`grid gap-10 ${event.cover_url ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}>
        <Reveal>
          <p className={`sticker shadow-hard-sm mb-4 -rotate-2 ${past ? "bg-ink text-paper" : "bg-brand text-paper"}`}>
            {past ? "Geçmiş etkinlik" : "Yaklaşan etkinlik"}
          </p>
          <h1 className="font-display text-4xl leading-tight font-extrabold sm:text-5xl">{event.title}</h1>
          <ul className="text-ink-soft mt-5 flex flex-wrap gap-x-6 gap-y-2 font-bold">
            <li className="flex items-center gap-1.5">
              <CalendarDays className="text-brand size-5" aria-hidden="true" />
              {formatDate(event.starts_at)}
            </li>
            <li className="flex items-center gap-1.5">
              <Clock className="text-brand size-5" aria-hidden="true" />
              {formatTime(event.starts_at)}
              {event.ends_at && (sameDay ? ` – ${formatTime(event.ends_at)}` : ` – ${formatDate(event.ends_at, true)}`)}
            </li>
            {event.location && (
              <li className="flex items-center gap-1.5">
                <MapPin className="text-brand size-5" aria-hidden="true" />
                {event.location}
              </li>
            )}
          </ul>

          {!past && (
            <div className="mt-6">
              <Countdown target={event.starts_at} size="sm" />
            </div>
          )}

          {text.length > 0 && (
            <div className="prose-club mt-8">
              {text.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {registration && !past && (
            <a href={registration} target="_blank" rel="noopener noreferrer" className="btn btn-red mt-8">
              Kayıt ol / Detaylar <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}
        </Reveal>

        {event.cover_url && (
          <Reveal delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.cover_url}
              alt=""
              className="border-ink shadow-hard-lg w-full rotate-1 rounded-[2rem] border-4 object-cover"
            />
          </Reveal>
        )}
      </div>

      {event.photos.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-3xl font-extrabold">Etkinlikten kareler</h2>
          <PhotoWall photos={event.photos.map((src) => ({ src, caption: event.title }))} />
        </section>
      )}
    </div>
  );
}
