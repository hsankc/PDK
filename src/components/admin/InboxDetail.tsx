"use client";

import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { getResource, optionLabel } from "@/lib/admin/resources";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { DeleteButton } from "./DeleteButton";
import { SaveBar, type SaveStatus } from "./SaveBar";

type Row = Record<string, unknown>;

/** Formlardan gelen bir kaydın ayrıntısı: bilgiler salt okunur, durum ve not düzenlenir. */
export function InboxDetail({ slug, row }: { slug: string; row: Row }) {
  const resource = getResource(slug)!;
  const statusConfig = resource.status!;
  const router = useRouter();
  const id = row.id as string;

  const [status, setStatus] = useState(String(row[statusConfig.field] ?? statusConfig.newValue));
  const [note, setNote] = useState(String(row.admin_note ?? ""));
  const [saved, setSaved] = useState({ status, note });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ kind: "idle" });
  const dirty = status !== saved.status || note !== saved.note;

  // Açılınca "yeni" → "okundu" (tanımlıysa)
  const markedRef = useRef(false);
  useEffect(() => {
    const opened = statusConfig.openedValue;
    if (markedRef.current || !opened || row[statusConfig.field] !== statusConfig.newValue) return;
    markedRef.current = true;
    createClient()
      .from(resource.table)
      .update({ [statusConfig.field]: opened })
      .eq("id", id)
      .then(({ error }) => {
        if (error) return;
        setStatus(opened);
        setSaved((current) => ({ ...current, status: opened }));
        router.refresh();
      });
  }, [id, resource.table, row, router, statusConfig]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaveStatus({ kind: "saving" });
    const { error } = await createClient()
      .from(resource.table)
      .update({ [statusConfig.field]: status, admin_note: note.trim() || null })
      .eq("id", id);
    if (error) {
      setSaveStatus({ kind: "error", message: `Kaydedilemedi: ${error.message}` });
      return;
    }
    setSaved({ status, note });
    setSaveStatus({ kind: "saved" });
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="card p-5 sm:p-7">
        <p className="text-ink-soft text-sm font-bold">Gönderim: {formatDate(String(row.created_at), true)}</p>
        <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {resource.fields.map((field) => {
            const value = row[field.name];
            const empty = value === null || value === undefined || value === "";
            const long = field.type === "textarea";
            return (
              <div key={field.name} className={long ? "sm:col-span-2" : ""}>
                <dt className="text-ink/50 text-xs font-extrabold tracking-wide uppercase">{field.label}</dt>
                <dd className={`mt-1 ${long ? "whitespace-pre-line" : ""} ${empty ? "text-ink/40" : "font-bold"}`}>
                  {empty ? (
                    "—"
                  ) : field.type === "email" ? (
                    <a href={`mailto:${value}`} className="text-brand inline-flex items-center gap-1.5 underline">
                      <Mail className="size-4" aria-hidden="true" /> {String(value)}
                    </a>
                  ) : field.type === "tel" ? (
                    <a
                      href={`tel:${String(value).replace(/\s/g, "")}`}
                      className="text-brand inline-flex items-center gap-1.5 underline"
                    >
                      <Phone className="size-4" aria-hidden="true" /> {String(value)}
                    </a>
                  ) : field.options ? (
                    optionLabel(field.options, value)
                  ) : (
                    String(value)
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <div className="card mt-6 grid gap-5 p-5 sm:grid-cols-[14rem_1fr] sm:p-7">
        <div>
          <label htmlFor="inbox-status" className="field-label">
            Durum
          </label>
          <select id="inbox-status" className="field-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusConfig.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="inbox-note" className="field-label">
            Ekip notu
          </label>
          <textarea
            id="inbox-note"
            rows={3}
            className="field-input resize-y"
            placeholder="Sadece yöneticiler görür. Örn: Aradım, perşembe toplantıya gelecek."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <SaveBar status={saveStatus} dirty={dirty}>
        <DeleteButton
          table={resource.table}
          id={id}
          redirectTo={`/yonetim/${resource.slug}`}
          confirmText="Bu kayıt kalıcı olarak silinsin mi?"
        />
      </SaveBar>
    </form>
  );
}
