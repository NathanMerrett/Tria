-- ============================================================
-- plans
-- ============================================================

create table public.plans (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.users (id) on delete cascade,
  status                text not null default 'active' check (status in ('active','complete','abandoned')),
  created_at            timestamptz not null default now(),
  distance              text not null check (distance in ('sprint','olympic','half_iron','full_iron')),
  race_date             date not null,
  plan_start_date       date not null,
  goal                  text not null check (goal in ('finish','target_time','improve')),
  target_time_overall   text,
  plan_input_snapshot      jsonb not null,
  plan_length_weeks     smallint not null
);

-- Only one active plan per user
create unique index one_active_plan_per_user
  on public.plans (user_id)
  where status = 'active';

-- Plan history queries
create index plans_user_id
  on public.plans (user_id, created_at desc);

-- RLS
alter table public.plans enable row level security;

create policy "Users can view own plans"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.plans for update
  using (auth.uid() = user_id);