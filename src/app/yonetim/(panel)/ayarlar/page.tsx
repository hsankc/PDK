import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAdminSession } from "@/lib/admin/auth";
import { mergeSettings } from "@/lib/settings";

export default async function SettingsPage() {
  const { supabase } = await getAdminSession();
  const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();

  return (
    <>
      <AdminPageHeader
        title="Site Ayarları"
        description="Kulüp bilgileri, ana sayfa yazıları, sayaçlar, iletişim ve duyuru bandı."
      />
      {error ? (
        <p className="card text-brand p-5 font-bold">
          Ayarlar okunamadı: {error.message}. Veritabanı kurulumunu (SQL dosyası) çalıştırdığınızdan emin olun.
        </p>
      ) : (
        <SettingsForm initial={mergeSettings(data?.data)} />
      )}
    </>
  );
}
