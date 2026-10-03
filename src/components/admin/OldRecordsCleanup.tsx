"use client";

import { Loader2, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Formlardan gelen kayıtlar: KVKK metninde 1 yıl içinde silineceğini söylüyoruz. */
export const INBOX_TABLES = [
  "membership_applications",
  "adoption_applications",
  "volunteer_applications",
  "lost_found_reports",
  "suggestions",
] as const;

/** 1 yıldan eski başvuru ve mesajlar varsa hatırlatır, onay alınca siler. */
export function OldRecordsCleanup({ count, cutoff }: { count: number; cutoff: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (count === 0) return null;

  const onClean = async () => {
    if (!window.confirm(`1 yıldan eski ${count} başvuru ve mesaj kalıcı olarak silinecek. Devam edilsin mi?`)) return;
    setPending(true);
    setError(null);
    const supabase = createClient();
    for (const table of INBOX_TABLES) {
      const { error: deleteError } = await supabase.from(table).delete().lt("created_at", cutoff);
      if (deleteError) {
        setError(`Silinemedi: ${deleteError.message}`);
        setPending(false);
        return;
      }
    }
    setPending(false);
    router.refresh();
  };

  return (
    <section className="card mt-8 flex flex-wrap items-center gap-4 p-5 sm:p-6">
      <ShieldCheck className="text-brand size-8 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-xl font-extrabold">KVKK hatırlatması</h2>
        <p className="text-ink-soft text-sm">
          1 yıldan eski <b>{count}</b> başvuru ve mesaj var.{" "}
          <Link href="/kvkk" target="_blank" className="text-brand font-bold underline">
            Aydınlatma metninde
          </Link>{" "}
          bunları 1 yıl içinde sileceğimizi söylüyoruz. Saklaman gereken bir bilgi varsa önce not al.
        </p>
        {error && (
          <p role="alert" className="text-brand mt-1 text-sm font-bold">
            {error}
          </p>
        )}
      </div>
      <button type="button" onClick={onClean} disabled={pending} className="btn btn-white btn-sm text-brand">
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="size-4" aria-hidden="true" />
        )}
        Eski kayıtları sil
      </button>
    </section>
  );
}
