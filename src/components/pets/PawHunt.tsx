"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { markFound, parseFound, PAW_SPOTS, readFoundRaw, subscribeFound, type PawSpot } from "@/lib/paw-hunt";
import { CatFace } from "./CatFace";
import { DogFace } from "./DogFace";
import { PawIcon } from "./PawIcon";

type Hunt = { enabled: boolean; found: PawSpot[]; find: (id: PawSpot) => void };

const HuntContext = createContext<Hunt>({ enabled: false, found: [], find: () => {} });

export function useFoundPaws() {
  return parseFound(useSyncExternalStore(subscribeFound, readFoundRaw, () => ""));
}

/** Pati avının durumu, bulunca çıkan bildirim ve hepsini bulana tebrik penceresi. */
export function PawHuntProvider({
  enabled,
  message,
  children,
}: {
  enabled: boolean;
  message: string;
  children: ReactNode;
}) {
  const found = useFoundPaws();
  const [toast, setToast] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const find = (id: PawSpot) => {
    if (found.includes(id)) return;
    const next = markFound(id);
    if (next.length === PAW_SPOTS.length) setCelebrate(true);
    else setToast(`Gizli pati buldun! ${next.length}/${PAW_SPOTS.length} 🐾`);
  };

  return (
    <HuntContext.Provider value={{ enabled, found, find }}>
      {children}
      {enabled && (
        <>
          <AnimatePresence>
            {toast && (
              <motion.p
                role="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-ink text-paper shadow-hard-red fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full px-5 py-2.5 font-bold whitespace-nowrap"
              >
                {toast}
              </motion.p>
            )}
          </AnimatePresence>
          {celebrate && <Celebration message={message} onClose={() => setCelebrate(false)} />}
        </>
      )}
    </HuntContext.Provider>
  );
}

/** Sayfalara saklanan küçük pati. Arka plandaki pati desenine karışır. */
export function HiddenPaw({ id, className = "" }: { id: PawSpot; className?: string }) {
  const { enabled, found, find } = useContext(HuntContext);
  const [burst, setBurst] = useState(false);
  if (!enabled) return null;
  const isFound = found.includes(id);

  return (
    <button
      type="button"
      onClick={() => {
        setBurst(true);
        find(id);
      }}
      disabled={isFound}
      aria-label={isFound ? "Bulunan gizli pati" : "Gizli pati"}
      title={isFound ? "Bunu buldun!" : undefined}
      className={`absolute z-10 grid size-9 place-items-center rounded-full transition-transform hover:scale-125 ${className}`}
    >
      <motion.span
        animate={burst ? { scale: [1, 1.8, 1], rotate: [0, -20, 0] } : undefined}
        transition={{ duration: 0.5 }}
        className="block"
      >
        <PawIcon className={`size-6 ${isFound ? "fill-brand/60" : "fill-ink/15"}`} />
      </motion.span>
    </button>
  );
}

function Celebration({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pati-avi-baslik"
      className="bg-ink/60 fixed inset-0 z-[100] grid place-items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {Array.from({ length: 18 }, (_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute top-0"
          style={{ left: `${(i * 37) % 100}%` }}
          initial={{ y: -60, rotate: 0, opacity: 0 }}
          animate={{ y: "105vh", rotate: (i % 2 ? 1 : -1) * 220, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6 + (i % 5) * 0.4, delay: (i % 6) * 0.25, ease: "easeIn" }}
        >
          <PawIcon className={`size-8 ${i % 3 ? "fill-brand" : "fill-paper"}`} />
        </motion.span>
      ))}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(event) => event.stopPropagation()}
        className="card relative max-w-md p-8 text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="hover:bg-mist absolute top-3 right-3 grid size-10 place-items-center rounded-full"
        >
          <X className="size-5" />
        </button>
        <div className="mb-4 flex items-end justify-center gap-2">
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 0.8, repeat: 3 }}>
            <CatFace className="w-20" />
          </motion.div>
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 0.8, repeat: 3, delay: 0.2 }}>
            <DogFace className="w-20" />
          </motion.div>
        </div>
        <h2 id="pati-avi-baslik" className="font-display text-3xl font-extrabold">
          Tebrikler, Pati Avcısı!
        </h2>
        <p className="text-ink-soft mt-3 text-lg whitespace-pre-line">
          {message || `Sitedeki ${PAW_SPOTS.length} gizli patinin hepsini buldun. Gerçek bir pati dedektifisin! 🐾`}
        </p>
        <button type="button" onClick={onClose} className="btn btn-red mt-6">
          Harika!
        </button>
      </motion.div>
    </div>,
    document.body,
  );
}
