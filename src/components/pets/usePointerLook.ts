"use client";

import { useEffect, useState, type RefObject } from "react";

/** Fare/parmak konumuna göre -1..1 aralığında bakış yönü döner (gözlerin imleci takip etmesi için). */
export function usePointerLook(ref: RefObject<Element | null>, range = 400) {
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = ref.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        setLook({
          x: clamp((event.clientX - (rect.left + rect.width / 2)) / range),
          y: clamp((event.clientY - (rect.top + rect.height / 2)) / range),
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [ref, range]);

  return look;
}
