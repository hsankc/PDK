"use client";

import { AlertCircle, Loader2, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition, type FormEvent } from "react";
import { submitScore } from "@/app/(site)/actions";
import type { Game } from "@/lib/data";
import { initialFormState } from "@/lib/forms";

const NAME_KEY = "pdk-oyuncu";

function savedName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Oyun bitince skoru tabloya yazdırır. Ad bir sonraki oyun için tarayıcıda hatırlanır. */
export function ScoreForm({ game, score, seconds }: { game: Game; score: number; seconds?: number }) {
  const [state, formAction, pending] = useActionState(submitScore, initialFormState);
  const [, startTransition] = useTransition();
  const [name, setName] = useState(savedName);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state.status, router]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      localStorage.setItem(NAME_KEY, name.trim());
    } catch {
      // Gizli sekmede kaydedilemezse sorun değil
    }
    startTransition(() => formAction(formData));
  };

  if (state.status === "success") {
    return (
      <p className="bg-paper text-ink flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold">
        <Trophy className="text-brand size-5" aria-hidden="true" /> Skorun tabloya eklendi!
      </p>
    );
  }

  const error = state.errors?.player_name ?? (state.status === "error" ? state.message : undefined);

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="w-full max-w-sm space-y-2">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="game" value={game} />
      <input type="hidden" name="score" value={score} />
      <input type="hidden" name="seconds" value={seconds ?? ""} />
      <label htmlFor={`skor-${game}`} className="sr-only">
        Adın
      </label>
      <div className="flex gap-2">
        <input
          id={`skor-${game}`}
          name="player_name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={20}
          placeholder="Adın ya da takma adın"
          autoComplete="nickname"
          className="field-input min-w-0 flex-1"
          aria-invalid={Boolean(error)}
        />
        <button type="submit" disabled={pending || name.trim().length < 2} className="btn btn-red shrink-0">
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : "Kaydet"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-brand flex items-center gap-1.5 text-sm font-bold">
          <AlertCircle className="size-4" aria-hidden="true" /> {error}
        </p>
      )}
    </form>
  );
}
