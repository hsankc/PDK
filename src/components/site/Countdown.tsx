"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const timer = setInterval(onTick, 1000);
  return () => clearInterval(timer);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);

/** Etkinliğe kalan süre: gün / saat / dakika / saniye. */
export function Countdown({ target, size = "lg" }: { target: string; size?: "lg" | "sm" }) {
  // Sunucuda null döner; saat yalnızca tarayıcıda çalışır (hydration uyumsuzluğu olmaz)
  const now = useSyncExternalStore(subscribe, nowInSeconds, () => null);
  const targetSeconds = Math.floor(new Date(target).getTime() / 1000);
  const remaining = now === null ? null : Math.max(0, targetSeconds - now);

  if (remaining === 0) {
    return <p className="font-display text-brand text-2xl font-extrabold">Etkinlik başladı!</p>;
  }

  const units = [
    { label: "Gün", value: remaining === null ? null : Math.floor(remaining / 86_400) },
    { label: "Saat", value: remaining === null ? null : Math.floor((remaining % 86_400) / 3_600) },
    { label: "Dakika", value: remaining === null ? null : Math.floor((remaining % 3_600) / 60) },
    { label: "Saniye", value: remaining === null ? null : remaining % 60 },
  ];

  const box = size === "lg" ? "min-w-[4.5rem] px-3 py-3 sm:min-w-[5.5rem]" : "min-w-[3.6rem] px-2 py-2";
  const number = size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl";

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3" role="timer" aria-live="off">
      {units.map((unit) => (
        <div
          key={unit.label}
          className={`${box} border-ink bg-ink text-paper shadow-hard-red flex flex-col items-center rounded-2xl border-2`}
        >
          <span
            className={`font-display relative block h-[1.1em] overflow-hidden leading-none font-extrabold tabular-nums ${number}`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={unit.value ?? "x"}
                className="block"
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {unit.value === null ? "–" : String(unit.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-paper/70 mt-1 text-xs font-bold tracking-wide uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
