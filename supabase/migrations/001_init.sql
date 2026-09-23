-- 2-LIMITED backoffice schema
-- Tables backing the Concerts, Music, Media (photos) and Gear management
-- screens. `shows`, `tracks`, `photos` are readable by anyone (the public
-- site reads them directly); `gear` is internal-only. All writes require an
-- authenticated backoffice session (Cam or Steph — there is no public
-- sign-up, so "authenticated" already means one of the two of them).

create extension if not exists "pgcrypto";

-- Concerts ------------------------------------------------------------
create table if not exists shows (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text,
  city text not null,
  venue text,
  note_fr text,
  note_en text,
  ticket_url text,
  poster_src text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Music ----------------------------------------------------------------
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle_fr text,
  subtitle_en text,
  src text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Photos -----------------------------------------------------------------
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Gear / matos (backoffice-only, no public page reads this) --------------
create table if not exists gear (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  owner text,
  status text not null default 'ok',
  quantity integer not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security -------------------------------------------------------
alter table shows enable row level security;
alter table tracks enable row level security;
alter table photos enable row level security;
alter table gear enable row level security;

-- Public (anon) read access for the content the public site displays
-- (drop-then-create so this migration can be safely re-run — Postgres has
-- no `create policy if not exists`)
drop policy if exists "shows are publicly readable" on shows;
create policy "shows are publicly readable" on shows for select using (true);
drop policy if exists "tracks are publicly readable" on tracks;
create policy "tracks are publicly readable" on tracks for select using (true);
drop policy if exists "photos are publicly readable" on photos;
create policy "photos are publicly readable" on photos for select using (true);

-- Any authenticated backoffice user (Cam or Steph) can manage everything —
-- there is no public sign-up, so "authenticated" already means one of them.
drop policy if exists "authenticated manage shows" on shows;
create policy "authenticated manage shows" on shows for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "authenticated manage tracks" on tracks;
create policy "authenticated manage tracks" on tracks for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "authenticated manage photos" on photos;
create policy "authenticated manage photos" on photos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "authenticated manage gear" on gear;
create policy "authenticated manage gear" on gear for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- keep updated_at current on edit
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists shows_set_updated_at on shows;
create trigger shows_set_updated_at before update on shows
  for each row execute function set_updated_at();
drop trigger if exists tracks_set_updated_at on tracks;
create trigger tracks_set_updated_at before update on tracks
  for each row execute function set_updated_at();
drop trigger if exists gear_set_updated_at on gear;
create trigger gear_set_updated_at before update on gear
  for each row execute function set_updated_at();
