-- =============================================================
-- integrations table
-- Stores per-user third-party provider connections (Strava, Garmin)
-- =============================================================

create table integrations (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references users(id) on delete cascade,
  provider        text        not null check (provider in ('strava', 'garmin')),
  provider_user_id text       not null,
  access_token    text        not null,
  refresh_token   text,
  token_expires_at timestamptz,
  scopes          text,
  status          text        not null default 'connected' check (status in ('connected', 'disconnected')),
  auto_sync       boolean     not null default true,
  last_synced_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.integrations is 'Athlete third party integrations such as Garmin or Strava.';


-- One connection per provider per user
create unique index integrations_user_provider_idx
  on integrations (user_id, provider);

-- Look up a user from incoming webhook/API data
create index integrations_provider_user_idx
  on integrations (provider, provider_user_id);

-- Find all active connections (e.g. for batch sync jobs)
create index integrations_status_idx
  on integrations (status)
  where status = 'connected';

-- Trigger
create trigger set_updated_at
  before update on integrations
  for each row
  execute function handle_updated_at();

-- RLS
alter table public.integrations enable row level security;

-- Users can read their own row
create policy "Users can view own integrations"
  on public.integrations
  for select using ((select auth.uid()) = id);

-- Users can update their own row
create policy "Users can update own integrations"
  on public.integrations
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);