import type { ReactNode } from "react";
import { HiddenPaw } from "@/components/pets/PawHunt";
import { PawIcon } from "@/components/pets/PawIcon";
import type { PawSpot } from "@/lib/paw-hunt";

export function PageHeader({
  eyebrow,
  title,
  children,
  paw,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  /** Gizli pati avı: bu başlığa saklanan patinin kimliği ve yeri */
  paw?: { id: PawSpot; className: string };
}) {
  return (
    <section className="bg-paws border-ink bg-mist relative overflow-hidden border-b-2">
      <PawIcon className="fill-brand/10 absolute -right-6 -bottom-8 size-40 rotate-12 sm:size-56" />
      {paw && <HiddenPaw id={paw.id} className={paw.className} />}
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && <p className="sticker bg-brand text-paper mb-4 -rotate-2">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-[1.05] font-extrabold sm:text-6xl">{title}</h1>
        {children && <div className="text-ink-soft mt-4 max-w-2xl text-lg">{children}</div>}
      </div>
    </section>
  );
}
