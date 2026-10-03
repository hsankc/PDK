import { getPublicClient } from "@/lib/supabase/public";

/**
 * Ücretsiz Supabase projeleri bir hafta hiç kullanılmazsa uykuya geçer.
 * Vercel bu adresi her gün bir kez çağırır (vercel.json → crons); küçük bir okuma veritabanını uyanık tutar.
 * CRON_SECRET tanımlıysa yalnızca Vercel'in zamanlayıcısı çağırabilir.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Yetkisiz", { status: 401 });
  }

  const supabase = await getPublicClient();
  if (!supabase) return Response.json({ ok: false, error: "Supabase ayarlanmamış" }, { status: 500 });

  const { error } = await supabase.from("site_settings").select("id").eq("id", 1).maybeSingle();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, at: new Date().toISOString() });
}
