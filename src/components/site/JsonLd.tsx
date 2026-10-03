/** Arama motorları için yapılandırılmış veri (schema.org). "<" kaçırılır ki betik etiketi kapanamasın. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
