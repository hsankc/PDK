"use client";

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { uploadImage } from "@/lib/admin/upload";

type Props = {
  id: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
};

export function ImageField({ id, value, onChange, folder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yüklenemedi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {value ? (
        <div className="flex flex-wrap items-end gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="border-ink bg-mist h-36 max-w-full rounded-2xl border-2 object-contain" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn btn-white btn-sm"
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Değiştir
            </button>
            <button type="button" onClick={() => onChange("")} className="btn btn-white btn-sm text-brand">
              <Trash2 className="size-4" /> Kaldır
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          disabled={uploading}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragging ? "border-brand bg-brand-soft" : "border-ink/40 hover:border-ink hover:bg-paper"
          }`}
        >
          {uploading ? (
            <Loader2 className="text-brand size-7 animate-spin" />
          ) : (
            <ImagePlus className="text-brand size-7" />
          )}
          <span className="font-bold">{uploading ? "Yükleniyor…" : "Resim seç ya da buraya sürükle"}</span>
          <span className="text-ink-soft text-xs">JPG, PNG, WebP · büyük fotoğraflar otomatik küçültülür</span>
        </button>
      )}

      {error && <p className="text-brand mt-2 text-sm font-bold">{error}</p>}
    </div>
  );
}
