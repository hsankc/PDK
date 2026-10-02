import Link from "next/link";
import { CatFace } from "@/components/pets/CatFace";

export default function NotFound() {
  return (
    <main className="bg-paws bg-mist grid flex-1 place-items-center px-4 py-20">
      <div className="text-center">
        <CatFace paws className="mx-auto w-40" />
        <p className="font-display text-brand mt-6 text-7xl leading-none font-extrabold">404</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold">Bu sayfa kaçmış!</h1>
        <p className="text-ink-soft mt-2 text-lg">Aradığın sayfayı bulamadık. Belki bir kedi alıp götürdü.</p>
        <Link href="/" className="btn btn-red mt-8">
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
