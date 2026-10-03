"use client";

import { Play, RotateCcw, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PawIcon } from "@/components/pets/PawIcon";
import { ScoreForm } from "./ScoreForm";

export type MemoryFace = { name: string; src?: string; emoji?: string };
type Card = { key: string; pair: number; face: MemoryFace };
type Phase = "ready" | "playing" | "won";

const PAIRS = 8;
const FALLBACK: MemoryFace[] = ["🐱", "🐶", "🐾", "🐟", "🦴", "🐭", "🧶", "🐢"].map((emoji) => ({
  name: emoji,
  emoji,
}));

/** Başlangıçtan bu yana geçen tam saniye. */
const secondsSince = (start: number) => Math.round((Date.now() - start) / 1000);

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Kampüs kedilerinin fotoğraflarıyla eşleştirme oyunu (yeterli fotoğraf yoksa emojilerle). */
export function MemoryGame({ faces }: { faces: MemoryFace[] }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [cards, setCards] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [round, setRound] = useState(0);
  const startedAt = useRef(0);
  const locked = useRef(false);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => setSeconds(secondsSince(startedAt.current)), 500);
    return () => clearInterval(timer);
  }, [phase]);

  const start = () => {
    const pool = shuffle(faces.filter((face) => face.src)).slice(0, PAIRS);
    const chosen = [...pool, ...FALLBACK].slice(0, PAIRS);
    chosen.forEach((face) => {
      if (face.src) new Image().src = face.src;
    });
    setCards(
      shuffle(chosen.flatMap((face, pair) => [0, 1].map((n) => ({ key: `${round}-${pair}-${n}`, pair, face })))),
    );
    setOpen([]);
    setMatched(new Set());
    setMoves(0);
    setSeconds(0);
    startedAt.current = Date.now();
    locked.current = false;
    setRound((value) => value + 1);
    setPhase("playing");
  };

  const flip = (index: number) => {
    if (locked.current || open.includes(index) || matched.has(cards[index].pair)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length < 2) return;

    setMoves((value) => value + 1);
    const [a, b] = next.map((i) => cards[i]);
    if (a.pair === b.pair) {
      const done = new Set(matched).add(a.pair);
      setMatched(done);
      setOpen([]);
      if (done.size === PAIRS) {
        setSeconds(Math.max(1, secondsSince(startedAt.current)));
        setPhase("won");
      }
    } else {
      locked.current = true;
      setTimeout(() => {
        setOpen([]);
        locked.current = false;
      }, 850);
    }
  };

  return (
    <div className="card bg-mist relative overflow-hidden">
      <div className="bg-paper border-ink flex items-center justify-between border-b-2 px-4 py-2.5">
        <span className="font-display text-xl font-extrabold">{moves} hamle</span>
        <span className="flex items-center gap-1.5 font-bold">
          <Timer className="text-brand size-5" aria-hidden="true" /> {seconds} sn
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 p-3 sm:gap-3 sm:p-4">
        {(cards.length ? cards : Array.from({ length: PAIRS * 2 }, () => null)).map((card, index) => {
          const shown = card && (open.includes(index) || matched.has(card.pair));
          return (
            <button
              key={card?.key ?? index}
              type="button"
              disabled={!card || phase !== "playing"}
              onClick={() => flip(index)}
              aria-label={shown && card ? card.face.name : "Kapalı kart"}
              className="aspect-square perspective-distant"
            >
              <span
                className={`relative block size-full transition-transform duration-300 transform-3d ${shown ? "rotate-y-180" : ""}`}
              >
                <span className="bg-brand border-ink absolute inset-0 grid place-items-center rounded-xl border-2 backface-hidden">
                  <PawIcon className="fill-paper/80 size-1/2" />
                </span>
                <span
                  className={`bg-paper absolute inset-0 grid rotate-y-180 place-items-center overflow-hidden rounded-xl border-2 backface-hidden ${
                    card && matched.has(card.pair) ? "border-brand" : "border-ink"
                  }`}
                >
                  {card?.face.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={card.face.src} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="text-3xl sm:text-4xl">{card?.face.emoji}</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {phase !== "playing" && (
        <div className="bg-paper/90 absolute inset-0 top-12 flex flex-col items-center justify-center gap-4 p-6 text-center backdrop-blur-sm">
          {phase === "ready" ? (
            <>
              <p className="text-5xl" aria-hidden="true">
                🃏😺
              </p>
              <h3 className="font-display text-3xl font-extrabold">Hafıza Kartları</h3>
              <p className="text-ink-soft max-w-xs">
                Kampüs kedilerimizin eşlerini bul! Ne kadar az hamle, o kadar iyi.
              </p>
              <button type="button" onClick={start} className="btn btn-red px-7 py-3 text-lg">
                <Play className="size-5" aria-hidden="true" /> Başla
              </button>
            </>
          ) : (
            <>
              <p className="text-5xl" aria-hidden="true">
                😻
              </p>
              <h3 className="font-display text-3xl font-extrabold">Hepsini buldun!</h3>
              <p className="font-display text-brand text-4xl font-extrabold">
                {moves} hamle · {seconds} sn
              </p>
              <ScoreForm key={round} game="hafiza" score={moves} seconds={seconds} />
              <button type="button" onClick={start} className="btn btn-white">
                <RotateCcw className="size-4" aria-hidden="true" /> Tekrar oyna
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
