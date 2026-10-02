import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAdmin } from "@/components/admin/Notices";
import { getAdminSession } from "@/lib/admin/auth";
import { resources } from "@/lib/admin/resources";
import { mapViewOf } from "@/lib/map";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, email, isAdmin } = await getAdminSession();
  if (!email) redirect("/yonetim/giris");
  if (!isAdmin) return <NotAdmin email={email} />;

  const inbox = resources.filter((resource) => resource.kind === "inbox" && resource.status);
  const [settings, ...counts] = await Promise.all([
    getSettings(),
    ...inbox.map((resource) =>
      supabase
        .from(resource.table)
        .select("id", { count: "exact", head: true })
        .eq(resource.status!.field, resource.status!.newValue),
    ),
  ]);
  const newCounts = Object.fromEntries(inbox.map((resource, index) => [resource.slug, counts[index].count ?? 0]));

  return (
    <AdminShell email={email} clubName={settings.club_name} newCounts={newCounts} mapView={mapViewOf(settings)}>
      {children}
    </AdminShell>
  );
}
