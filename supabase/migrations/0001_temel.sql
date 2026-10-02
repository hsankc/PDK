-- =====================================================================
-- Patili Dostlar Kulübü — Faz 0 + Faz 1 şeması
-- Supabase panelinde: SQL Editor > New query > bu dosyayı yapıştır > Run
-- Tekrar çalıştırılabilir (mevcut verileri silmez).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Yardımcılar
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Yöneticiler
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins: yonetici okur" on public.admins;
create policy "admins: yonetici okur" on public.admins
  for select to authenticated using (public.is_admin());
grant select on public.admins to authenticated;

-- ---------------------------------------------------------------------
-- Site ayarları (tek satır, tüm ayarlar JSON olarak)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
alter table public.site_settings enable row level security;

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

drop policy if exists "site_settings: herkes okur" on public.site_settings;
create policy "site_settings: herkes okur" on public.site_settings
  for select using (true);
drop policy if exists "site_settings: yonetici gunceller" on public.site_settings;
create policy "site_settings: yonetici gunceller" on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;

-- ---------------------------------------------------------------------
-- Yönetim ekibi
-- ---------------------------------------------------------------------
create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text,
  department    text,
  bio           text,
  photo_url     text,
  instagram_url text,
  linkedin_url  text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Etkinlikler
-- ---------------------------------------------------------------------
create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  location         text,
  starts_at        timestamptz not null,
  ends_at          timestamptz,
  cover_url        text,
  registration_url text,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists events_starts_at_idx on public.events (starts_at);

-- İçerik tabloları: herkes yayındakini okur, yönetici her şeyi yapar
do $$
declare t text;
begin
  foreach t in array array['team_members', 'events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
    execute format('drop policy if exists "herkes yayindakini okur" on public.%I', t);
    execute format('create policy "herkes yayindakini okur" on public.%I for select using (is_published or public.is_admin())', t);
    execute format('drop policy if exists "yonetici yonetir" on public.%I', t);
    execute format('create policy "yonetici yonetir" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Üyelik başvuruları
-- ---------------------------------------------------------------------
create table if not exists public.membership_applications (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null check (char_length(full_name) between 2 and 120),
  email       text not null check (char_length(email) between 5 and 200),
  phone       text check (char_length(phone) <= 30),
  student_no  text check (char_length(student_no) <= 30),
  department  text check (char_length(department) <= 150),
  grade       text check (char_length(grade) <= 30),
  interests   text check (char_length(interests) <= 1000),
  message     text check (char_length(message) <= 3000),
  status      text not null default 'yeni' check (status in ('yeni', 'inceleniyor', 'kabul', 'red')),
  admin_note  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- İstek ve öneriler
-- ---------------------------------------------------------------------
create table if not exists public.suggestions (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null default 'oneri' check (kind in ('istek', 'oneri', 'sikayet', 'tesekkur')),
  name        text check (char_length(name) <= 120),
  email       text check (char_length(email) <= 200),
  message     text not null check (char_length(message) between 3 and 5000),
  status      text not null default 'yeni' check (status in ('yeni', 'okundu', 'cozuldu')),
  admin_note  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Gelen kutusu tabloları: herkes gönderebilir, sadece yönetici görür
do $$
declare t text;
begin
  foreach t in array array['membership_applications', 'suggestions'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
    execute format('drop policy if exists "herkes gonderir" on public.%I', t);
    execute format('create policy "herkes gonderir" on public.%I for insert to anon, authenticated with check (status = ''yeni'' and admin_note is null)', t);
    execute format('drop policy if exists "yonetici okur" on public.%I', t);
    execute format('create policy "yonetici okur" on public.%I for select to authenticated using (public.is_admin())', t);
    execute format('drop policy if exists "yonetici gunceller" on public.%I', t);
    execute format('create policy "yonetici gunceller" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('drop policy if exists "yonetici siler" on public.%I', t);
    execute format('create policy "yonetici siler" on public.%I for delete to authenticated using (public.is_admin())', t);
    execute format('grant insert on public.%I to anon, authenticated', t);
    execute format('grant select, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Medya deposu (resimler)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media: yonetici listeler" on storage.objects;
create policy "media: yonetici listeler" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: yonetici yukler" on storage.objects;
create policy "media: yonetici yukler" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: yonetici gunceller" on storage.objects;
create policy "media: yonetici gunceller" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: yonetici siler" on storage.objects;
create policy "media: yonetici siler" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
