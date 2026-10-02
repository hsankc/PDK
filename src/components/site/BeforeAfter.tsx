"use client";

import { MoveHorizontal } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";

/** Önce / sonra fotoğraflarını sürgüyle karşılaştırma. */
export function BeforeAfter({ before, after, name }: { before: string; after: string; name: string }) {
  const [position, setPosition] = useState(50);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    setTouched(true);
  };

  const onPointerDown = (event: PointerEvent) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  return (
    <div
      ref={ref}
      className="card relative aspect-[4/3] cursor-ew-resize touch-pan-y overflow-hidden select-none"
      onPointerDown={onPointerDown}
      onPointerMove={(event) => dragging.current && moveTo(event.clientX)}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={`${name}: iyileştikten sonra`}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={`${name}: bulunduğunda`} className="size-full object-cover" draggable={false} />
      </div>

      <span className="sticker bg-ink text-paper absolute top-3 left-3 text-xs">Önce</span>
      <span className="sticker bg-brand text-paper absolute top-3 right-3 text-xs">Sonra</span>

      <div className="bg-paper absolute inset-y-0 w-1 -translate-x-1/2" style={{ left: `${position}%` }}>
        {/* Klavye ile de kaydırılabilsin diye görünmez sürgü */}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(position)}
          onChange={(event) => {
            setPosition(Number(event.target.value));
            setTouched(true);
          }}
          aria-label={`${name}: önce ve sonra karşılaştırma`}
          className="peer sr-only"
        />
        <span
          className={`bg-paper border-ink shadow-hard-sm peer-focus-visible:ring-brand pointer-events-none absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 peer-focus-visible:ring-4 ${
            touched ? "" : "animate-pulse"
          }`}
        >
          <MoveHorizontal className="size-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
