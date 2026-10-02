/** Panelden girilen bağlantıları güvenli hâle getirir (javascript: vb. engellenir). */
export function safeHref(url: string | null | undefined) {
  const value = (url ?? "").trim();
  if (!value) return "";
  if (/^(https?:|mailto:|tel:)/i.test(value) || value.startsWith("/")) return value;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(value)) return `https://${value}`;
  return "";
}
