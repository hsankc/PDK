"use client";

import { motion, useReducedMotion } from "motion/react";

/** Ekrana girince dolan, çizgili ilerleme çubuğu. */
export function ProgressBar({
  percent,
  label,
  size = "md",
  tone = "brand",
}: {
  percent: number;
  label: string;
  size?: "sm" | "md" | "lg";
  tone?: "brand" | "ink";
}) {
  const reduceMotion = useReducedMotion();
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  const height = { sm: "h-3", md: "h-5", lg: "h-7" }[size];

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={`border-ink bg-mist overflow-hidden rounded-full border-2 ${height}`}
    >
      <motion.div
        className={`bar-stripes h-full rounded-full ${tone === "brand" ? "bg-brand" : "bg-ink"}`}
        initial={{ width: reduceMotion ? `${value}%` : 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
