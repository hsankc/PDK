"use client";

import { Check, Loader2, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

export type SaveStatus = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

/** Formların altında yapışık duran kaydet çubuğu. Kaydedilmemiş değişiklik varsa sayfadan çıkarken uyarır. */
export function SaveBar({
  status,
  dirty,
  label = "Kaydet",
  children,
}: {
  status: SaveStatus;
  dirty: boolean;
  label?: string;
  children?: ReactNode;
}) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <div className="border-ink bg-paper/95 sticky bottom-0 z-30 -mx-4 mt-8 border-t-2 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status.kind === "saving"} className="btn btn-red">
          {status.kind === "saving" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {label}
        </button>
        <AnimatePresence mode="wait">
          {status.kind === "saved" && !dirty && (
            <motion.span
              key="saved"
              className="flex items-center gap-1.5 font-bold text-green-700"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <Check className="size-5" aria-hidden="true" /> Kaydedildi
            </motion.span>
          )}
          {status.kind === "error" && (
            <motion.span
              key="error"
              role="alert"
              className="text-brand font-bold"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              {status.message}
            </motion.span>
          )}
          {dirty && status.kind !== "error" && status.kind !== "saving" && (
            <motion.span
              key="dirty"
              className="text-ink-soft text-sm font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Kaydedilmemiş değişiklikler var
            </motion.span>
          )}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
}
