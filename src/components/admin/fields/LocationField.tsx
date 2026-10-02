"use client";

import { ClipboardPaste, LocateFixed, Trash2 } from "lucide-react";
import { useState } from "react";
import { PickerMap } from "@/components/map/ClubMap";
import type { LatLng } from "@/lib/admin/types";
import { parseCoordinates } from "@/lib/map";
import { useMapDefaults } from "../MapDefaults";

/** Haritaya tıklayarak, işaretçiyi sürükleyerek, GPS ile ya da bağlantı yapıştırarak konum seçme. */
export function LocationField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: LatLng | null;
  onChange: (value: LatLng | null) => void;
}) {
  const fallback = useMapDefaults();
  const [flyKey, setFlyKey] = useState(0);
  const [paste, setPaste] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const jumpTo = (next: LatLng) => {
    onChange(next);
    setFlyKey((key) => key + 1);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Bu cihaz konum paylaşımını desteklemiyor.");
      return;
    }
    setLocating(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        jumpTo({
          lat: Math.round(position.coords.latitude * 1e6) / 1e6,
          lng: Math.round(position.coords.longitude * 1e6) / 1e6,
        });
      },
      () => {
        setLocating(false);
        setMessage("Konum alınamadı. Tarayıcıda konum iznini kontrol et.");
      },
      { enableHighAccuracy: true, timeout: 15_000 },
    );
  };

  const applyPaste = () => {
    const parsed = parseCoordinates(paste);
    if (!parsed) {
      setMessage(
        "Bu bağlantıdan konum okunamadı. Kısa bağlantılar (maps.app.goo.gl) yerine tarayıcıdaki uzun adresi ya da “40.1467, 26.4086” gibi koordinatı yapıştır.",
      );
      return;
    }
    setMessage(null);
    setPaste("");
    jumpTo(parsed);
  };

  return (
    <div className="space-y-3">
      <div className="border-ink relative isolate h-72 overflow-hidden rounded-2xl border-2 sm:h-80">
        <PickerMap value={value} fallback={fallback} onChange={onChange} flyKey={flyKey} className="size-full" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={useMyLocation} disabled={locating} className="btn btn-white btn-sm">
          <LocateFixed className={`size-4 ${locating ? "animate-spin" : ""}`} /> Konumumu kullan
        </button>
        {value && (
          <>
            <span id={id} className="bg-mist rounded-full px-3 py-1.5 font-mono text-xs">
              {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
            </span>
            <button type="button" onClick={() => onChange(null)} className="btn btn-white btn-sm text-brand">
              <Trash2 className="size-4" /> Temizle
            </button>
          </>
        )}
        {!value && <span className="text-ink-soft text-sm">Haritaya tıklayarak işaret koy.</span>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={paste}
          onChange={(event) => setPaste(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              applyPaste();
            }
          }}
          placeholder="Google Maps bağlantısı ya da koordinat yapıştır"
          aria-label="Google Maps bağlantısı ya da koordinat"
          className="field-input py-2 text-sm"
        />
        <button type="button" onClick={applyPaste} disabled={!paste.trim()} className="btn btn-black btn-sm shrink-0">
          <ClipboardPaste className="size-4" /> Uygula
        </button>
      </div>

      {message && <p className="text-brand text-sm font-bold">{message}</p>}
    </div>
  );
}
