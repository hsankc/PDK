-- =====================================================================
-- Patili Dostlar Kulübü — Faz 3: borçlar, ihtiyaç listesi, projeler, kısırlaştırma
-- 0002_patili_dostlar.sql'den SONRA çalıştırın. Tekrar çalıştırılabilir.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Borçlar (klinik, mama vb.) — sitede şeffaflık için gösterilir
-- ---------------------------------------------------------------------
create table if not exists public.debts (
  id            uuid primary key default gen_random_uuid(),
  creditor      text not null,
  description   text,
  amount        numeric(12, 2) not null check (amount > 0),
  paid_amount   numeric(12, 2) not null default 0 check (paid_amount >= 0),
  incurred_on   date,
  due_on        date,
  receipt_url   text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- İhtiyaç listesi (mama, kum, ilaç…)
-- ---------------------------------------------------------------------
create table if not exists public.needs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  quantity      text,
  is_urgent     boolean not null default false,
  is_fulfilled  boolean not null default false,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Projelerimiz
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  summary       text,
  description   text,
  cover_url     text,
  photos        text[] not null default '{}',
  status        text not null default 'devam' check (status in ('planlaniyor', 'devam', 'tamamlandi')),
  progress      int not null default 0 check (progress between 0 and 100),
  started_on    date,
  finished_on   date,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Kısırlaştırma takvimi ve takibi
-- ---------------------------------------------------------------------
create table if not exists public.neuter_records (
  id            uuid primary key default gen_random_uuid(),
  animal_name   text not null,
  species       text not null default 'kedi' check (species in ('kedi', 'kopek', 'diger')),
  sex           text check (sex in ('disi', 'erkek')),
  photo_url     text,
  vet_id        uuid references public.vets (id) on delete set null,
  scheduled_on  date not null,
  status        text not null default 'planlandi' check (status in ('planlandi', 'yapildi', 'iptal')),
  area          text,
  note          text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists neuter_records_scheduled_idx on public.neuter_records (scheduled_on);
create index if not exists neuter_records_vet_idx on public.neuter_records (vet_id);

do $$
declare t text;
begin
  foreach t in array array['debts', 'needs', 'projects', 'neuter_records'] loop
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
