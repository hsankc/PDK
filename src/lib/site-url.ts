/**
 * Sitenin tam adresi (paylaşım kartları, site haritası ve arama motorları için).
 * NEXT_PUBLIC_SITE_URL verilmezse Vercel'in üretim adresi, o da yoksa yerel adres kullanılır.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
