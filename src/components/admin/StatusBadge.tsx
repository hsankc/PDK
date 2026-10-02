import type { Option } from "@/lib/admin/types";
import { optionLabel } from "@/lib/admin/resources";

const tones: Record<string, string> = {
  yeni: "border-brand bg-brand text-paper",
  kabul: "border-green-700 bg-green-100 text-green-800",
  cozuldu: "border-green-700 bg-green-100 text-green-800",
  red: "border-ink/30 bg-mist text-ink-soft",
};

export function StatusBadge({ value, options }: { value: unknown; options?: Option[] }) {
  const tone = tones[String(value)] ?? "border-ink bg-paper text-ink";
  return (
    <span
      className={`inline-flex rounded-full border-2 px-2.5 py-0.5 text-xs font-extrabold whitespace-nowrap ${tone}`}
    >
      {optionLabel(options, value)}
    </span>
  );
}
