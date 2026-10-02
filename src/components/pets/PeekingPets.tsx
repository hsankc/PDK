"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CatFace } from "./CatFace";
import { DogFace } from "./DogFace";
import { usePointerLook } from "./usePointerLook";

type Spot = "bottom-left" | "bottom-right" | "left" | "right";
type Pet = "cat" | "dog";
type Visit = { id: number; pet: Pet; spot: Spot };

const LINES: Record<Pet, string[]> = {
  cat: ["Miyav!", "Mama var mı?", "Prrr…", "Seni gördüm!", "Beni sev!"],
  dog: ["Hav hav!", "Oyun oynayalım mı?", "Kuyruğum sallanıyor!", "Mama saati!", "Kulübe katıl!"],
};

const SPOTS: Spot[] = ["bottom-left", "bottom-right", "left", "right"];

// Ekran kenarına göre konum, kayma yönü ve döndürme
const SPOT_STYLE: Record<
  Spot,
  { box: string; rotate: string; hidden: { x?: string; y?: string }; shown: { x?: string; y?: string }; bubble: string }
> = {
  "bottom-left": {
    box: "bottom-0 left-[5%]",
    rotate: "",
    hidden: { y: "105%" },
    shown: { y: "12%" },
    bubble: "bottom-full left-1/2 mb-1 -translate-x-1/2",
  },
  "bottom-right": {
    box: "bottom-0 right-[7%]",
    rotate: "",
    hidden: { y: "105%" },
    shown: { y: "12%" },
    bubble: "bottom-full left-1/2 mb-1 -translate-x-1/2",
  },
  left: {
    box: "left-0 top-[58%]",
    rotate: "rotate-90",
    hidden: { x: "-105%" },
    shown: { x: "-12%" },
    bubble: "left-full top-0 ml-1",
  },
  right: {
    box: "right-0 top-[38%]",
    rotate: "-rotate-90",
    hidden: { x: "105%" },
    shown: { x: "12%" },
    bubble: "right-full top-0 mr-1",
  },
};

const random = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

/** Ara sıra ekranın kenarından bakıp kaybolan kedi ve köpek. Tıklayınca konuşur. */
export function PeekingPets() {
  const reduceMotion = useReducedMotion();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [line, setLine] = useState<string | null>(null);
  const counter = useRef(0);
  const petRef = useRef<HTMLButtonElement>(null);
  const look = usePointerLook(petRef, 300);

  useEffect(() => {
    if (reduceMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let lastSpot: Spot | null = null;

    const schedule = (delay: number) => {
      timers.push(
        setTimeout(() => {
          if (document.hidden) return schedule(random(5_000, 10_000));
          const spot = pick(SPOTS.filter((s) => s !== lastSpot));
          lastSpot = spot;
          const pet = pick<Pet>(["cat", "dog"]);
          setVisit({ id: ++counter.current, pet, spot });
          setLine(null);
          if (Math.random() < 0.5) timers.push(setTimeout(() => setLine(pick(LINES[pet])), 900));
          timers.push(setTimeout(() => setVisit(null), random(5_000, 7_000)));
          schedule(random(20_000, 40_000));
        }, delay),
      );
    };

    schedule(random(6_000, 10_000));
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  if (reduceMotion) return null;

  const onPetClick = () => {
    if (!visit) return;
    setLine(pick(LINES[visit.pet]));
  };

  return (
    <AnimatePresence>
      {visit && (
        <motion.div
          key={visit.id}
          className={`fixed z-40 w-20 sm:w-28 ${SPOT_STYLE[visit.spot].box}`}
          initial={SPOT_STYLE[visit.spot].hidden}
          animate={SPOT_STYLE[visit.spot].shown}
          exit={SPOT_STYLE[visit.spot].hidden}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
        >
          <AnimatePresence>
            {line && (
              <motion.span
                key={line}
                className={`border-ink bg-paper font-display shadow-hard-sm absolute rounded-2xl border-2 px-3 py-1.5 text-sm font-bold whitespace-nowrap ${SPOT_STYLE[visit.spot].bubble}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                {line}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            ref={petRef}
            type="button"
            onClick={onPetClick}
            aria-label={visit.pet === "cat" ? "Kediyi sev" : "Köpeği sev"}
            className={`block w-full cursor-pointer ${SPOT_STYLE[visit.spot].rotate}`}
          >
            {visit.pet === "cat" ? (
              <CatFace paws look={look} className="w-full drop-shadow-[3px_3px_0_rgba(0,0,0,0.15)]" />
            ) : (
              <DogFace paws look={look} className="w-full drop-shadow-[3px_3px_0_rgba(0,0,0,0.15)]" />
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
