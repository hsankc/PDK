"use client";

import { Loader2, Mail, Megaphone, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { getResource, optionLabel } from "@/lib/admin/resources";
import { formatDate, formatDay } from "@/lib/format";
import { safeHref } from "@/lib/url";
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

  // Bildirimi başka bölümde (örn. Kayıp & Bulundu) gizli taslak ilana çevir
  const [converting, setConverting] = useState(false);
  const onConvert = async () => {
    const convert = resource.convert;
    const target = convert && getResource(convert.to);
    if (!convert || !target) return;
    setConverting(true);
    const draft = Object.fromEntries(
      Object.entries(convert.map).map(([to, from]) => {
        if (!Array.isArray(from)) return [to, row[from] ?? null];
        const joined = from
          .map((column) => String(row[column] ?? "").trim())
          .filter(Boolean)
          .join(" · ");
        return [to, joined || null];
      }),
    );
    const supabase = createClient();
    const { data, error } = await supabase
      .from(target.table)
      .insert({ ...draft, ...target.fixed, is_published: false })
      .select("id")
      .single();
    if (error || !data) {
      setConverting(false);
      setSaveStatus({ kind: "error", message: `İlan oluşturulamadı: ${error?.message ?? "bilinmeyen hata"}` });
      return;
    }
    await supabase
      .from(resource.table)
      .update({ [statusConfig.field]: convert.setStatus })
      .eq("id", id);
    router.push(`/yonetim/${target.slug}/${data.id}`);
    router.refresh();
  };

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
                  ) : field.type === "url" && safeHref(String(value)) ? (
                    <a
                      href={safeHref(String(value))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand break-all underline"
                    >
                      {String(value)}
                    </a>
                  ) : field.type === "date" ? (
                    formatDay(String(value))
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

      {resource.convert && (
        <div className="card border-brand mt-6 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
          <div>
            <p className="font-display text-lg font-extrabold">{resource.convert.label}</p>
            <p className="text-ink-soft text-sm">
              Bilgiler gizli bir taslak ilana kopyalanır. Fotoğraf ve iletişim bilgisini kontrol edip &quot;Sitede
              göster&quot;i açınca yayınlanır.
            </p>
          </div>
          <button type="button" onClick={onConvert} disabled={converting} className="btn btn-red btn-sm">
            {converting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Megaphone className="size-4" aria-hidden="true" />
            )}
            İlan taslağı oluştur
          </button>
        </div>
      )}

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
