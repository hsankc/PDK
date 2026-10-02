"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PawIcon } from "./PawIcon";

type Paw = { id: number; x: number; y: number; rotate: number };

/** Sayfada tıklanan yerde kısa süreli pati izi bırakır. */
export function PawClicks() {
  const reduceMotion = useReducedMotion();
  const [paws, setPaws] = useState<Paw[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const id = ++counter.current;
      setPaws((current) => [
        ...current.slice(-6),
        { id, x: event.clientX, y: event.clientY, rotate: Math.round(Math.random() * 50 - 25) },
      ]);
      setTimeout(() => setPaws((current) => current.filter((paw) => paw.id !== id)), 800);
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <AnimatePresence>
        {paws.map((paw) => (
          <motion.div
            key={paw.id}
            className="absolute size-7 -translate-x-1/2 -translate-y-1/2"
            style={{ left: paw.x, top: paw.y, rotate: paw.rotate }}
            initial={{ scale: 0.3, opacity: 0.95 }}
            animate={{ scale: 1, opacity: 0, y: -16 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <PawIcon className="fill-brand size-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
