import type { LatLng } from "@/lib/admin/types";

export type MapView = { lat: number; lng: number; zoom: number };

/** Harita ayarı girilmemişse Türkiye'nin tamamı görünür. */
export const DEFAULT_MAP_VIEW: MapView = { lat: 39.0, lng: 35.2, zoom: 6 };

export function mapViewOf(settings: { map_center: LatLng | null; map_zoom: number }): MapView {
  if (!settings.map_center) return DEFAULT_MAP_VIEW;
  return { ...settings.map_center, zoom: settings.map_zoom || 15 };
}

export function isLatLng(value: unknown): value is LatLng {
  if (!value || typeof value !== "object") return false;
  const { lat, lng } = value as Record<string, unknown>;
  return typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng);
}

/**
 * Google Maps / OpenStreetMap bağlantısından veya "40.15, 26.41" gibi metinden koordinat çıkarır.
 * Örnekler: .../@40.1467,26.4086,17z · ...?q=40.14,26.40 · ...!3d40.14!4d26.40
 */
export function parseCoordinates(text: string): LatLng | null {
  const value = decodeURIComponent(text.trim());
  const patterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|ll|mlat)=(-?\d+(?:\.\d+)?)[,&](?:mlon=)?(-?\d+(?:\.\d+)?)/,
    /#map=\d+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/,
    /^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/,
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (!match) continue;
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  return null;
}
