"use client";

import { Crosshair, User } from "lucide-react";
import { useRef, useState } from "react";
import { ClubMap } from "@/components/map/ClubMap";
import { markerSvg, type MapMarker } from "@/components/map/markers";
import type { ShelterLocation } from "@/lib/data";
import type { MapView } from "@/lib/map";
import { labelOf, shelterKindOptions } from "@/lib/options";

/** Harita + tür filtresi + liste; listeden seçilen nokta haritada açılır. */
export function ShelterExplorer({ locations, fallback }: { locations: ShelterLocation[]; fallback: MapView }) {
  const [kind, setKind] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const kinds = shelterKindOptions.filter((option) => locations.some((location) => location.kind === option.value));
  const visible = locations.filter((location) => !kind || location.kind === kind);

  const markers: MapMarker[] = visible.map((location) => ({
    id: location.id,
    lat: location.lat,
    lng: location.lng,
    kind: location.kind,
    title: location.name,
    subtitle: [labelOf(shelterKindOptions, location.kind), location.description].filter(Boolean).join(" · "),
    photoUrl: location.photo_url ?? undefined,
    href: `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
    hrefLabel: "Yol tarifi al",
  }));

  const showOnMap = (id: string) => {
    setSelectedId(null);
    // Aynı noktaya tekrar tıklanınca da uçsun diye önce sıfırla
    requestAnimationFrame(() => setSelectedId(id));
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div>
      {kinds.length > 1 && (
        <div role="group" aria-label="Türe göre filtrele" className="mb-5 flex flex-wrap gap-2">
          {[{ value: "", label: "Tümü" }, ...kinds].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={kind === option.value}
              onClick={() => setKind(option.value)}
              className={`sticker text-sm transition-colors ${kind === option.value ? "bg-ink text-paper" : "hover:bg-mist"}`}
            >
              {option.value && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(markerSvg(option.value as MapMarker["kind"]))}`}
                  alt=""
                  className="h-5 w-4"
                />
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div ref={mapRef} className="card relative isolate h-[60vh] min-h-80 overflow-hidden">
        <ClubMap markers={markers} fallback={fallback} selectedId={selectedId} className="size-full" />
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((location) => (
          <li key={location.id} className="card flex flex-col overflow-hidden">
            {location.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={location.photo_url}
                alt=""
                loading="lazy"
                className="border-ink aspect-video w-full border-b-2 object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-5">
              <p className="text-brand text-xs font-extrabold tracking-widest uppercase">
                {labelOf(shelterKindOptions, location.kind)}
              </p>
              <h3 className="font-display mt-1 text-xl leading-tight font-extrabold">{location.name}</h3>
              {location.description && (
                <p className="text-ink-soft mt-2 text-sm whitespace-pre-line">{location.description}</p>
              )}
              {location.responsible && (
                <p className="text-ink-soft mt-2 flex items-center gap-1.5 text-sm font-bold">
                  <User className="size-4" aria-hidden="true" /> {location.responsible}
                </p>
              )}
              <div className="mt-auto pt-4">
                <button type="button" onClick={() => showOnMap(location.id)} className="btn btn-white btn-sm">
                  <Crosshair className="size-4" aria-hidden="true" /> Haritada göster
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
