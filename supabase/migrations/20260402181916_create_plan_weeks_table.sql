-- ============================================================================
-- plan_weeks table
-- ============================================================================

create table public.plan_weeks (
  id              uuid primary key default gen_random_uuid(),
  plan_id         uuid not null references public.plans (id) on delete cascade,
  week_number     smallint not null,
  week_start_date date not null,
  phase           text not null check (phase in ('base','build','peak','taper','recovery')),
  theme           text,
  target_tss      smallint,
  notes           text,
  status          text not null default 'upcoming'
                    check (status in ('upcoming','in_progress','complete','skipped')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (plan_id, week_number)
);

-- ============================================================================
-- Triggers
-- ============================================================================

create trigger on_plan_weeks_updated
  before update on public.plan_weeks
  for each row
  execute function public.handle_updated_at();

create index plan_weeks_plan_id on public.plan_weeks (plan_id);

-- ============================================================================
-- Enable RLS and create policies
-- ============================================================================

alter table public.plan_weeks enable row level security;

create policy "Users can view own plan weeks"
  on public.plan_weeks for select
  using (exists(select 1 from public.plans
    where id = plan_weeks.plan_id and user_id = (select auth.uid())
  ));

create policy "Users can insert own plan weeks"
  on public.plan_weeks for insert
  with check (exists (
    select 1 from public.plans
    where id = plan_weeks.plan_id and user_id = (select auth.uid())
  ));

create policy "Users can update own plan weeks"
  on public.plan_weeks for update
  using (exists (
    select 1 from public.plans
    where id = plan_weeks.plan_id and user_id = (select auth.uid())
  ));
