-- =====================================================================
-- Patili Dostlar Kulübü — Arşiv bölümleri: etkinlik galerisi, kampüs kedileri,
-- "Biliyor musun?" bilgileri, pati galerisi, tarihçe, destekçiler
-- 0004_icerik.sql'den SONRA çalıştırın. Tekrar çalıştırılabilir.
-- =====================================================================

-- Etkinliklere fotoğraf galerisi
alter table public.events add column if not exists photos text[] not null default '{}';

-- ---------------------------------------------------------------------
-- Kampüs kedileri (ve köpekleri): tanıtım kartları
-- ---------------------------------------------------------------------
create table if not exists public.campus_pets (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  species       text not null default 'kedi' check (species in ('kedi', 'kopek', 'diger')),
  title         text,
  personality   text,
  zodiac        text,
  favorite_spot text,
  photo_url     text,
  photos        text[] not null default '{}',
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- "Biliyor musun?" kısa bilgiler
-- ---------------------------------------------------------------------
create table if not exists public.facts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text,
  category      text not null default 'genel' check (category in ('kedi', 'kopek', 'genel')),
  image_url     text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Pati galerisi: üyelerden ve takipçilerden gelen fotoğraflar
-- ---------------------------------------------------------------------
create table if not exists public.gallery_photos (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,
  caption       text,
  credit        text,
  album         text,
  taken_on      date,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tarihçe: kulübün kilometre taşları
-- ---------------------------------------------------------------------
create table if not exists public.milestones (
  id            uuid primary key default gen_random_uuid(),
  happened_on   date not null,
  title         text not null,
  description   text,
  image_url     text,
  link_url      text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists milestones_date_idx on public.milestones (happened_on);

-- ---------------------------------------------------------------------
-- Destekçiler ve iş birlikleri
-- ---------------------------------------------------------------------
create table if not exists public.partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  kind          text not null default 'isletme' check (kind in ('kurum', 'isletme', 'kulup', 'dernek', 'sponsor')),
  description   text,
  instagram_url text,
  website_url   text,
  logo_url      text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['campus_pets', 'facts', 'gallery_photos', 'milestones', 'partners'] loop
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
