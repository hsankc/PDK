-- =====================================================================
-- Patili Dostlar Kulübü — Faz 4: yazı köşesi, rehberler, kayıp/bulundu, gönüllü
-- 0003_calismalarimiz.sql'den SONRA çalıştırın. Tekrar çalıştırılabilir.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Yazılar ve rehberler (aynı tablo; kind ile ayrılır)
-- İçerik, editörün JSON çıktısı olarak saklanır (HTML değil).
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'yazi' check (kind in ('yazi', 'rehber')),
  slug          text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  title         text not null,
  excerpt       text,
  content       jsonb not null default '{"type": "doc", "content": []}'::jsonb,
  cover_url     text,
  author_name   text,
  category      text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (kind, slug)
);
create index if not exists posts_kind_published_idx on public.posts (kind, published_at desc);

-- ---------------------------------------------------------------------
-- Kayıp & bulundu ilanları (yönetici yayınlar)
-- ---------------------------------------------------------------------
create table if not exists public.lost_found (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'kayip' check (kind in ('kayip', 'bulundu')),
  species       text not null default 'kedi' check (species in ('kedi', 'kopek', 'diger')),
  animal_name   text,
  description   text,
  area          text,
  seen_on       date,
  photo_url     text,
  photos        text[] not null default '{}',
  contact       text,
  status        text not null default 'aktif' check (status in ('aktif', 'kavustu')),
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['posts', 'lost_found'] loop
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
-- Kayıp / bulundu bildirimleri (ziyaretçi formu → yönetici inceler)
-- ---------------------------------------------------------------------
create table if not exists public.lost_found_reports (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null check (kind in ('kayip', 'bulundu')),
  species        text not null default 'kedi' check (species in ('kedi', 'kopek', 'diger')),
  animal_name    text check (char_length(animal_name) <= 120),
  description    text not null check (char_length(description) between 5 and 3000),
  area           text check (char_length(area) <= 200),
  seen_on        date,
  photo_link     text check (char_length(photo_link) <= 500),
  contact_name   text not null check (char_length(contact_name) between 2 and 120),
  contact_phone  text not null check (char_length(contact_phone) between 7 and 30),
  contact_email  text check (char_length(contact_email) <= 200),
  status         text not null default 'yeni' check (status in ('yeni', 'yayinlandi', 'kapandi')),
  admin_note     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Gönüllü ve geçici yuva başvuruları
-- ---------------------------------------------------------------------
create table if not exists public.volunteer_applications (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null check (kind in ('gonullu', 'gecici_yuva')),
  full_name     text not null check (char_length(full_name) between 2 and 120),
  phone         text not null check (char_length(phone) between 7 and 30),
  email         text check (char_length(email) <= 200),
  district      text check (char_length(district) <= 120),
  availability  text check (char_length(availability) <= 500),
  housing       text check (char_length(housing) <= 60),
  other_pets    text check (char_length(other_pets) <= 500),
  can_host      text check (char_length(can_host) <= 200),
  duration      text check (char_length(duration) <= 120),
  message       text check (char_length(message) <= 3000),
  status        text not null default 'yeni' check (status in ('yeni', 'inceleniyor', 'kabul', 'red')),
  admin_note    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['lost_found_reports', 'volunteer_applications'] loop
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
