-- Migration 1: Auth triggers and shared utility functions
-- Description: Creates reusable utility functions and the auth.users signup trigger.
--              This must run before any table migrations that depend on these functions.

-- ============================================================================
-- 1. Reusable updated_at trigger function
--    Attach to any table that has an updated_at column:
--    create trigger on_<table>_updated
--      before update on public.<table>
--      for each row
--      execute function public.handle_updated_at();
-- ============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 2. Auth signup handler
--    Fires after a new auth.users row is created (email, OAuth, etc).
--    Extend this function as new tables need seeding on signup.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();