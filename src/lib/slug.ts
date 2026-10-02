const TURKISH: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

/** "Kışın Sokak Hayvanları!" → "kisin-sokak-hayvanlari" (veritabanındaki biçim kuralına uyar) */
export function slugify(text: string) {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (char) => TURKISH[char])
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // şapkalı/aksanlı harflerdeki işaretleri at: â → a, é → e
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const isValidSlug = (slug: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length <= 120;
