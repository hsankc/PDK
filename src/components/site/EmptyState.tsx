import type { ReactNode } from "react";
import { CatFace } from "@/components/pets/CatFace";

/** İçerik henüz eklenmemişse gösterilen sevimli boş durum. */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <CatFace className="mb-5 w-28 opacity-90" />
      <p className="font-display text-2xl font-extrabold">{title}</p>
      {children && <div className="text-ink-soft mt-2">{children}</div>}
    </div>
  );
}
