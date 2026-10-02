"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * Panoya kopyalar. Yeni pano API'si engelliyse (ör. Instagram'ın uygulama içi tarayıcısı)
 * gizli bir metin kutusu üzerinden eski yöntemi dener.
 */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    area.remove();
    return copied;
  }
}

/** Metni panoya kopyalar; kısa süre "Kopyalandı!" gösterir. */
export function CopyButton({ text, label = "Kopyala" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    const copied = await copyText(text);
    setState(copied ? "copied" : "failed");
    if (copied) setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`btn btn-sm ${state === "copied" ? "btn-black" : "btn-red"}`}
      aria-live="polite"
    >
      {state === "copied" ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {state === "copied" ? "Kopyalandı!" : state === "failed" ? "Kopyalanamadı, elle seç" : label}
    </button>
  );
}
