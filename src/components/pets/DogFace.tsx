type Look = { x: number; y: number };

/** Beyaz, siyah lekeli, kırmızı tasmalı köpek yüzü. */
export function DogFace({
  look = { x: 0, y: 0 },
  paws = false,
  className,
}: {
  look?: Look;
  paws?: boolean;
  className?: string;
}) {
  const px = look.x * 3;
  const py = look.y * 3;

  return (
    <svg viewBox="0 0 140 130" className={className} aria-hidden="true">
      {/* Sarkık kulaklar */}
      <path d="M34 26 C8 24 2 70 14 90 C22 102 38 88 40 62 Z" fill="#0a0a0a" />
      <path d="M106 26 C132 24 138 70 126 90 C118 102 102 88 100 62 Z" fill="#0a0a0a" />

      {/* Kafa */}
      <ellipse cx="70" cy="66" rx="45" ry="44" fill="#fff" stroke="#0a0a0a" strokeWidth="4" />

      {/* Göz lekesi */}
      <path d="M78 44 C96 38 108 50 104 64 C100 76 84 76 78 66 C74 58 72 48 78 44 Z" fill="#0a0a0a" />

      {/* Gözler */}
      <g className="pet-blink">
        <circle cx="52" cy="60" r="7.5" fill="#fff" stroke="#0a0a0a" strokeWidth="2" />
        <circle cx="90" cy="60" r="7.5" fill="#fff" />
        <g style={{ transform: `translate(${px}px, ${py}px)`, transition: "transform 120ms ease-out" }}>
          <circle cx="52" cy="61" r="4.5" fill="#0a0a0a" />
          <circle cx="90" cy="61" r="4.5" fill="#0a0a0a" />
          <circle cx="53.5" cy="59" r="1.6" fill="#fff" />
          <circle cx="91.5" cy="59" r="1.6" fill="#fff" />
        </g>
      </g>

      {/* Burun, ağız, dil */}
      <ellipse cx="70" cy="78" rx="9" ry="6.5" fill="#0a0a0a" />
      <path className="pet-tongue" d="M63 92 q7 16 14 0 z" fill="#e30a17" stroke="#0a0a0a" strokeWidth="2" />
      <path
        d="M70 84 v6 M70 90 q-7 6 -13 0 M70 90 q7 6 13 0"
        stroke="#0a0a0a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Tasma */}
      <path d="M36 100 Q70 120 104 100 L106 108 Q70 128 34 108 Z" fill="#e30a17" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="70" cy="119" r="5" fill="#fff" stroke="#0a0a0a" strokeWidth="2" />

      {/* Tutunan patiler */}
      {paws && (
        <g fill="#fff" stroke="#0a0a0a" strokeWidth="3">
          <ellipse cx="32" cy="121" rx="16" ry="9" />
          <ellipse cx="108" cy="121" rx="16" ry="9" />
        </g>
      )}
    </svg>
  );
}
