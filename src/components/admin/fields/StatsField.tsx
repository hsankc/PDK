"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Stat } from "@/lib/settings";

export function StatsField({ value, onChange }: { value: Stat[]; onChange: (stats: Stat[]) => void }) {
  const update = (index: number, patch: Partial<Stat>) =>
    onChange(value.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)));

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.map((stat, index) => (
        <div
          key={index}
          className="border-ink/15 bg-mist grid gap-2 rounded-2xl border-2 p-3 sm:grid-cols-[1fr_7rem_5rem_auto]"
        >
          <input
            aria-label="Açıklama"
            placeholder="Açıklama (örn: Kısırlaştırılan kedi)"
            className="field-input"
            value={stat.label}
            onChange={(event) => update(index, { label: event.target.value })}
          />
          <input
            aria-label="Sayı"
            placeholder="Sayı"
            type="number"
            min={0}
            className="field-input"
            value={Number.isFinite(stat.value) ? stat.value : ""}
            onChange={(event) => update(index, { value: event.target.valueAsNumber || 0 })}
          />
          <input
            aria-label="Ek"
            placeholder="Ek (+)"
            className="field-input"
            value={stat.suffix ?? ""}
            maxLength={4}
            onChange={(event) => update(index, { suffix: event.target.value })}
          />
          <div className="flex gap-1">
            <IconButton label="Yukarı taşı" onClick={() => move(index, -1)} disabled={index === 0}>
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton label="Aşağı taşı" onClick={() => move(index, 1)} disabled={index === value.length - 1}>
              <ArrowDown className="size-4" />
            </IconButton>
            <IconButton label="Sil" onClick={() => onChange(value.filter((_, i) => i !== index))}>
              <Trash2 className="text-brand size-4" />
            </IconButton>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, { label: "", value: 0, suffix: "" }])}
        className="btn btn-white btn-sm"
      >
        <Plus className="size-4" /> Sayaç ekle
      </button>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="border-ink bg-paper grid size-10 place-items-center rounded-xl border-2 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
