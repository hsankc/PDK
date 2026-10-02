import { ChevronRight, ExternalLink, ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResourceIcon } from "@/components/admin/ResourceIcon";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAdminSession } from "@/lib/admin/auth";
import { getResource, optionLabel } from "@/lib/admin/resources";
import type { Column, ResourceConfig } from "@/lib/admin/types";
import { formatDate, formatDay, formatMoney } from "@/lib/format";

type Row = Record<string, unknown> & { id: string };

export default async function ResourceListPage({ params, searchParams }: PageProps<"/yonetim/[kaynak]">) {
  const { kaynak } = await params;
  const { durum } = await searchParams;
  const resource = getResource(kaynak);
  if (!resource) notFound();

  const statusFilter = resource.status && typeof durum === "string" ? durum : "";
  const { supabase } = await getAdminSession();

  let query = supabase.from(resource.table).select(resource.listSelect ?? "*");
  if (statusFilter) query = query.eq(resource.status!.field, statusFilter);
  for (const [column, value] of Object.entries(resource.fixed ?? {})) query = query.eq(column, value);
  for (const order of resource.orderBy) query = query.order(order.column, { ascending: order.ascending });
  const { data, error } = await query.limit(500);
  const rows = (data ?? []) as unknown as Row[];

  const [titleColumn, ...metaColumns] = resource.columns.filter((column) => column.type !== "image");
  const imageColumn = resource.columns.find((column) => column.type === "image");

  return (
    <>
      <AdminPageHeader
        title={resource.label}
        description={resource.description}
        actions={
          <>
            {resource.publicPath && (
              <a href={resource.publicPath} target="_blank" rel="noopener noreferrer" className="btn btn-white btn-sm">
                <ExternalLink className="size-4" aria-hidden="true" /> Sitede gör
              </a>
            )}
            {resource.kind === "content" && (
              <Link href={`/yonetim/${resource.slug}/yeni`} className="btn btn-red btn-sm">
                <Plus className="size-4" aria-hidden="true" /> Yeni {resource.singular.toLocaleLowerCase("tr-TR")}
              </Link>
            )}
          </>
        }
      />

      {resource.status && <StatusTabs resource={resource} active={statusFilter} />}

      {error && (
        <p className="card text-brand mb-4 p-5 font-bold">
          Kayıtlar okunamadı: {error.message}. Veritabanı kurulumunu çalıştırdığınızdan emin olun.
        </p>
      )}

      {!error && rows.length === 0 && (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <ResourceIcon name={resource.icon} className="text-brand mb-3 size-10" />
          <p className="font-display text-xl font-extrabold">
            {resource.kind === "inbox"
              ? "Burada henüz bir şey yok"
              : `Henüz ${resource.singular.toLocaleLowerCase("tr-TR")} eklenmedi`}
          </p>
          {resource.kind === "content" && (
            <Link href={`/yonetim/${resource.slug}/yeni`} className="btn btn-red btn-sm mt-5">
              <Plus className="size-4" aria-hidden="true" /> İlkini ekle
            </Link>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/yonetim/${resource.slug}/${row.id}`}
                className="group border-ink bg-paper hover:shadow-hard flex items-center gap-4 rounded-2xl border-2 p-3 transition-all hover:-translate-y-0.5 sm:p-4"
              >
                {imageColumn && <Thumbnail url={valueAt(row, imageColumn.name)} />}
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-display truncate text-lg leading-tight font-extrabold ${
                      resource.status && row[resource.status.field] === resource.status.newValue ? "" : "text-ink/85"
                    }`}
                  >
                    {String(valueAt(row, titleColumn.name) ?? "—")}
                  </p>
                  <div className="text-ink-soft mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {metaColumns.map((column) => (
                      <Cell key={column.name} column={column} value={valueAt(row, column.name)} resource={resource} />
                    ))}
                  </div>
                </div>
                <ChevronRight className="text-ink/40 size-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function StatusTabs({ resource, active }: { resource: ResourceConfig; active: string }) {
  const tabs = [{ value: "", label: "Tümü" }, ...resource.status!.options];
  return (
    <nav className="mb-5 flex flex-wrap gap-2" aria-label="Duruma göre filtrele">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={tab.value ? `/yonetim/${resource.slug}?durum=${tab.value}` : `/yonetim/${resource.slug}`}
          className={`sticker text-xs ${active === tab.value ? "bg-ink text-paper" : "hover:bg-mist"}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

function Thumbnail({ url }: { url: unknown }) {
  if (typeof url === "string" && url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="border-ink size-14 shrink-0 rounded-xl border-2 object-cover" />;
  }
  return (
    <span className="border-ink/30 text-ink/30 grid size-14 shrink-0 place-items-center rounded-xl border-2 border-dashed">
      <ImageIcon className="size-5" aria-hidden="true" />
    </span>
  );
}

/** "vets.name" gibi noktalı sütunlar bağlı tablodan okunur. */
function valueAt(row: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object") return (current as Record<string, unknown>)[key];
    return undefined;
  }, row);
}

function Cell({ column, value, resource }: { column: Column; value: unknown; resource: ResourceConfig }) {
  if (value === null || value === undefined || value === "") return null;

  switch (column.type) {
    case "datetime":
      return <span>{formatDate(String(value), true)}</span>;
    case "date":
      return <span>{formatDay(String(value))}</span>;
    case "money":
      return (
        <span>
          <span className="text-ink/60 font-bold">{column.label}: </span>
          {formatMoney(value as number)}
        </span>
      );
    case "flag":
      return value ? (
        <span className="border-brand text-brand rounded-full border-2 px-2 py-0.5 text-xs font-bold">
          {column.label}
        </span>
      ) : null;
    case "status":
      return <StatusBadge value={value} options={resource.status?.options} />;
    case "boolean":
      return value ? null : (
        <span className="border-ink/30 rounded-full border-2 px-2 py-0.5 text-xs font-bold">Gizli</span>
      );
    default: {
      const field = resource.fields.find((f) => f.name === column.name);
      const text = field?.options ? optionLabel(field.options, value) : String(value);
      return (
        <span className="max-w-[16rem] truncate">
          {column.label && <span className="text-ink/60 font-bold">{column.label}: </span>}
          {text}
        </span>
      );
    }
  }
}
