"use client";

import { createContext, use } from "react";
import { DEFAULT_MAP_VIEW, type MapView } from "@/lib/map";

/** Paneldeki konum seçicilerin açılış noktası (Site Ayarları > Harita). */
export const MapDefaultsContext = createContext<MapView>(DEFAULT_MAP_VIEW);

export function useMapDefaults() {
  return use(MapDefaultsContext);
}
