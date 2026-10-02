"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getResource } from "@/lib/admin/resources";
import type { Field, Option } from "@/lib/admin/types";
import { isoToLocalInput, localInputToIso } from "@/lib/format";
import { isLatLng } from "@/lib/map";
import { emptyDoc, isRichTextDoc, plainText } from "@/lib/richtext";
import { isValidSlug, slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import { DeleteButton } from "./DeleteButton";
import { FieldInput } from "./fields/FieldInput";
import { SaveBar, type SaveStatus } from "./SaveBar";

type Values = Record<string, unknown>;

/** Veritabanı satırından alanın form değerini okur. */
function readField(field: Field, row: Values | null) {
  if (field.type === "location" && field.latField && field.lngField) {
    const lat = row?.[field.latField];
    const lng = row?.[field.lngField];
    return typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null;
  }
  const value = row ? row[field.name] : field.defaultValue;
  switch (field.type) {
    case "datetime":
      return isoToLocalInput(value as string | null);
    case "boolean":
      return Boolean(value);
    case "images":
      return Array.isArray(value) ? value : [];
    case "richtext":
      return isRichTextDoc(value) ? value : emptyDoc;
    default:
      return value ?? "";
  }
}

/** Form değerini veritabanına yazılacak sütun(lar)a çevirir. */
function writeField(field: Field, value: unknown): [string, unknown][] {
  if (field.keepDefaultWhenEmpty && !String(value ?? "").trim()) return [];
  switch (field.type) {
    case "location": {
      const point = isLatLng(value) ? value : null;
      if (field.latField && field.lngField) {
        return [
          [field.latField, point?.lat ?? null],
          [field.lngField, point?.lng ?? null],
        ];
      }
      return [[field.name, point]];
    }
    case "datetime":
      return [[field.name, localInputToIso(String(value ?? ""))]];
    case "date":
      return [[field.name, String(value ?? "") || null]];
    case "boolean":
      return [[field.name, Boolean(value)]];
    case "images":
      return [[field.name, Array.isArray(value) ? value : []]];
    case "richtext":
      return [[field.name, isRichTextDoc(value) ? value : emptyDoc]];
    case "number":
      return [
        [
          field.name,
          value === "" || value === null || value === undefined
            ? ((field.defaultValue as number | undefined) ?? null)
            : Number(value),
        ],
      ];
    default: {
      const text = String(value ?? "").trim();
      return [[field.name, text || null]];
    }
  }
}

function isEmpty(field: Field, value: unknown) {
  if (field.type === "location") return !isLatLng(value);
  if (field.type === "images") return !Array.isArray(value) || value.length === 0;
  if (field.type === "richtext") return !plainText(value);
  return !String(value ?? "").trim();
}

export function ResourceForm({
  slug,
  row,
  relationOptions = {},
}: {
  slug: string;
  row: Values | null;
  relationOptions?: Record<string, Option[]>;
}) {
  const resource = getResource(slug)!;
  const router = useRouter();

  const [initial] = useState<Values>(() =>
    Object.fromEntries(resource.fields.map((field) => [field.name, readField(field, row)])),
  );
  const [values, setValues] = useState<Values>(initial);
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });
  const dirty = JSON.stringify(values) !== JSON.stringify(initial) && status.kind !== "saved";

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Web adresi (slug) boşsa başlıktan üret; yazılmışsa kurala uygun hâle getir
    const prepared: Values = { ...values };
    for (const field of resource.fields) {
      if (field.type !== "slug") continue;
      const source = String(prepared[field.name] ?? "").trim() || String(prepared[field.slugFrom ?? ""] ?? "");
      prepared[field.name] = slugify(source);
      if (!isValidSlug(String(prepared[field.name]))) {
        setStatus({ kind: "error", message: `"${field.label}" için önce başlığı yaz.` });
        return;
      }
    }
    setValues(prepared);

    const missing = resource.fields.find((field) => field.required && isEmpty(field, prepared[field.name]));
    if (missing) {
      setStatus({ kind: "error", message: `"${missing.label}" alanı zorunlu.` });
      document.getElementById(`field-${missing.name}`)?.focus();
      return;
    }

    setStatus({ kind: "saving" });
    const payload = {
      ...Object.fromEntries(resource.fields.flatMap((field) => writeField(field, prepared[field.name]))),
      ...resource.fixed,
    };
    const table = createClient().from(resource.table);
    const { error } = row
      ? await table
          .update(payload)
          .eq("id", row.id as string)
          .select("id")
          .single()
      : await table.insert(payload).select("id").single();

    if (error) {
      setStatus({
        kind: "error",
        message:
          error.code === "23505"
            ? "Bu web adresi başka bir kayıtta kullanılıyor. Adresi biraz değiştirip tekrar dene."
            : `Kaydedilemedi: ${error.message}`,
      });
      return;
    }
    setStatus({ kind: "saved" });
    router.push(`/yonetim/${resource.slug}`);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="card grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
        {resource.fields.map((field) => (
          <FieldInput
            key={field.name}
            field={
              field.type === "relation"
                ? { ...field, type: "select", options: relationOptions[field.name] ?? [] }
                : field
            }
            value={values[field.name]}
            onChange={(value) => setValues((current) => ({ ...current, [field.name]: value }))}
            folder={resource.table}
          />
        ))}
      </div>

      <SaveBar status={status} dirty={dirty} label={row ? "Kaydet" : "Ekle"}>
        {row && (
          <DeleteButton
            table={resource.table}
            id={row.id as string}
            redirectTo={`/yonetim/${resource.slug}`}
            confirmText={`Bu ${resource.singular.toLocaleLowerCase("tr-TR")} kalıcı olarak silinsin mi?`}
          />
        )}
      </SaveBar>
    </form>
  );
}
