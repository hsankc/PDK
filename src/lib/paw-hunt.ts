/** Gizli pati avı: patilerin saklandığı sayfalar ve bulunanların tarayıcıda tutulması. */

export const PAW_SPOTS = [
  { id: "hakkimizda", label: "Hakkımızda", href: "/hakkimizda" },
  { id: "etkinlikler", label: "Etkinlikler", href: "/etkinlikler" },
  { id: "sahiplendirme", label: "Sahiplendirme", href: "/sahiplendirme" },
  { id: "kampus-kedileri", label: "Kampüs Kedileri", href: "/kampus-kedileri" },
  { id: "galeri", label: "Pati Galerisi", href: "/galeri" },
  { id: "biliyor-musun", label: "Biliyor musun?", href: "/biliyor-musun" },
  { id: "destek", label: "Destek Ol", href: "/destek" },
] as const;

export type PawSpot = (typeof PAW_SPOTS)[number]["id"];

const KEY = "pdk-patiler";
const EVENT = "pdk-patiler";

/** useSyncExternalStore için ham değer (karşılaştırması kolay olsun diye metin). */
export function readFoundRaw() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseFound(raw: string): PawSpot[] {
  const ids = raw.split(",").filter(Boolean);
  return PAW_SPOTS.map((spot) => spot.id).filter((id) => ids.includes(id));
}

export function markFound(id: PawSpot) {
  const found = parseFound(readFoundRaw());
  if (found.includes(id)) return found;
  const next = [...found, id];
  try {
    localStorage.setItem(KEY, next.join(","));
  } catch {
    // Gizli sekmede kaydedilemeyebilir; bu oturumda yine de sayılır
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  return next;
}

export function subscribeFound(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
