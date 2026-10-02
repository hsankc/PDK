import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

const MAX_SIZE = 1920;
const SKIP_TYPES = ["image/gif", "image/svg+xml"];

/** Telefondan gelen büyük fotoğrafları küçültüp WebP'ye çevirir (yükleme hızlanır, depo dolmaz). */
async function compress(file: File): Promise<Blob> {
  if (SKIP_TYPES.includes(file.type)) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 600_000) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  return blob && blob.size < file.size ? blob : file;
}

function extensionFor(type: string) {
  const map: Record<string, string> = {
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };
  return map[type] ?? "bin";
}

/** Resmi Supabase deposuna yükler ve herkese açık adresini döner. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Sadece resim dosyası yüklenebilir.");
  if (file.size > 20_000_000) throw new Error("Dosya çok büyük (en fazla 20 MB).");

  const blob = await compress(file);
  const type = blob.type || file.type;
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extensionFor(type)}`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Yüklenemedi: ${error.message}`);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
