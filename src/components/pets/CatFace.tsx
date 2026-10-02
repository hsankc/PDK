type Look = { x: number; y: number };

/** Siyah kedi yüzü. `look` -1..1 aralığında göz bebeklerinin yönü. `paws` altta tutunan patiler. */
export function CatFace({
  look = { x: 0, y: 0 },
  paws = false,
  coverEyes = false,
  className,
}: {
  look?: Look;
  paws?: boolean;
  coverEyes?: boolean;
  className?: string;
}) {
  const px = look.x * 4;
  const py = look.y * 4;

  return (
    <svg viewBox="0 0 140 130" className={className} aria-hidden="true">
      {/* Kulaklar */}
      <path d="M20 62 L28 6 L64 36 Z" fill="#0a0a0a" />
      <path d="M30 50 L34 20 L53 37 Z" fill="#e30a17" />
      <path d="M120 62 L112 6 L76 36 Z" fill="#0a0a0a" />
      <path d="M110 50 L106 20 L87 37 Z" fill="#e30a17" />

      {/* Kafa */}
      <ellipse cx="70" cy="74" rx="56" ry="47" fill="#0a0a0a" />

      {/* Yanaklar */}
      <ellipse cx="36" cy="92" rx="9" ry="5" fill="#e30a17" opacity="0.45" />
      <ellipse cx="104" cy="92" rx="9" ry="5" fill="#e30a17" opacity="0.45" />

      {/* Gözler */}
      <g className="pet-blink">
        <ellipse cx="47" cy="70" rx="13" ry="14" fill="#fff" />
        <ellipse cx="93" cy="70" rx="13" ry="14" fill="#fff" />
        <g style={{ transform: `translate(${px}px, ${py}px)`, transition: "transform 120ms ease-out" }}>
          <ellipse cx="47" cy="71" rx="5.5" ry="10" fill="#0a0a0a" />
          <ellipse cx="93" cy="71" rx="5.5" ry="10" fill="#0a0a0a" />
          <circle cx="49" cy="66" r="2.2" fill="#fff" />
          <circle cx="95" cy="66" r="2.2" fill="#fff" />
        </g>
      </g>

      {/* Burun ve ağız */}
      <path d="M63 88 L77 88 L70 95 Z" fill="#e30a17" strokeLinejoin="round" />
      <path d="M70 95 q-6 8 -13 3 M70 95 q6 8 13 3" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Bıyıklar */}
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
        <path d="M38 88 L8 82" />
        <path d="M38 94 L10 98" />
        <path d="M102 88 L132 82" />
        <path d="M102 94 L130 98" />
      </g>

      {/* Gözlerini kapatan patiler (şifre yazılırken) */}
      {coverEyes && (
        <g>
          <ellipse cx="46" cy="72" rx="19" ry="15" fill="#0a0a0a" stroke="#fff" strokeWidth="2" />
          <ellipse cx="94" cy="72" rx="19" ry="15" fill="#0a0a0a" stroke="#fff" strokeWidth="2" />
          <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
            <path d="M39 60 v7 M46 58 v8 M53 60 v7" />
            <path d="M87 60 v7 M94 58 v8 M101 60 v7" />
          </g>
        </g>
      )}

      {/* Tutunan patiler */}
      {paws && !coverEyes && (
        <g>
          <ellipse cx="34" cy="120" rx="17" ry="10" fill="#0a0a0a" />
          <ellipse cx="106" cy="120" rx="17" ry="10" fill="#0a0a0a" />
          <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
            <path d="M28 114 v6 M34 113 v7 M40 114 v6" />
            <path d="M100 114 v6 M106 113 v7 M112 114 v6" />
          </g>
        </g>
      )}
    </svg>
  );
}
