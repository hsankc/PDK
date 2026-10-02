"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const format = (value: number, suffix?: string) => `${Math.round(value).toLocaleString("tr-TR")}${suffix ?? ""}`;

/** Ekrana girince 0'dan hedef sayıya kadar sayar. */
export function StatCounter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!inView || !element) return;
    if (reduceMotion) {
      element.textContent = format(value, suffix);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        element.textContent = format(latest, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(0, suffix)}
    </span>
  );
}
