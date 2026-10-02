"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { uploadImage } from "@/lib/admin/upload";

/** Birden çok fotoğraf: yükle, sırala, kaldır. */
export function ImagesField({
  id,
  value,
  onChange,
  folder,
}: {
  id: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Yükleme sırasında başka değişiklik olursa son hâli kullanmak için
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setUploading(files.length);
    for (const file of Array.from(files)) {
      try {
        const url = await uploadImage(file, folder);
        latest.current = [...latest.current, url];
        onChange(latest.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Yüklenemedi.");
      }
      setUploading((count) => count - 1);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, index) => (
          <div key={url} className="group border-ink relative aspect-square overflow-hidden rounded-xl border-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="size-full object-cover" />
            <div className="bg-ink/60 absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                aria-label="Sola taşı"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className="text-paper grid size-7 place-items-center rounded-full disabled:opacity-30"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Sağa taşı"
                disabled={index === value.length - 1}
                onClick={() => move(index, 1)}
                className="text-paper grid size-7 place-items-center rounded-full disabled:opacity-30"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
            <button
              type="button"
              aria-label="Fotoğrafı kaldır"
              onClick={() => onChange(value.filter((item) => item !== url))}
              className="bg-paper border-ink text-brand absolute top-1 right-1 grid size-7 place-items-center rounded-full border-2"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {Array.from({ length: uploading }, (_, index) => (
          <div
            key={`loading-${index}`}
            className="border-ink/30 grid aspect-square place-items-center rounded-xl border-2 border-dashed"
          >
            <Loader2 className="text-brand size-6 animate-spin" />
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border-ink/40 hover:border-ink hover:bg-paper flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-center text-sm font-bold"
        >
          <ImagePlus className="text-brand size-6" />
          Ekle
        </button>
      </div>
      {error && <p className="text-brand mt-2 text-sm font-bold">{error}</p>}
    </div>
  );
}
