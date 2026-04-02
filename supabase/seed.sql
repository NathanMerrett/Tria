-- =============================================================================
-- Tria — Local Development Seed Data
-- =============================================================================
-- Run automatically after migrations on: supabase db reset
-- All test users share the password: "password"
--
-- User reference:
--   free@test.com               Free, no trial started
--   trial-active@test.com       Trial active — 7 days in, 21 days remaining
--   trial-expiring@test.com     Trial expiring soon — 25 days in, 3 days remaining
--   trial-expired@test.com      Trial expired — started 30 days ago
--   subscriber-monthly@test.com Active monthly subscription
--   subscriber-annual@test.com  Active annual subscription
--   past-due@test.com           Subscription payment failed (past_due)
--   cancelled@test.com          Subscription cancelled
--   imperial@test.com           Active subscriber, imperial units, AU timezone
-- =============================================================================

-- Fixed UUIDs make it easy to reference these users in other seed data later
-- aa000000-... prefix = auth seed users

-- =============================================================================
-- 1. Insert auth.users rows
--    The handle_new_user() trigger fires on each insert and creates the
--    corresponding public.users row with subscription_status = 'free'.
--    We update public.users below to set non-default states.
-- =============================================================================

insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) values
  (
    'aa000001-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'free@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000003-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'trial-active@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000004-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'trial-expiring@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000005-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'trial-expired@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000006-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'subscriber-monthly@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000007-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'subscriber-annual@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000008-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'past-due@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000009-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'cancelled@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  ),
  (
    'aa000010-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'imperial@test.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now()
  );

-- =============================================================================
-- 2. Patch public.users for non-default states
--    The trigger sets subscription_status = 'free' for all rows.
--    We override below as needed.
-- =============================================================================

-- free@test.com — no trial, stays free
update public.users set
  display_name = 'Free User'
where id = 'aa000001-0000-0000-0000-000000000000';

-- trial-active@test.com — 7 days into trial, 21 days remaining
update public.users set
  display_name         = 'Active Trial User',
  trial_started_at     = now() - interval '7 days'
where id = 'aa000003-0000-0000-0000-000000000000';

-- trial-expiring@test.com — 25 days in, 3 days left before paywall
update public.users set
  display_name         = 'Expiring Trial User',
  trial_started_at     = now() - interval '25 days'
where id = 'aa000004-0000-0000-0000-000000000000';

-- trial-expired@test.com — trial window closed, should hit paywall
update public.users set
  display_name         = 'Expired Trial User',
  trial_started_at     = now() - interval '30 days'
where id = 'aa000005-0000-0000-0000-000000000000';

-- subscriber-monthly@test.com — active paying user, monthly plan
update public.users set
  display_name         = 'Monthly Subscriber',
  subscription_status  = 'active',
  subscription_tier    = 'monthly'
where id = 'aa000006-0000-0000-0000-000000000000';

-- subscriber-annual@test.com — active paying user, annual plan
update public.users set
  display_name         = 'Annual Subscriber',
  subscription_status  = 'active',
  subscription_tier    = 'annual'
where id = 'aa000007-0000-0000-0000-000000000000';

-- past-due@test.com — payment failed, should see payment recovery UI
update public.users set
  display_name         = 'Past Due User',
  subscription_status  = 'past_due',
  subscription_tier    = 'monthly'
where id = 'aa000008-0000-0000-0000-000000000000';

-- cancelled@test.com — deliberately cancelled, should see re-subscribe prompt
update public.users set
  display_name         = 'Cancelled User',
  subscription_status  = 'cancelled',
  subscription_tier    = 'monthly'
where id = 'aa000009-0000-0000-0000-000000000000';

-- imperial@test.com — active subscriber with imperial units + AU timezone
update public.users set
  display_name         = 'Imperial User',
  subscription_status  = 'active',
  subscription_tier    = 'annual',
  units                = 'imperial',
  timezone             = 'Australia/Sydney'
where id = 'aa000010-0000-0000-0000-000000000000';

-- =============================================================================
-- 3. athlete_profile rows
--    Not seeded for free@test.com (no trial started, never entered onboarding).
--    bb000000-... prefix = athlete_profile seed rows
-- =============================================================================

insert into public.athlete_profile (
  id, user_id,
  access_pool, access_open_water, access_road_bike, access_turbo,
  access_power_meter, access_hr_monitor, access_gym,
  benchmark_swim_css, benchmark_swim_400m_tt, benchmark_swim_pace_100m,
  benchmark_bike_ftp_watts, benchmark_bike_20min_power,
  benchmark_run_threshold_pace, benchmark_run_5k, benchmark_run_10k, benchmark_run_half
) values
  -- trial-active@test.com — beginner, pool + road bike, HR monitor only
  (
    'bb000003-0000-0000-0000-000000000000',
    'aa000003-0000-0000-0000-000000000000',
    true, false, true, false, false, true, false,
    112, 452, 109, 195, 205, 315, 1380, 2880, 6480
  ),
  -- trial-expiring@test.com — intermediate, pool + open water + turbo, gym access
  (
    'bb000004-0000-0000-0000-000000000000',
    'aa000004-0000-0000-0000-000000000000',
    true, true, true, true, false, true, true,
    107, 432, 104, 230, 242, 290, 1260, 2640, 5940
  ),
  -- trial-expired@test.com — intermediate, similar setup
  (
    'bb000005-0000-0000-0000-000000000000',
    'aa000005-0000-0000-0000-000000000000',
    true, false, true, true, false, true, false,
    109, 440, 106, 215, 226, 300, 1290, 2700, 6060
  ),
  -- subscriber-monthly@test.com — experienced age grouper, full setup
  (
    'bb000006-0000-0000-0000-000000000000',
    'aa000006-0000-0000-0000-000000000000',
    true, true, true, true, true, true, true,
    102, 412, 99, 255, 268, 275, 1200, 2520, 5700
  ),
  -- subscriber-annual@test.com — competitive age grouper, complete setup + zones
  (
    'bb000007-0000-0000-0000-000000000000',
    'aa000007-0000-0000-0000-000000000000',
    true, true, true, true, true, true, true,
    96, 388, 93, 290, 305, 258, 1110, 2340, 5220
  ),
  -- past-due@test.com — beginner, minimal gear
  (
    'bb000008-0000-0000-0000-000000000000',
    'aa000008-0000-0000-0000-000000000000',
    true, false, true, false, false, false, false,
    115, 464, 112, 180, 189, 330, 1440, 3000, 6720
  ),
  -- cancelled@test.com — sprint racer, completed their event, no benchmarks recorded
  (
    'bb000009-0000-0000-0000-000000000000',
    'aa000009-0000-0000-0000-000000000000',
    true, false, true, false, false, false, false,
    null, null, null, null, null, null, null, null, null
  ),
  -- imperial@test.com — competitive, full setup + zones
  (
    'bb000010-0000-0000-0000-000000000000',
    'aa000010-0000-0000-0000-000000000000',
    true, true, true, true, true, true, false,
    98, 396, 95, 300, 316, 252, 1095, 2310, 5160
  );

-- Populate training zones for experienced users
-- Bike: watts. Swim/Run: seconds per 100m or per km (lower = faster).
update public.athlete_profile set
  zones_bike = '[
    {"zone": 1, "label": "Recovery",  "min": 0,   "max": 159},
    {"zone": 2, "label": "Endurance", "min": 160,  "max": 217},
    {"zone": 3, "label": "Tempo",     "min": 218,  "max": 261},
    {"zone": 4, "label": "Threshold", "min": 262,  "max": 304},
    {"zone": 5, "label": "VO2max",    "min": 305,  "max": null}
  ]'::jsonb,
  zones_run = '[
    {"zone": 1, "label": "Easy",      "min": 318,  "max": null},
    {"zone": 2, "label": "Aerobic",   "min": 288,  "max": 318},
    {"zone": 3, "label": "Tempo",     "min": 268,  "max": 287},
    {"zone": 4, "label": "Threshold", "min": 253,  "max": 267},
    {"zone": 5, "label": "VO2max",    "min": null, "max": 252}
  ]'::jsonb,
  zones_swim = '[
    {"zone": 1, "label": "Easy",      "min": 116,  "max": null},
    {"zone": 2, "label": "Aerobic",   "min": 106,  "max": 116},
    {"zone": 3, "label": "Tempo",     "min": 101,  "max": 105},
    {"zone": 4, "label": "Threshold", "min": 94,   "max": 100},
    {"zone": 5, "label": "Hard",      "min": null, "max": 93}
  ]'::jsonb
where id = 'bb000007-0000-0000-0000-000000000000'; -- subscriber-annual

update public.athlete_profile set
  zones_bike = '[
    {"zone": 1, "label": "Recovery",  "min": 0,   "max": 164},
    {"zone": 2, "label": "Endurance", "min": 165,  "max": 225},
    {"zone": 3, "label": "Tempo",     "min": 226,  "max": 270},
    {"zone": 4, "label": "Threshold", "min": 271,  "max": 315},
    {"zone": 5, "label": "VO2max",    "min": 316,  "max": null}
  ]'::jsonb,
  zones_run = '[
    {"zone": 1, "label": "Easy",      "min": 312,  "max": null},
    {"zone": 2, "label": "Aerobic",   "min": 282,  "max": 312},
    {"zone": 3, "label": "Tempo",     "min": 262,  "max": 281},
    {"zone": 4, "label": "Threshold", "min": 247,  "max": 261},
    {"zone": 5, "label": "VO2max",    "min": null, "max": 246}
  ]'::jsonb,
  zones_swim = '[
    {"zone": 1, "label": "Easy",      "min": 118,  "max": null},
    {"zone": 2, "label": "Aerobic",   "min": 108,  "max": 118},
    {"zone": 3, "label": "Tempo",     "min": 103,  "max": 107},
    {"zone": 4, "label": "Threshold", "min": 96,   "max": 102},
    {"zone": 5, "label": "Hard",      "min": null, "max": 95}
  ]'::jsonb
where id = 'bb000010-0000-0000-0000-000000000000'; -- imperial

-- =============================================================================
-- 4. plans rows
--    Trial users: plan_start_date matches their trial_started_at (first plan
--    creation is what starts the trial clock).
--    cc000000-... prefix = plan seed rows
-- =============================================================================

insert into public.plans (
  id, user_id, status,
  distance, race_date, plan_start_date,
  goal, target_time_overall,
  plan_input_snapshot, plan_length_weeks
) values
  -- trial-active@test.com — Olympic, finish goal, 7 days in
  (
    'cc000003-0000-0000-0000-000000000000',
    'aa000003-0000-0000-0000-000000000000',
    'active', 'olympic',
    '2026-08-11',
    (now() - interval '7 days')::date,
    'finish', null,
    '{"weekly_hours": 8, "days_available": 5, "experience_level": "beginner", "previous_triathlons": 0}'::jsonb,
    20
  ),
  -- trial-expiring@test.com — Sprint, finish goal, 25 days in
  (
    'cc000004-0000-0000-0000-000000000000',
    'aa000004-0000-0000-0000-000000000000',
    'active', 'sprint',
    '2026-07-24',
    (now() - interval '25 days')::date,
    'finish', null,
    '{"weekly_hours": 6, "days_available": 4, "experience_level": "beginner", "previous_triathlons": 1}'::jsonb,
    20
  ),
  -- trial-expired@test.com — Half iron, improve goal, 30 days in (trial window closed)
  (
    'cc000005-0000-0000-0000-000000000000',
    'aa000005-0000-0000-0000-000000000000',
    'active', 'half_iron',
    '2026-06-21',
    (now() - interval '30 days')::date,
    'improve', null,
    '{"weekly_hours": 10, "days_available": 5, "experience_level": "intermediate", "previous_triathlons": 3}'::jsonb,
    16
  ),
  -- subscriber-monthly@test.com — Olympic, target time
  (
    'cc000006-0000-0000-0000-000000000000',
    'aa000006-0000-0000-0000-000000000000',
    'active', 'olympic',
    '2026-09-27',
    (now() - interval '60 days')::date,
    'target_time', '2:15:00',
    '{"weekly_hours": 10, "days_available": 6, "experience_level": "intermediate", "previous_triathlons": 5}'::jsonb,
    32
  ),
  -- subscriber-annual@test.com — Full iron, target time
  (
    'cc000007-0000-0000-0000-000000000000',
    'aa000007-0000-0000-0000-000000000000',
    'active', 'full_iron',
    '2026-10-18',
    (now() - interval '90 days')::date,
    'target_time', '9:30:00',
    '{"weekly_hours": 14, "days_available": 6, "experience_level": "advanced", "previous_triathlons": 12}'::jsonb,
    32
  ),
  -- past-due@test.com — Sprint, finish goal (plan continues despite payment issue)
  (
    'cc000008-0000-0000-0000-000000000000',
    'aa000008-0000-0000-0000-000000000000',
    'active', 'sprint',
    '2026-06-06',
    (now() - interval '45 days')::date,
    'finish', null,
    '{"weekly_hours": 5, "days_available": 3, "experience_level": "beginner", "previous_triathlons": 0}'::jsonb,
    16
  ),
  -- cancelled@test.com — Sprint, completed before cancellation
  (
    'cc000009-0000-0000-0000-000000000000',
    'aa000009-0000-0000-0000-000000000000',
    'complete', 'sprint',
    '2025-06-08',
    '2025-01-05',
    'finish', null,
    '{"weekly_hours": 6, "days_available": 4, "experience_level": "beginner", "previous_triathlons": 0}'::jsonb,
    22
  ),
  -- imperial@test.com — Half iron, improve goal, competitive
  (
    'cc000010-0000-0000-0000-000000000000',
    'aa000010-0000-0000-0000-000000000000',
    'active', 'half_iron',
    '2026-06-15',
    (now() - interval '120 days')::date,
    'improve', null,
    '{"weekly_hours": 12, "days_available": 6, "experience_level": "advanced", "previous_triathlons": 8}'::jsonb,
    28
  );

-- =============================================================================
-- 5. integrations rows
--    subscriber-annual has a disconnected Strava (shows revoked/expired state).
--    subscriber-monthly has both providers (shows multi-integration state).
--    dd000000-... prefix = integration seed rows
-- =============================================================================

insert into public.integrations (
  id, user_id,
  provider, provider_user_id,
  access_token, refresh_token, token_expires_at,
  scopes, status, auto_sync, last_synced_at
) values
  -- trial-active — Strava connected
  (
    'dd000001-0000-0000-0000-000000000000',
    'aa000003-0000-0000-0000-000000000000',
    'strava', 'strava_12345001',
    'strava_at_trial_active', 'strava_rt_trial_active',
    now() + interval '6 hours',
    'activity:read_all,profile:read_all',
    'connected', true,
    now() - interval '2 hours'
  ),
  -- subscriber-monthly — Strava connected
  (
    'dd000002-0000-0000-0000-000000000000',
    'aa000006-0000-0000-0000-000000000000',
    'strava', 'strava_12345006',
    'strava_at_monthly', 'strava_rt_monthly',
    now() + interval '6 hours',
    'activity:read_all,profile:read_all',
    'connected', true,
    now() - interval '1 hour'
  ),
  -- subscriber-monthly — Garmin also connected (multi-integration state)
  (
    'dd000003-0000-0000-0000-000000000000',
    'aa000006-0000-0000-0000-000000000000',
    'garmin', 'garmin_22345006',
    'garmin_at_monthly', 'garmin_rt_monthly',
    now() + interval '30 days',
    'activity:read',
    'connected', true,
    now() - interval '3 hours'
  ),
  -- subscriber-annual — Strava disconnected (token expired, shows re-auth prompt)
  (
    'dd000004-0000-0000-0000-000000000000',
    'aa000007-0000-0000-0000-000000000000',
    'strava', 'strava_12345007',
    'strava_at_annual_expired', 'strava_rt_annual_expired',
    now() - interval '2 days',
    'activity:read_all,profile:read_all',
    'disconnected', false,
    now() - interval '3 days'
  ),
  -- imperial — Garmin connected
  (
    'dd000005-0000-0000-0000-000000000000',
    'aa000010-0000-0000-0000-000000000000',
    'garmin', 'garmin_22345010',
    'garmin_at_imperial', 'garmin_rt_imperial',
    now() + interval '30 days',
    'activity:read',
    'connected', true,
    now() - interval '30 minutes'
  );
