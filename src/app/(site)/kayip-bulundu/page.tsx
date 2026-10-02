import { Megaphone } from "lucide-react";
import type { Metadata } from "next";
import { LostFoundForm } from "@/components/site/forms/LostFoundForm";
import { LostFoundBoard } from "@/components/site/LostFoundBoard";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getLostFound } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Kayıp & Bulundu" };

export default async function LostFoundPage() {
  const [settings, items] = await Promise.all([getSettings(), getLostFound()]);

  return (
    <>
      <PageHeader eyebrow="Birlikte arayalım" title="Kayıp & Bulundu">
        {settings.lost_found_intro ? (
          <p className="whitespace-pre-line">{settings.lost_found_intro}</p>
        ) : (
          <p>Kaybolan dostları sahiplerine kavuşturmak için ilanları paylaşıyoruz. Gördüysen hemen ara!</p>
        )}
        <a href="#bildir" className="btn btn-red mt-6">
          <Megaphone className="size-5" aria-hidden="true" /> İlan bildir
        </a>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <LostFoundBoard items={items} />

        <section id="bildir" className="mx-auto mt-24 max-w-3xl scroll-mt-24">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold">Kayıp ya da bulduğun bir dost mu var?</h2>
            <p className="text-ink-soft mt-2 text-lg">
              Formu doldur; ekibimiz kontrol edip ilanı yayınlasın ve kulübün sosyal medyasında da paylaşalım.
            </p>
          </Reveal>
          <div className="mt-8">
            <LostFoundForm />
          </div>
        </section>
      </div>
    </>
  );
}
