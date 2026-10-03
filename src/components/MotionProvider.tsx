"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Cihazında "hareketi azalt" seçili olan ziyaretçilere animasyonları sadeleştirir. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
