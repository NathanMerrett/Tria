create table public.activities (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references public.users (id) on delete cascade,
  session_id              uuid references public.sessions (id) on delete set null,
  plan_id                 uuid references public.plans (id) on delete set null,
  discipline              text not null check (discipline in ('swim','bike','run','strength','other')),
  started_at              timestamptz not null,
  duration_seconds        integer not null,
  distance_m              integer,
  tss                     smallint,
  avg_hr                  smallint,
  avg_power_watts         smallint,
  normalized_power_watts  smallint,
  intensity_factor        numeric(4,2),
  avg_pace_secs_per_km    integer,
  elevation_gain_m        smallint,
  perceived_effort        smallint check (perceived_effort between 1 and 10),
  athlete_notes           text,
  source                  text not null check (source in ('manual','garmin','strava')),
  external_id             text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  unique (user_id, source, external_id)
);

-- ============================================================================
-- Triggers
-- ============================================================================

create trigger on_activities_updated
  before update on public.activities
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- Indexes
-- ============================================================================

create index activities_user_id   on public.activities (user_id, started_at desc);
create index activities_session_id on public.activities (session_id);
create index activities_plan_id    on public.activities (plan_id);

-- ============================================================================
-- Enable RLS and create policies
-- ============================================================================

alter table public.activities enable row level security;

create policy "Users can view own activities"
  on public.activities for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own activities"
  on public.activities for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own activities"
  on public.activities for update
  using ((select auth.uid()) = user_id);
