"use client";

import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Leaflet tarayıcı dışında çalışmaz; haritalar sadece istemcide yüklenir.

function MapLoading() {
  return (
    <div className="bg-mist flex size-full items-center justify-center">
      <MapPin className="text-brand size-8 animate-bounce" aria-hidden="true" />
      <span className="sr-only">Harita yükleniyor</span>
    </div>
  );
}

export const ClubMap = dynamic(() => import("./LeafletMaps").then((module) => module.MarkersMap), {
  ssr: false,
  loading: MapLoading,
});

export const PickerMap = dynamic(() => import("./LeafletMaps").then((module) => module.PickerMap), {
  ssr: false,
  loading: MapLoading,
});
