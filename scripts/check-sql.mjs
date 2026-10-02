// Supabase SQL dosyalarını bilgisayarda (PGlite = tarayıcısız, gömülü Postgres) dener.
// Supabase'in auth/storage şemalarını taklit eder, göçleri iki kez çalıştırır (tekrar çalıştırılabilir mi?)
// ve satır güvenliği (RLS) kurallarını ziyaretçi / üye / yönetici gözüyle test eder.
// Kullanım: npm run check:sql

import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MIGRATIONS = "supabase/migrations";
const db = new PGlite();

const STUBS = `
  create role anon nologin;
  create role authenticated nologin;
  grant usage on schema public to anon, authenticated;

  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text unique);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;

  create schema storage;
  create table storage.buckets (
    id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant usage on schema storage to anon, authenticated;
  grant select on storage.buckets to anon, authenticated;
  grant select, insert, update, delete on storage.objects to anon, authenticated;
`;

let failures = 0;
const ok = (message) => console.log(`  ✓ ${message}`);
const fail = (message, detail) => {
  failures++;
  console.log(`  ✗ ${message}${detail ? `\n      ${detail}` : ""}`);
};

/** Sorguyu belirli bir rol ve kullanıcı olarak çalıştırır. */
async function as(who, sql, params = []) {
  const uid = who.uid ?? "";
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [uid]);
  await db.exec(`set role ${who.role}`);
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role");
  }
}

async function expectRows(who, label, sql, count, params) {
  try {
    const result = await as(who, sql, params);
    const rows = result.affectedRows ?? result.rows.length;
    const actual = sql.trim().toLowerCase().startsWith("select") ? result.rows.length : rows;
    actual === count ? ok(label) : fail(label, `beklenen ${count} satır, gelen ${actual}`);
  } catch (error) {
    fail(label, error.message);
  }
}

/** Erişim engellenmeli: ya "izin yok" hatası ya da 0 satır (Supabase'de varsayılan izinler olduğu için 0 satır döner). */
async function expectDenied(who, label, sql, params) {
  try {
    const result = await as(who, sql, params);
    const count = sql.trim().toLowerCase().startsWith("select") ? result.rows.length : (result.affectedRows ?? 0);
    count === 0 ? ok(label) : fail(label, `${count} satıra erişildi`);
  } catch {
    ok(label);
  }
}

async function expectError(who, label, sql, params) {
  try {
    await as(who, sql, params);
    fail(label, "hata bekleniyordu ama sorgu başarılı oldu");
  } catch {
    ok(label);
  }
}

// ---------------------------------------------------------------------------

console.log("Göçler çalıştırılıyor…");
await db.exec(STUBS);
const files = readdirSync(MIGRATIONS)
  .filter((file) => file.endsWith(".sql"))
  .sort();
for (const round of [1, 2]) {
  for (const file of files) {
    try {
      await db.exec(readFileSync(join(MIGRATIONS, file), "utf8"));
    } catch (error) {
      fail(`${file} (${round}. çalıştırma)`, error.message);
    }
  }
}
if (!failures) ok(`${files.length} dosya iki kez hatasız çalıştı`);

const adminId = "00000000-0000-0000-0000-00000000000a";
const memberId = "00000000-0000-0000-0000-00000000000b";
await db.exec(`
  insert into auth.users (id, email) values ('${adminId}', 'yonetici@ornek.com'), ('${memberId}', 'uye@ornek.com');
`);
await db.exec(readFileSync("supabase/yonetici-ekle.sql", "utf8").replace("ornek@eposta.com", "yonetici@ornek.com"));

const anon = { role: "anon" };
const member = { role: "authenticated", uid: memberId };
const admin = { role: "authenticated", uid: adminId };

console.log("\nFaz 0 — ayarlar, yöneticiler, medya");
await expectRows(anon, "ziyaretçi site ayarlarını okur", "select * from site_settings", 1);
await expectError(anon, "ziyaretçi ayarları değiştiremez", "update site_settings set data = '{}' where id = 1");
await expectDenied(
  member,
  "yönetici olmayan üye ayarları değiştiremez",
  "update site_settings set data = '{}' where id = 1",
);
await expectRows(
  admin,
  "yönetici ayarları değiştirir",
  `update site_settings set data = '{"club_name":"Test"}' where id = 1`,
  1,
);
await expectRows(anon, "is_admin() ziyaretçide false", "select 1 where public.is_admin()", 0);
await expectRows(admin, "is_admin() yöneticide true", "select 1 where public.is_admin()", 1);
await expectDenied(member, "üye yönetici listesini göremez", "select * from admins");
await expectRows(anon, "medya deposu herkese açık", "select * from storage.buckets where id = 'media' and public", 1);
await expectRows(
  admin,
  "yönetici resim yükler",
  "insert into storage.objects (bucket_id, name) values ('media', 'a.webp')",
  1,
);
await expectError(
  member,
  "üye resim yükleyemez",
  "insert into storage.objects (bucket_id, name) values ('media', 'b.webp')",
);

console.log("\nFaz 1 — ekip, etkinlikler, başvurular, öneriler");
await expectRows(
  admin,
  "yönetici ekip üyesi ekler",
  "insert into team_members (name, is_published) values ('Görünür', true), ('Gizli', false)",
  2,
);
await expectRows(anon, "ziyaretçi sadece yayındaki üyeyi görür", "select * from team_members", 1);
await expectError(anon, "ziyaretçi ekip üyesi ekleyemez", "insert into team_members (name) values ('x')");
await expectRows(
  admin,
  "yönetici etkinlik ekler",
  "insert into events (title, starts_at) values ('Mama günü', now() + interval '3 days')",
  1,
);
await expectRows(anon, "ziyaretçi etkinliği görür", "select * from events", 1);
await expectRows(
  anon,
  "ziyaretçi üyelik başvurusu gönderir",
  "insert into membership_applications (full_name, email) values ('Ali Veli', 'ali@ornek.com')",
  1,
);
await expectError(
  anon,
  "ziyaretçi başvuruyu 'kabul' olarak gönderemez",
  "insert into membership_applications (full_name, email, status) values ('Ali', 'a@b.co', 'kabul')",
);
await expectDenied(anon, "ziyaretçi başvuruları okuyamaz", "select * from membership_applications");
await expectDenied(member, "üye başvuruları okuyamaz", "select * from membership_applications");
await expectRows(admin, "yönetici başvuruları okur", "select * from membership_applications", 1);
await expectRows(
  anon,
  "ziyaretçi isimsiz öneri gönderir",
  "insert into suggestions (kind, message) values ('oneri', 'Kampüse mama kabı')",
  1,
);
await expectError(
  anon,
  "ziyaretçi yönetici notu yazamaz",
  "insert into suggestions (message, admin_note) values ('abc', 'hack')",
);
await expectRows(admin, "yönetici öneriyi 'okundu' yapar", "update suggestions set status = 'okundu'", 1);
await expectDenied(anon, "ziyaretçi öneri silemez", "delete from suggestions");
await expectDenied(member, "üye öneri silemez", "delete from suggestions");

console.log("\nFaz 2 — sahiplendirme, iyileşenler, veterinerler, yuvalar");
await expectRows(
  admin,
  "yönetici ilan ekler (fotoğraf listesiyle)",
  "insert into adoptions (name, species, photos, is_published) values ('Pamuk', 'kedi', array['a.webp','b.webp'], true), ('Taslak', 'kopek', '{}', false)",
  2,
);
await expectRows(anon, "ziyaretçi sadece yayındaki ilanı görür", "select * from adoptions", 1);
await expectError(anon, "geçersiz tür reddedilir", "insert into adoptions (name, species) values ('x', 'kus')");
await expectRows(
  anon,
  "ziyaretçi sahiplenme başvurusu gönderir",
  "insert into adoption_applications (adoption_id, animal_name, full_name, phone) select id, name, 'Ayşe Yılmaz', '05551112233' from adoptions where name = 'Pamuk'",
  1,
);
await expectError(
  anon,
  "telefonsuz başvuru reddedilir",
  "insert into adoption_applications (full_name, phone) values ('Ayşe', '')",
);
await expectDenied(anon, "ziyaretçi sahiplenme başvurularını okuyamaz", "select * from adoption_applications");
await expectRows(admin, "yönetici sahiplenme başvurularını okur", "select * from adoption_applications", 1);
await expectRows(admin, "ilan silinince başvuru kalır", "delete from adoptions where name = 'Pamuk'", 1);
await expectRows(
  admin,
  "…ve hayvanın adı başvuruda durur",
  "select * from adoption_applications where adoption_id is null and animal_name = 'Pamuk'",
  1,
);
await expectRows(
  admin,
  "yönetici iyileşme hikâyesi ekler",
  "insert into rescue_stories (name, rescued_on) values ('Zeytin', '2026-05-01')",
  1,
);
await expectRows(anon, "ziyaretçi hikâyeyi görür", "select * from rescue_stories", 1);
await expectRows(
  admin,
  "yönetici veteriner ekler",
  "insert into vets (name, lat, lng) values ('Can Veteriner', 40.15, 26.41)",
  1,
);
await expectError(admin, "geçersiz enlem reddedilir", "insert into vets (name, lat) values ('x', 120)");
await expectRows(
  admin,
  "yönetici besleme noktası ekler",
  "insert into shelter_locations (name, kind, lat, lng) values ('Kütüphane önü', 'besleme', 40.1, 26.4)",
  1,
);
await expectError(admin, "konumsuz nokta reddedilir", "insert into shelter_locations (name) values ('x')");
await expectError(
  anon,
  "ziyaretçi nokta ekleyemez",
  "insert into shelter_locations (name, lat, lng) values ('x', 1, 1)",
);

console.log("\nFaz 3 — borçlar, ihtiyaçlar, projeler, kısırlaştırma");
await expectRows(
  admin,
  "yönetici borç ekler (kuruşlu tutar)",
  "insert into debts (creditor, amount, paid_amount) values ('Can Veteriner', 4250.50, 1000), ('Gizli borç', 10, 0)",
  2,
);
await expectRows(
  admin,
  "yönetici bir borcu gizler",
  "update debts set is_published = false where creditor = 'Gizli borç'",
  1,
);
await expectRows(anon, "ziyaretçi sadece yayındaki borcu görür", "select * from debts", 1);
await expectRows(anon, "tutar kuruşuyla saklanır", "select 1 from debts where amount = 4250.50", 1);
await expectError(admin, "sıfır tutarlı borç reddedilir", "insert into debts (creditor, amount) values ('x', 0)");
await expectError(
  admin,
  "eksi ödeme reddedilir",
  "insert into debts (creditor, amount, paid_amount) values ('x', 10, -1)",
);
await expectError(anon, "ziyaretçi borç ekleyemez", "insert into debts (creditor, amount) values ('x', 10)");
await expectRows(
  admin,
  "yönetici ihtiyaç ekler",
  "insert into needs (title, is_urgent) values ('Yavru maması', true)",
  1,
);
await expectRows(anon, "ziyaretçi ihtiyacı görür", "select * from needs where is_urgent", 1);
await expectRows(
  admin,
  "yönetici proje ekler",
  "insert into projects (title, status, progress) values ('Kampüse 10 kulübe', 'devam', 40)",
  1,
);
await expectError(admin, "%100'ü aşan ilerleme reddedilir", "insert into projects (title, progress) values ('x', 120)");
await expectError(
  admin,
  "geçersiz proje durumu reddedilir",
  "insert into projects (title, status) values ('x', 'bitti')",
);
await expectRows(
  admin,
  "yönetici kısırlaştırma kaydı ekler (veterinere bağlı)",
  "insert into neuter_records (animal_name, scheduled_on, status, vet_id) select 'Tekir', current_date + 2, 'planlandi', id from vets where name = 'Can Veteriner'",
  1,
);
await expectRows(
  anon,
  "ziyaretçi kaydı veterinerin adıyla görür",
  "select n.animal_name, v.name from neuter_records n join vets v on v.id = n.vet_id",
  1,
);
await expectError(admin, "tarihsiz kayıt reddedilir", "insert into neuter_records (animal_name) values ('x')");
await expectError(
  anon,
  "ziyaretçi kayıt ekleyemez",
  "insert into neuter_records (animal_name, scheduled_on) values ('x', current_date)",
);
await expectRows(admin, "veteriner silinince kayıt kalır", "delete from vets where name = 'Can Veteriner'", 1);
await expectRows(admin, "…ve veteriner bağlantısı boşalır", "select 1 from neuter_records where vet_id is null", 1);

console.log(failures ? `\n${failures} test başarısız.` : "\nTüm testler geçti.");
process.exit(failures ? 1 : 0);
