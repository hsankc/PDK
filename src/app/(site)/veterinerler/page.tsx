import { Clock, ExternalLink, MapPin, Navigation, Phone, Siren, Stethoscope, Tag } from "lucide-react";
import type { Metadata } from "next";
import { ClubMap } from "@/components/map/ClubMap";
import type { MapMarker } from "@/components/map/markers";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getVets, type Vet } from "@/lib/data";
import { mapViewOf } from "@/lib/map";
import { getSettings } from "@/lib/settings";
import { safeHref } from "@/lib/url";

export const metadata: Metadata = { title: "Anlaşmalı Veterinerler" };

function directionsUrl(vet: Vet) {
  const custom = safeHref(vet.maps_url);
  if (custom) return custom;
  if (vet.lat != null && vet.lng != null)
    return `https://www.google.com/maps/dir/?api=1&destination=${vet.lat},${vet.lng}`;
  return "";
}

export default async function VetsPage() {
  const [settings, vets] = await Promise.all([getSettings(), getVets()]);

  const markers: MapMarker[] = vets
    .filter((vet) => vet.lat != null && vet.lng != null)
    .map((vet) => ({
      id: vet.id,
      lat: vet.lat!,
      lng: vet.lng!,
      kind: "vet",
      title: vet.name,
      subtitle: [vet.discount_info, vet.phone].filter(Boolean).join("\n"),
      href: directionsUrl(vet) || undefined,
      hrefLabel: "Yol tarifi al",
    }));

  return (
    <>
      <PageHeader eyebrow="Sağlık" title="Anlaşmalı Veterinerler">
        {settings.vets_intro ? (
          <p className="whitespace-pre-line">{settings.vets_intro}</p>
        ) : (
          <p>Dostlarımızın tedavisinde bize destek olan klinikler.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {vets.length === 0 ? (
          <EmptyState title="Liste yakında">Anlaşmalı kliniklerimizi burada paylaşacağız.</EmptyState>
        ) : (
          <>
            {markers.length > 0 && (
              <Reveal className="card relative isolate mb-12 h-80 overflow-hidden sm:h-96">
                <ClubMap markers={markers} fallback={mapViewOf(settings)} className="size-full" />
              </Reveal>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              {vets.map((vet, index) => (
                <Reveal key={vet.id} delay={(index % 2) * 0.08}>
                  <VetCard vet={vet} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function VetCard({ vet }: { vet: Vet }) {
  const directions = directionsUrl(vet);
  const website = safeHref(vet.website_url);

  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start gap-4">
        {vet.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vet.logo_url}
            alt=""
            loading="lazy"
            className="border-ink size-16 shrink-0 rounded-2xl border-2 object-cover"
          />
        ) : (
          <span className="border-ink bg-brand text-paper grid size-16 shrink-0 place-items-center rounded-2xl border-2">
            <Stethoscope className="size-8" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight font-extrabold">{vet.name}</h2>
          {vet.doctor_name && <p className="text-ink-soft font-bold">{vet.doctor_name}</p>}
          {vet.is_emergency && (
            <p className="sticker bg-ink text-paper mt-2 text-xs">
              <Siren className="text-brand size-3.5" aria-hidden="true" /> 7/24 acil
            </p>
          )}
        </div>
      </div>

      {vet.discount_info && (
        <p className="border-brand bg-brand-soft text-brand-dark mt-5 flex items-start gap-2 rounded-2xl border-2 px-4 py-2.5 font-bold">
          <Tag className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {vet.discount_info}
        </p>
      )}

      <ul className="text-ink-soft mt-5 space-y-2">
        {vet.working_hours && (
          <li className="flex gap-2">
            <Clock className="text-brand mt-0.5 size-4 shrink-0" aria-hidden="true" /> {vet.working_hours}
          </li>
        )}
        {vet.address && (
          <li className="flex gap-2">
            <MapPin className="text-brand mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-pre-line">{vet.address}</span>
          </li>
        )}
        {vet.services && (
          <li className="flex gap-2">
            <Stethoscope className="text-brand mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-pre-line">{vet.services}</span>
          </li>
        )}
      </ul>

      {(vet.phone || directions || website) && (
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {vet.phone && (
            <a href={`tel:${vet.phone.replace(/\s/g, "")}`} className="btn btn-red btn-sm">
              <Phone className="size-4" aria-hidden="true" /> {vet.phone}
            </a>
          )}
          {directions && (
            <a href={directions} target="_blank" rel="noopener noreferrer" className="btn btn-white btn-sm">
              <Navigation className="size-4" aria-hidden="true" /> Yol tarifi
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="btn btn-white btn-sm">
              <ExternalLink className="size-4" aria-hidden="true" /> Web
            </a>
          )}
        </div>
      )}
    </article>
  );
}
