// Canlı Supabase projesindeki izinleri ZİYARETÇİ gözüyle dener (.env.local'deki anahtarla).
// Hiçbir veri yazmaz/silmez; sadece okumayı ve yetkisiz değişikliğin engellendiğini kontrol eder.
// Kullanım: npm run check:live

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => [line.slice(0, line.indexOf("=")).trim(), line.slice(line.indexOf("=") + 1).trim()]),
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error(".env.local içinde Supabase adresi ve anahtarı yok.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

/** Tablo hiç yoksa (göç çalıştırılmamış) PostgREST bu kodları döner. */
const missingTable = (error) => ["PGRST205", "42P01"].includes(error.code);
let failures = 0;
const ok = (message) => console.log(`  ✓ ${message}`);
const fail = (message) => {
  failures++;
  console.log(`  ✗ ${message}`);
};

console.log("Herkese açık tablolar (okunabilmeli):");
const publicTables = [
  "site_settings",
  "team_members",
  "events",
  "adoptions",
  "rescue_stories",
  "vets",
  "shelter_locations",
  "debts",
  "needs",
  "projects",
  "neuter_records",
  "posts",
  "lost_found",
  "campus_pets",
  "facts",
  "gallery_photos",
  "milestones",
  "partners",
  "game_scores",
];
for (const table of publicTables) {
  const { data, error } = await supabase.from(table).select("*").limit(1);
  if (error && missingTable(error)) fail(`${table} tablosu yok (ilgili SQL dosyası çalıştırıldı mı?)`);
  else if (error) fail(`${table}: ${error.message}`);
  else ok(`${table} (${data.length} satır görünüyor)`);
}

console.log("\nGizli tablolar (okunamamalı):");
for (const table of [
  "membership_applications",
  "suggestions",
  "adoption_applications",
  "lost_found_reports",
  "volunteer_applications",
  "admins",
]) {
  const { data, error } = await supabase.from(table).select("*").limit(1);
  if (error && missingTable(error)) fail(`${table} tablosu yok (ilgili SQL dosyası çalıştırıldı mı?)`);
  else if (error || data.length === 0) ok(`${table} gizli`);
  else fail(`${table} ZİYARETÇİYE AÇIK!`);
}

console.log("\nYetki kontrolleri:");
const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
if (rpcError) fail(`is_admin() çağrılamadı: ${rpcError.message}`);
else if (isAdmin) fail("is_admin() ziyaretçide true döndü!");
else ok("is_admin() ziyaretçide false");

const { data: updated, error: updateError } = await supabase
  .from("site_settings")
  .update({ updated_at: new Date().toISOString() })
  .eq("id", 1)
  .select("id");
if (!updateError && updated?.length) fail("Ziyaretçi site ayarlarını DEĞİŞTİREBİLDİ!");
else ok("Ziyaretçi site ayarlarını değiştiremiyor");

const { data: settings } = await supabase.from("site_settings").select("id").eq("id", 1).maybeSingle();
if (settings) ok("Site ayarları satırı mevcut");
else fail("site_settings tablosunda id=1 satırı yok (0001_temel.sql çalıştı mı?)");

console.log(failures ? `\n${failures} kontrol başarısız.` : "\nCanlı veritabanı izinleri doğru.");
process.exit(failures ? 1 : 0);
