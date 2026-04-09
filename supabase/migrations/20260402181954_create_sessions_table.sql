-- scheduled_date is not stored — derived as plan_weeks.week_start_date + (day_of_week - 1)
-- brick sessions are two rows on the same day: bike (sort_order 1) + run (sort_order 2)

create table public.sessions (
  id                  uuid primary key default gen_random_uuid(),
  plan_week_id        uuid not null references public.plan_weeks (id) on delete cascade,
  plan_id             uuid not null references public.plans (id) on delete cascade,
  day_of_week         smallint not null check (day_of_week between 1 and 7),
  sort_order          smallint not null default 1,
  discipline          text not null check (discipline in ('swim','bike','run','strength')),
  session_type        text not null check (session_type in ('endurance','tempo','intervals','recovery','race_pace','technique','brick','strength')),
  title               text not null,
  duration_minutes    smallint not null,
  coaches_notes       text,
  workout_steps       jsonb,
  target_format       text check (target_format in ('pace','power','hr','rpe')),
  planned_distance_m  integer,
  estimated_tss       smallint,
  status              text not null default 'upcoming' check (status in ('upcoming','completed','skipped','deleted')),
  completed_at        timestamptz,
  synced_to           jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger on_sessions_updated
  before update on public.sessions
  for each row
  execute function public.handle_updated_at();

create index sessions_plan_week_id on public.sessions (plan_week_id);
create index sessions_plan_id      on public.sessions (plan_id, day_of_week);

alter table public.sessions enable row level security;

create policy "Users can view own sessions"
  on public.sessions for select
  using (exists (
    select 1 from public.plans
    where id = sessions.plan_id and user_id = (select auth.uid())
  ));

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (exists (
    select 1 from public.plans
    where id = sessions.plan_id and user_id = (select auth.uid())
  ));

create policy "Users can update own sessions"
  on public.sessions for update
  using (exists (
    select 1 from public.plans
    where id = sessions.plan_id and user_id = (select auth.uid())
  ));
