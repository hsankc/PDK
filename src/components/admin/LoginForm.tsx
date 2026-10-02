"use client";

import { AlertCircle, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { CatFace } from "@/components/pets/CatFace";
import { usePointerLook } from "@/components/pets/usePointerLook";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ clubName }: { clubName: string }) {
  const router = useRouter();
  const catRef = useRef<HTMLDivElement>(null);
  const look = usePointerLook(catRef, 350);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [typingPassword, setTypingPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);

    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });

    if (error) {
      setPending(false);
      setError(
        error.message.includes("Invalid login credentials")
          ? "E-posta ya da şifre hatalı."
          : "Giriş yapılamadı. Biraz sonra tekrar deneyin.",
      );
      return;
    }
    router.replace("/yonetim");
    router.refresh();
  };

  return (
    <div className="bg-paws bg-mist grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div ref={catRef} className="relative z-10 mx-auto -mb-4 w-32">
          {/* Şifre yazılırken kedi gözlerini kapatır */}
          <CatFace paws coverEyes={typingPassword} look={look} className="w-full" />
        </div>
        <form onSubmit={onSubmit} className="card space-y-5 p-7 pt-9">
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold">Yönetici Girişi</h1>
            <p className="text-ink-soft text-sm">{clubName}</p>
          </div>

          <div>
            <label htmlFor="email" className="field-label">
              E-posta
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className="field-input" />
          </div>
          <div>
            <label htmlFor="password" className="field-label">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field-input"
              onFocus={() => setTypingPassword(true)}
              onBlur={() => setTypingPassword(false)}
            />
          </div>

          {error && (
            <p role="alert" className="text-brand flex items-center gap-2 text-sm font-bold">
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> {error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn btn-red w-full py-3">
            {pending ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="size-5" aria-hidden="true" />
            )}
            Giriş yap
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-ink-soft hover:text-ink font-bold">
            ← Siteye dön
          </Link>
        </p>
      </div>
    </div>
  );
}
