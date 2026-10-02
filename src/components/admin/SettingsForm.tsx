"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { settingsGroups } from "@/lib/admin/settings-schema";
import type { SiteSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/client";
import { FieldInput } from "./fields/FieldInput";
import { SaveBar, type SaveStatus } from "./SaveBar";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<SiteSettings>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });
  const dirty = JSON.stringify(values) !== saved;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.club_name.trim()) {
      setStatus({ kind: "error", message: "Kulüp adı boş olamaz." });
      return;
    }

    setStatus({ kind: "saving" });
    const cleaned: SiteSettings = {
      ...values,
      stats: values.stats.filter((stat) => stat.label.trim()),
    };
    const { data, error } = await createClient()
      .from("site_settings")
      .update({ data: cleaned })
      .eq("id", 1)
      .select("id");

    if (error || !data?.length) {
      setStatus({ kind: "error", message: error ? `Kaydedilemedi: ${error.message}` : "Kaydetme yetkin yok." });
      return;
    }
    setValues(cleaned);
    setSaved(JSON.stringify(cleaned));
    setStatus({ kind: "saved" });
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Ayar bölümleri">
        {settingsGroups.map((group) => (
          <a key={group.id} href={`#${group.id}`} className="sticker hover:bg-ink hover:text-paper text-xs">
            {group.title}
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        {settingsGroups.map((group) => (
          <section key={group.id} id={group.id} className="card scroll-mt-24 p-5 sm:p-7">
            <h2 className="font-display text-xl font-extrabold">{group.title}</h2>
            {group.description && <p className="text-ink-soft mt-1 text-sm">{group.description}</p>}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {group.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={values[field.name as keyof SiteSettings]}
                  onChange={(value) => setValues((current) => ({ ...current, [field.name]: value }))}
                  folder="ayarlar"
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <SaveBar status={status} dirty={dirty} label="Ayarları kaydet" />
    </form>
  );
}
