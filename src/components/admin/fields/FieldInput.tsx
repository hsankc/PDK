"use client";

import type { Field } from "@/lib/admin/types";
import { isLatLng } from "@/lib/map";
import type { Stat } from "@/lib/settings";
import { ImageField } from "./ImageField";
import { ImagesField } from "./ImagesField";
import { LocationField } from "./LocationField";
import { RichTextField } from "./RichTextField";
import { StatsField } from "./StatsField";

type Props = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Resimlerin depoda yükleneceği klasör */
  folder: string;
};

/** Ayar dosyasındaki alan tipine göre doğru giriş kutusunu çizer. */
export function FieldInput({ field, value, onChange, folder }: Props) {
  const id = `field-${field.name}`;

  if (field.type === "boolean") {
    return (
      <div className={field.half ? "" : "sm:col-span-2"}>
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
          <input
            id={id}
            type="checkbox"
            className="peer sr-only"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span className="border-ink bg-mist peer-checked:bg-brand peer-focus-visible:shadow-hard-red after:border-ink after:bg-paper relative h-7 w-12 shrink-0 rounded-full border-2 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:border-2 after:transition-transform peer-checked:after:translate-x-5" />
          <span className="font-display font-bold">{field.label}</span>
        </label>
        {field.help && <p className="field-help ml-15">{field.help}</p>}
      </div>
    );
  }

  return (
    <div className={field.half ? "" : "sm:col-span-2"}>
      <label htmlFor={id} className="field-label">
        {field.label} {field.required && <span className="text-brand">*</span>}
      </label>
      <Control id={id} field={field} value={value} onChange={onChange} folder={folder} />
      {field.help && <p className="field-help">{field.help}</p>}
    </div>
  );
}

function Control({ id, field, value, onChange, folder }: Props & { id: string }) {
  const text = value == null ? "" : String(value);

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          id={id}
          rows={field.rows ?? 4}
          required={field.required}
          placeholder={field.placeholder}
          className="field-input resize-y"
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "number":
      return (
        <input
          id={id}
          type="number"
          required={field.required}
          step={field.step}
          min={field.min}
          max={field.max}
          inputMode={field.step && field.step < 1 ? "decimal" : "numeric"}
          className="field-input"
          value={text}
          onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
        />
      );
    case "richtext":
      return <RichTextField id={id} value={value} onChange={onChange} folder={folder} />;
    case "slug":
      return (
        <input
          id={id}
          type="text"
          className="field-input font-mono text-sm"
          value={text}
          placeholder={field.placeholder ?? "Boş bırakılırsa başlıktan oluşturulur"}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "images":
      return (
        <ImagesField
          id={id}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
          folder={folder}
        />
      );
    case "location":
      return <LocationField id={id} value={isLatLng(value) ? value : null} onChange={onChange} />;
    case "date":
      return (
        <input
          id={id}
          type="date"
          required={field.required}
          className="field-input"
          value={text.slice(0, 10)}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "datetime":
      return (
        <input
          id={id}
          type="datetime-local"
          required={field.required}
          className="field-input"
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "select":
      return (
        <select
          id={id}
          required={field.required}
          className="field-input"
          value={text}
          onChange={(event) => onChange(event.target.value)}
        >
          {!field.required && <option value="">Seçilmedi</option>}
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "image":
      return <ImageField id={id} value={text} onChange={onChange} folder={folder} />;
    case "stats":
      return <StatsField value={Array.isArray(value) ? (value as Stat[]) : []} onChange={onChange} />;
    default:
      return (
        <input
          id={id}
          type={field.type === "text" ? "text" : field.type}
          required={field.required}
          placeholder={field.placeholder ?? (field.type === "url" ? "https://" : undefined)}
          className="field-input"
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }
}
