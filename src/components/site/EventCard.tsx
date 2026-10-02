import { Clock, ExternalLink, MapPin } from "lucide-react";
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
        <h3 className="font-display text-2xl leading-tight font-extrabold">{event.title}</h3>
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
        {event.description && <p className="text-ink-soft whitespace-pre-line">{event.description}</p>}
        {registration && !past && (
          <a
            href={registration}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-black btn-sm mt-auto self-start"
          >
            Kayıt ol / Detaylar <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
