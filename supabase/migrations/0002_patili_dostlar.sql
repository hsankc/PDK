-- =====================================================================
-- Patili Dostlar Kulübü — Faz 2: sahiplendirme, iyileşenler, veterinerler, yuvalar
-- 0001_temel.sql'den SONRA çalıştırın. Tekrar çalıştırılabilir.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Sahiplendirme ilanları
-- ---------------------------------------------------------------------
create table if not exists public.adoptions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  species       text not null default 'kedi' check (species in ('kedi', 'kopek', 'diger')),
  sex           text check (sex in ('disi', 'erkek')),
  age_group     text check (age_group in ('yavru', 'genc', 'yetiskin', 'yasli')),
  age_text      text,
  cover_url     text,
  photos        text[] not null default '{}',
  traits        text,
  description   text,
  health_notes  text,
  vaccinated    boolean not null default false,
  neutered      boolean not null default false,
  location      text,
  status        text not null default 'sahiplendirilebilir'
                check (status in ('sahiplendirilebilir', 'rezerve', 'sahiplendirildi')),
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- İyileştirdiğimiz dostlar (önce / sonra)
-- ---------------------------------------------------------------------
create table if not exists public.rescue_stories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  species       text not null default 'kedi' check (species in ('kedi', 'kopek', 'diger')),
  before_url    text,
  after_url     text,
  photos        text[] not null default '{}',
  summary       text,
  story         text,
  rescued_on    date,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Anlaşmalı veterinerler
-- ---------------------------------------------------------------------
create table if not exists public.vets (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  doctor_name    text,
  address        text,
  phone          text,
  website_url    text,
  maps_url       text,
  discount_info  text,
  services       text,
  working_hours  text,
  logo_url       text,
  is_emergency   boolean not null default false,
  lat            double precision check (lat between -90 and 90),
  lng            double precision check (lng between -180 and 180),
  sort_order     int not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Yuva, kulübe, besleme ve su noktaları
-- ---------------------------------------------------------------------
create table if not exists public.shelter_locations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  kind          text not null default 'besleme' check (kind in ('besleme', 'su', 'kulube', 'yuva', 'diger')),
  description   text,
  photo_url     text,
  responsible   text,
  lat           double precision not null check (lat between -90 and 90),
  lng           double precision not null check (lng between -180 and 180),
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['adoptions', 'rescue_stories', 'vets', 'shelter_locations'] loop
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
-- Sahiplenme başvuruları
-- ---------------------------------------------------------------------
create table if not exists public.adoption_applications (
  id           uuid primary key default gen_random_uuid(),
  adoption_id  uuid references public.adoptions (id) on delete set null,
  animal_name  text check (char_length(animal_name) <= 120),
  full_name    text not null check (char_length(full_name) between 2 and 120),
  phone        text not null check (char_length(phone) between 7 and 30),
  email        text check (char_length(email) <= 200),
  city         text check (char_length(city) <= 120),
  housing      text check (char_length(housing) <= 60),
  other_pets   text check (char_length(other_pets) <= 500),
  experience   text check (char_length(experience) <= 2000),
  message      text check (char_length(message) <= 3000),
  status       text not null default 'yeni' check (status in ('yeni', 'inceleniyor', 'onaylandi', 'red')),
  admin_note   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists adoption_applications_adoption_idx on public.adoption_applications (adoption_id);

do $$
declare t text := 'adoption_applications';
begin
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
end $$;
