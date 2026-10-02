import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/** Panel sayfaları için oturum ve yönetici kontrolü. */
export async function getAdminSession() {
  // Bağlantı yoksa giriş sayfası "kurulum gerekli" ekranını gösterir
  if (!isSupabaseConfigured) redirect("/yonetim/giris");

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { supabase, email: null, isAdmin: false } as const;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) console.error("Yönetici kontrolü başarısız:", error.message);

  return { supabase, email: (claims.email as string | undefined) ?? null, isAdmin: isAdmin === true } as const;
}
