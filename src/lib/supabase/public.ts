import { createClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Ziyaretçi sayfaları için oturumsuz istemci.
 * connection() sayesinde sayfalar her istekte güncel veriyi gösterir;
 * panelde yapılan değişiklik anında siteye yansır.
 * Supabase ayarlanmamışsa null döner, sayfalar boş hâlde çalışır.
 */
export async function getPublicClient() {
  await connection();
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
