"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLng } from "@/lib/admin/types";
import type { MapView } from "@/lib/map";
import { markerSvg, type MapMarker, type MarkerKind } from "./markers";

// Bu dosya yalnızca tarayıcıda yüklenir (ClubMap.tsx içinde dynamic + ssr:false).

// OpenStreetMap: ücretsiz, anahtar gerektirmez (düşük trafikli siteler için kullanım koşullarına uygun).
// Kulüp renklerine uysun diye globals.css'te gri tonlu gösteriliyor.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları';

const iconCache = new Map<MarkerKind, L.DivIcon>();
function iconFor(kind: MarkerKind) {
  let icon = iconCache.get(kind);
  if (!icon) {
    icon = L.divIcon({
      html: markerSvg(kind),
      className: "club-marker",
      iconSize: [34, 44],
      iconAnchor: [17, 43],
      popupAnchor: [0, -38],
    });
    iconCache.set(kind, icon);
  }
  return icon;
}

function Tiles() {
  return <TileLayer url={TILE_URL} attribution={ATTRIBUTION} maxZoom={19} />;
}

// ---------------------------------------------------------------------------
// Sitede: işaretçili harita
// ---------------------------------------------------------------------------

type MarkersMapProps = {
  markers: MapMarker[];
  fallback: MapView;
  selectedId?: string | null;
  className?: string;
};

export function MarkersMap({ markers, fallback, selectedId, className }: MarkersMapProps) {
  return (
    <MapContainer
      center={[fallback.lat, fallback.lng]}
      zoom={fallback.zoom}
      scrollWheelZoom={false}
      className={className}
    >
      <Tiles />
      <MarkerLayer markers={markers} fallback={fallback} selectedId={selectedId} />
    </MapContainer>
  );
}

function MarkerLayer({ markers, fallback, selectedId }: Omit<MarkersMapProps, "className">) {
  const map = useMap();
  const refs = useRef(new Map<string, L.Marker>());

  // Tüm işaretçiler görünecek şekilde yaklaş
  const boundsKey = markers.map((marker) => `${marker.id}:${marker.lat}:${marker.lng}`).join("|");
  useEffect(() => {
    if (markers.length === 0) map.setView([fallback.lat, fallback.lng], fallback.zoom);
    else if (markers.length === 1) map.setView([markers[0].lat, markers[0].lng], 16);
    else
      map.fitBounds(L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng])), {
        padding: [40, 40],
        maxZoom: 17,
      });
    // boundsKey işaretçilerin kendisini temsil eder
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, boundsKey, fallback.lat, fallback.lng, fallback.zoom]);

  // Listeden seçilen noktaya uç ve balonunu aç
  useEffect(() => {
    if (!selectedId) return;
    const target = markers.find((marker) => marker.id === selectedId);
    if (!target) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 16), { duration: 0.8 });
    refs.current.get(selectedId)?.openPopup();
  }, [map, markers, selectedId]);

  return markers.map((marker) => (
    <Marker
      key={marker.id}
      position={[marker.lat, marker.lng]}
      icon={iconFor(marker.kind)}
      ref={(instance) => {
        if (instance) refs.current.set(marker.id, instance);
        else refs.current.delete(marker.id);
      }}
    >
      <Popup>
        <div className="w-52">
          {marker.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={marker.photoUrl} alt="" className="mb-2 aspect-video w-full rounded-lg object-cover" />
          )}
          <p className="font-display text-base leading-tight font-extrabold">{marker.title}</p>
          {marker.subtitle && <p className="text-ink-soft mt-1 text-sm whitespace-pre-line">{marker.subtitle}</p>}
          {marker.href && (
            <a
              href={marker.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand mt-2 inline-block text-sm font-bold underline"
            >
              {marker.hrefLabel ?? "Yol tarifi"}
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  ));
}

// ---------------------------------------------------------------------------
// Panelde: tıklayarak / sürükleyerek konum seçme
// ---------------------------------------------------------------------------

type PickerMapProps = {
  value: LatLng | null;
  fallback: MapView;
  onChange: (value: LatLng) => void;
  /** Dışarıdan (GPS, bağlantı) konum gelince artar; harita oraya uçar */
  flyKey: number;
  className?: string;
};

export function PickerMap({ value, fallback, onChange, flyKey, className }: PickerMapProps) {
  const initial = useMemo(
    () => (value ? { center: [value.lat, value.lng] as [number, number], zoom: 16 } : null),
    // yalnızca ilk açılış
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <MapContainer
      center={initial?.center ?? [fallback.lat, fallback.lng]}
      zoom={initial?.zoom ?? fallback.zoom}
      className={className}
    >
      <Tiles />
      <PickerLayer value={value} onChange={onChange} flyKey={flyKey} />
    </MapContainer>
  );
}

function PickerLayer({ value, onChange, flyKey }: Pick<PickerMapProps, "value" | "onChange" | "flyKey">) {
  const map = useMap();
  useMapEvents({
    click(event) {
      onChange({ lat: round(event.latlng.lat), lng: round(event.latlng.lng) });
    },
  });

  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  });

  useEffect(() => {
    if (!flyKey || !latest.current) return;
    map.flyTo([latest.current.lat, latest.current.lng], Math.max(map.getZoom(), 17), { duration: 0.8 });
  }, [flyKey, map]);

  if (!value) return null;
  return (
    <Marker
      position={[value.lat, value.lng]}
      icon={iconFor("yuva")}
      draggable
      eventHandlers={{
        dragend(event) {
          const position = (event.target as L.Marker).getLatLng();
          onChange({ lat: round(position.lat), lng: round(position.lng) });
        },
      }}
    />
  );
}

/** 6 basamak ≈ 10 cm hassasiyet; fazlası gereksiz. */
function round(value: number) {
  return Math.round(value * 1e6) / 1e6;
}
