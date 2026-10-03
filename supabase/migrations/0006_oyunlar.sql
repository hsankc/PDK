-- =====================================================================
-- Patili Dostlar Kulübü — Faz 5: mini oyun skor tablosu
-- 0005_arsiv.sql'den SONRA çalıştırın. Tekrar çalıştırılabilir.
-- =====================================================================

-- mama:   score = toplanan puan (büyük olan önde)
-- hafiza: score = hamle sayısı, seconds = süre (küçük olan önde)
create table if not exists public.game_scores (
  id            uuid primary key default gen_random_uuid(),
  game          text not null check (game in ('mama', 'hafiza')),
  player_name   text not null check (char_length(player_name) between 2 and 20),
  score         int not null check (score between 0 and 5000),
  seconds       int check (seconds between 0 and 3600),
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists game_scores_board_idx on public.game_scores (game, score);

alter table public.game_scores enable row level security;
drop trigger if exists game_scores_updated_at on public.game_scores;
create trigger game_scores_updated_at before update on public.game_scores
  for each row execute function public.set_updated_at();

-- Herkes skorları görür ve kendi skorunu gönderir; uygunsuz isimleri yönetici gizler ya da siler.
drop policy if exists "herkes yayindakini okur" on public.game_scores;
create policy "herkes yayindakini okur" on public.game_scores
  for select using (is_published or public.is_admin());
drop policy if exists "herkes skor gonderir" on public.game_scores;
create policy "herkes skor gonderir" on public.game_scores
  for insert to anon, authenticated with check (is_published);
drop policy if exists "yonetici yonetir" on public.game_scores;
create policy "yonetici yonetir" on public.game_scores
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select, insert on public.game_scores to anon, authenticated;
grant update, delete on public.game_scores to authenticated;
