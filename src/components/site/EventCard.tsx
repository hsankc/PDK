import { Clock, ExternalLink, Images, MapPin } from "lucide-react";
import Link from "next/link";
import type { ClubEvent } from "@/lib/data";
import { dateParts, formatDate, formatTime } from "@/lib/format";
import { safeHref } from "@/lib/url";

export function EventCard({ event, past = false }: { event: ClubEvent; past?: boolean }) {
  const { day, month, weekday } = dateParts(event.starts_at);
  const registration = safeHref(event.registration_url);
  const sameDay = event.ends_at && formatDate(event.ends_at) === formatDate(event.starts_at);

  return (
    <article className={`card flex flex-col overflow-hidden sm:flex-row ${past ? "opacity-80" : ""}`}>
      <div className="flex shrink-0 sm:w-56 sm:flex-col">
        <div
          className={`border-ink flex w-28 shrink-0 flex-col items-center justify-center border-r-2 py-4 sm:w-full sm:border-r-0 sm:border-b-2 ${
            past ? "bg-mist text-ink" : "bg-brand text-paper"
          }`}
        >
          <span className="font-display text-5xl leading-none font-extrabold">{day}</span>
          <span className="font-display text-lg font-bold uppercase">{month}</span>
          <span className="text-xs font-bold opacity-80">{weekday}</span>
        </div>
        {event.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.cover_url}
            alt=""
            loading="lazy"
            className={`min-h-28 w-full flex-1 object-cover sm:aspect-[4/3] sm:flex-none ${past ? "grayscale" : ""}`}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 className="font-display text-2xl leading-tight font-extrabold">
          <Link href={`/etkinlikler/${event.id}`} className="hover:text-brand transition-colors">
            {event.title}
          </Link>
        </h3>
        <ul className="text-ink-soft flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-bold">
          <li className="flex items-center gap-1.5">
            <Clock className="text-brand size-4" aria-hidden="true" />
            {formatTime(event.starts_at)}
            {event.ends_at && (sameDay ? ` – ${formatTime(event.ends_at)}` : ` – ${formatDate(event.ends_at, true)}`)}
          </li>
          {event.location && (
            <li className="flex items-center gap-1.5">
              <MapPin className="text-brand size-4" aria-hidden="true" />
              {event.location}
            </li>
          )}
        </ul>
        {event.description && <p className="text-ink-soft line-clamp-6 whitespace-pre-line">{event.description}</p>}
        <div className="mt-auto flex flex-wrap gap-2">
          {registration && !past && (
            <a href={registration} target="_blank" rel="noopener noreferrer" className="btn btn-black btn-sm">
              Kayıt ol <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}
          {event.photos.length > 0 && (
            <Link href={`/etkinlikler/${event.id}`} className="btn btn-white btn-sm">
              <Images className="size-4" aria-hidden="true" /> {event.photos.length} fotoğraf
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/** Geçmiş etkinlikler için küçük kart: kapak, tarih, başlık ve fotoğraf sayısı. */
export function PastEventCard({ event }: { event: ClubEvent }) {
  const { day, month } = dateParts(event.starts_at);
  const image = event.photos[0] ?? event.cover_url;

  return (
    <Link
      href={`/etkinlikler/${event.id}`}
      className="card group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="border-ink bg-mist relative aspect-[4/3] overflow-hidden border-b-2">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-paws grid size-full place-items-center" />
        )}
        <span className="bg-paper border-ink shadow-hard-sm absolute top-3 left-3 flex flex-col items-center rounded-xl border-2 px-2.5 py-1 leading-none">
          <span className="font-display text-xl font-extrabold">{day}</span>
          <span className="text-xs font-bold uppercase">{month}</span>
        </span>
        {event.photos.length > 0 && (
          <span className="bg-ink/75 text-paper absolute right-3 bottom-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
            <Images className="size-3.5" aria-hidden="true" /> {event.photos.length}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display group-hover:text-brand text-lg leading-tight font-extrabold transition-colors">
          {event.title}
        </h3>
        {event.location && <p className="text-ink-soft mt-1 line-clamp-1 text-sm font-bold">{event.location}</p>}
      </div>
    </Link>
  );
}
