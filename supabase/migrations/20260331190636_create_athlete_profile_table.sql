-- ============================================================
-- athlete profile
-- ============================================================

create table public.athlete_profile (
  id                                uuid primary key default gen_random_uuid(),
  user_id                           uuid not null unique references public.users (id) on delete cascade,
  created_at                        timestamptz not null default now(),
  updated_at                        timestamptz not null default now(),
  experience_level                  smallint check (experience_level between 1 and 5),
  training_availability             jsonb not null default '{}',
  pool_days                         jsonb not null default '[]',
  access_pool                       boolean not null default false,
  access_open_water                 boolean not null default false,
  access_road_bike                  boolean not null default false,
  access_turbo                      boolean not null default false,
  access_power_meter                boolean not null default false,
  access_hr_monitor                 boolean not null default false,
  access_gym                        boolean not null default false,
  benchmark_swim_400m_tt            integer,
  benchmark_swim_css                integer,
  benchmark_bike_ftp_watts          smallint,
  benchmark_bike_20min_power        smallint,
  benchmark_run_threshold_pace      integer,
  benchmark_run_5k                  integer,
  benchmark_run_10k                 integer,
  benchmark_run_half                integer
);

-- ============================================================
-- Triggers
-- ============================================================
create trigger on_athlete_profile_updated
  before update on public.athlete_profile
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- RLS
-- ============================================================

alter table public.athlete_profile enable row level security;

create policy "Users can view own profile"
  on public.athlete_profile for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own profile"
  on public.athlete_profile for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own profile"
  on public.athlete_profile for update
  using ((select auth.uid()) = user_id);
