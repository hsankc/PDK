export type MarkerKind = "besleme" | "su" | "kulube" | "yuva" | "diger" | "vet";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  kind: MarkerKind;
  title: string;
  subtitle?: string;
  photoUrl?: string;
  href?: string;
  hrefLabel?: string;
};

const GLYPHS: Record<MarkerKind, string> = {
  // pati
  besleme:
    '<g transform="scale(0.4)"><ellipse cx="20" cy="27" rx="9" ry="7.5"/><ellipse cx="8.5" cy="17" rx="3.8" ry="4.6"/><ellipse cx="15.5" cy="10" rx="3.8" ry="4.8"/><ellipse cx="24.5" cy="10" rx="3.8" ry="4.8"/><ellipse cx="31.5" cy="17" rx="3.8" ry="4.6"/></g>',
  // damla
  su: '<path d="M8 1.5C8 1.5 2.5 8 2.5 11a5.5 5.5 0 0 0 11 0C13.5 8 8 1.5 8 1.5z"/>',
  // ev
  kulube: '<path d="M8 1.5 1 7.8h2.2V14h3.6v-3.6h2.4V14h3.6V7.8H15z"/>',
  yuva: '<path d="M8 14.5S1.5 10.3 1.5 5.9A3.4 3.4 0 0 1 8 4.3a3.4 3.4 0 0 1 6.5 1.6c0 4.4-6.5 8.6-6.5 8.6z"/>',
  diger: '<circle cx="8" cy="8" r="4"/>',
  // artı (veteriner)
  vet: '<path d="M6 1.5h4v4.5h4.5v4H10v4.5H6V10H1.5V6H6z"/>',
};

const COLORS: Record<MarkerKind, string> = {
  besleme: "#e30a17",
  su: "#0a0a0a",
  kulube: "#0a0a0a",
  yuva: "#e30a17",
  diger: "#3a3a3a",
  vet: "#e30a17",
};

/** Kırmızı/siyah damla şeklinde, içinde simge olan işaretçi (SVG). */
export function markerSvg(kind: MarkerKind) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44"><path d="M17 42.5s14.5-14.2 14.5-25.5a14.5 14.5 0 0 0-29 0C2.5 28.3 17 42.5 17 42.5z" fill="${COLORS[kind]}" stroke="#0a0a0a" stroke-width="2.5"/><g transform="translate(9 9)" fill="#fff">${GLYPHS[kind]}</g></svg>`;
}
