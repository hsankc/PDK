"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { CatFace } from "./CatFace";
import { DogFace } from "./DogFace";
import { PawIcon } from "./PawIcon";
import { usePointerLook } from "./usePointerLook";

const floatingPaws = [
  { className: "left-[14%] top-[16%] size-7", delay: 0 },
  { className: "right-[18%] top-[10%] size-5", delay: 0.8 },
  { className: "right-[10%] top-[36%] size-6", delay: 1.6 },
  { className: "left-[8%] top-[42%] size-4", delay: 2.2 },
];

/** Ana sayfa görseli yokken gösterilen çizim: duvarın üstünden bakan kedi ve köpek. */
export function HeroPets({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const look = usePointerLook(ref, 500);
  const [talking, setTalking] = useState<"cat" | "dog" | null>(null);

  const talk = (pet: "cat" | "dog") => {
    setTalking(pet);
    setTimeout(() => setTalking((current) => (current === pet ? null : current)), 1400);
  };

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[30rem] select-none">
      <motion.div
        className="bg-paws-light border-ink bg-brand shadow-hard-lg absolute inset-x-[8%] top-[2%] aspect-square rounded-full border-4"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      />

      {floatingPaws.map((paw) => (
        <motion.div
          key={paw.className}
          className={`absolute ${paw.className}`}
          animate={{ y: [0, -10, 0], rotate: [-10, 8, -10] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: paw.delay, ease: "easeInOut" }}
        >
          <PawIcon className="fill-paper size-full" />
        </motion.div>
      ))}

      <motion.span
        className="sticker shadow-hard-sm absolute top-[8%] left-[2%] -rotate-6"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Miyav!
      </motion.span>
      <motion.span
        className="sticker bg-ink text-paper shadow-hard-red absolute top-[22%] right-[0%] rotate-6"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.9, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
      >
        Hav hav!
      </motion.span>

      <motion.button
        type="button"
        aria-label="Kediyi sev"
        onClick={() => talk("cat")}
        className="absolute bottom-[15%] left-[4%] w-[46%] cursor-pointer"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 120, damping: 12 }}
        whileHover={{ y: -8 }}
      >
        <SpeechBubble show={talking === "cat"} text="Prrr…" />
        <CatFace paws look={look} className="w-full" />
      </motion.button>

      <motion.button
        type="button"
        aria-label="Köpeği sev"
        onClick={() => talk("dog")}
        className="absolute right-[4%] bottom-[15%] w-[46%] cursor-pointer"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120, damping: 12 }}
        whileHover={{ y: -8 }}
      >
        <SpeechBubble show={talking === "dog"} text="Hav!" />
        <DogFace paws look={look} className="w-full" />
      </motion.button>

      <div className="bg-paws-light border-ink bg-ink absolute inset-x-0 bottom-[3%] flex h-[14%] items-center justify-center rounded-2xl border-4 px-4">
        <span className="font-display text-paper truncate text-xl font-extrabold tracking-wider uppercase sm:text-2xl">
          {label}
        </span>
      </div>
    </div>
  );
}

function SpeechBubble({ show, text }: { show: boolean; text: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className="border-ink bg-paper font-display shadow-hard-sm absolute -top-6 left-1/2 z-10 -translate-x-1/2 rounded-2xl border-2 px-3 py-1 text-base font-bold whitespace-nowrap"
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
