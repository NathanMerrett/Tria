-- ============================================================================
-- users table
-- ============================================================================
create table public.users (
  id              uuid        primary key references auth.users(id) on delete cascade,
  email           text        not null,
  display_name    text,
  subscription_status text    not null default 'free'
    check (subscription_status in ('free', 'active', 'past_due', 'cancelled')),
  subscription_tier   text
    check (subscription_tier in ('monthly', 'annual')),
  trial_started_at    timestamptz,
  notifications_enabled boolean not null default true,
  notification_preferences jsonb not null default '{"workout_reminders": true, "plan_updates": true}'::jsonb,
  units           text        not null default 'metric'
    check (units in ('metric', 'imperial')),
  timezone        text        not null default 'UTC',
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.users is 'User profiles, synced from auth.users on signup.';
comment on column public.users.trial_started_at is 'Set when the user creates their first plan. Null means trial has not started.';

-- ============================================================================
-- Helper Functions
-- ============================================================================
create or replace function public.has_premium_access(user_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where id = user_id
      and (
        subscription_status = 'active'
        or (
          trial_started_at is not null
          and trial_started_at > now() - interval '28 days'
        )
      )
  );
$$;

-- ============================================================================
-- Triggers
-- ============================================================================
create trigger on_users_updated
  before update on public.users
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 4. Enable RLS and create policies
-- ============================================================================
alter table public.users enable row level security;

-- Users can read their own row
create policy "Users can view own profile"
  on public.users
  for select using ((select auth.uid()) = id);

-- Users can update their own row
create policy "Users can update own profile"
  on public.users
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ============================================================================
-- Indexes
-- ============================================================================
create index idx_users_email on public.users (email);
create index idx_users_subscription_status on public.users (subscription_status);