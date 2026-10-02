import QRCode from "qrcode";

/** Sunucuda QR kod üretir; <img src> olarak kullanılacak SVG data adresi döner. */
export async function qrDataUri(text: string) {
  const svg = await QRCode.toString(text, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** "tr12 0006 ..." → "TR120006..." */
export function compactIban(iban: string) {
  return iban.replace(/\s+/g, "").toUpperCase();
}

/** "TR120006..." → "TR12 0006 ..." (dörderli gruplar) */
export function formatIban(iban: string) {
  return compactIban(iban)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
