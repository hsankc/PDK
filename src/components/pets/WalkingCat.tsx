"use client";

import { motion, useReducedMotion } from "motion/react";

function WalkingCatSvg() {
  return (
    <svg viewBox="0 0 120 64" className="pet-bob w-full" aria-hidden="true">
      <path
        className="pet-tail"
        d="M31 36 C14 32 9 13 19 5"
        stroke="#0a0a0a"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      <rect className="pet-leg-a" x="36" y="40" width="6" height="21" rx="3" fill="#0a0a0a" />
      <rect className="pet-leg-b" x="46" y="40" width="6" height="21" rx="3" fill="#0a0a0a" />
      <rect className="pet-leg-b" x="72" y="40" width="6" height="21" rx="3" fill="#0a0a0a" />
      <rect className="pet-leg-a" x="82" y="40" width="6" height="21" rx="3" fill="#0a0a0a" />

      <ellipse cx="60" cy="38" rx="30" ry="14" fill="#0a0a0a" />

      <path d="M82 20 L84 3 L95 14 Z" fill="#0a0a0a" />
      <path d="M85 15 L86 8 L91 13 Z" fill="#e30a17" />
      <path d="M98 14 L106 2 L106 20 Z" fill="#0a0a0a" />
      <circle cx="93" cy="26" r="14" fill="#0a0a0a" />
      <circle cx="99" cy="23" r="3.2" fill="#fff" />
      <circle cx="100" cy="23" r="1.6" fill="#0a0a0a" />
      <circle cx="106.5" cy="29" r="1.8" fill="#e30a17" />
      <path d="M81 35 q9 6 18 0" stroke="#e30a17" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <g stroke="#0a0a0a" strokeWidth="1.2" strokeLinecap="round">
        <path d="M105 31 L117 29" />
        <path d="M105 33 L116 36" />
      </g>
    </svg>
  );
}

/** Alt bilginin üst kenarında bir uçtan diğerine yürüyen kedi. */
export function WalkingCat() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-full h-14 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute bottom-0 w-20 sm:w-24"
        initial={{ left: "-12%" }}
        animate={{ left: "108%" }}
        transition={{ duration: 26, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
      >
        <WalkingCatSvg />
      </motion.div>
    </div>
  );
}
