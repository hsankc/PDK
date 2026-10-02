"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { SocialIcon } from "./SocialLinks";
import { copyText } from "./CopyButton";

const noopSubscribe = () => () => {};

/** Paylaş: telefonda sistemin paylaş menüsü, her yerde WhatsApp ve bağlantı kopyalama. */
export function ShareBar({ title }: { title: string }) {
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === "function",
    () => false,
  );
  const [copied, setCopied] = useState(false);

  const shareNative = async () => {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      // kullanıcı vazgeçti
    }
  };

  const shareWhatsApp = () => {
    const text = `${title} ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    if (await copyText(window.location.href)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-ink-soft mr-1 text-sm font-extrabold tracking-widest uppercase">Paylaş</span>
      {canNativeShare && (
        <button type="button" onClick={shareNative} className="btn btn-red btn-sm">
          <Share2 className="size-4" aria-hidden="true" /> Paylaş
        </button>
      )}
      <button type="button" onClick={shareWhatsApp} className="btn btn-white btn-sm">
        <SocialIcon name="whatsapp" className="size-4" /> WhatsApp
      </button>
      <button type="button" onClick={copyLink} className="btn btn-white btn-sm" aria-live="polite">
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
        {copied ? "Kopyalandı!" : "Bağlantıyı kopyala"}
      </button>
    </div>
  );
}
