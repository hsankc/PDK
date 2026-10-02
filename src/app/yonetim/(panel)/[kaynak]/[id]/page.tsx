import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InboxDetail } from "@/components/admin/InboxDetail";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getAdminSession } from "@/lib/admin/auth";
import { getResource } from "@/lib/admin/resources";
import type { Option } from "@/lib/admin/types";

export default async function ResourceItemPage({ params }: PageProps<"/yonetim/[kaynak]/[id]">) {
  const { kaynak, id } = await params;
  const resource = getResource(kaynak);
  if (!resource) notFound();

  const isNew = id === "yeni";
  if (isNew && resource.kind === "inbox") notFound();

  const { supabase } = await getAdminSession();

  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const { data } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data;
  }

  // Başka tablodan seçilen alanlar (örn. veteriner) için seçenek listesi
  const relationFields = resource.fields.filter((field) => field.type === "relation" && field.relation);
  const relationOptions: Record<string, Option[]> = Object.fromEntries(
    await Promise.all(
      relationFields.map(async (field) => {
        const { table, labelField } = field.relation!;
        const { data } = await supabase.from(table).select(`id, ${labelField}`).order(labelField).limit(500);
        const options = ((data ?? []) as unknown as Record<string, unknown>[]).map((item) => ({
          value: String(item.id),
          label: String(item[labelField] ?? "—"),
        }));
        return [field.name, options] as const;
      }),
    ),
  );

  const back = { href: `/yonetim/${resource.slug}`, label: resource.label };

  if (resource.kind === "inbox" && row) {
    return (
      <>
        <AdminPageHeader title={resource.singular} back={back} />
        <InboxDetail slug={resource.slug} row={row} />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title={
          isNew
            ? `Yeni ${resource.singular.toLocaleLowerCase("tr-TR")}`
            : String(row?.[resource.titleField] ?? resource.singular)
        }
        back={back}
      />
      <ResourceForm slug={resource.slug} row={row} relationOptions={relationOptions} />
    </>
  );
}
