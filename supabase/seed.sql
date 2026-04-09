-- ============================================================
-- Tria seed data — local development
-- ============================================================
-- 3 test users with varied subscription states
-- 3 athlete profiles across experience levels
-- 4 plans covering all race distances
-- Plan weeks with phase periodisation
-- Sample sessions for recent/current weeks
--
-- Password for all users: testuser
-- Run: npx supabase db reset
-- ============================================================


-- ============================================================
-- 1. Auth users
-- ============================================================

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'pete@test.com',
    crypt('testuser', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}', now(), now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'tina@test.com',
    crypt('testuser', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}', now(), now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fred@test.com',
    crypt('testuser', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}', now(), now()
  );

INSERT INTO auth.identities (
  id, user_id, provider_id, provider,
  identity_data, last_sign_in_at, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'email',
    '{"sub": "11111111-1111-1111-1111-111111111111", "email": "pete@test.com"}',
    now(), now(), now()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'email',
    '{"sub": "22222222-2222-2222-2222-222222222222", "email": "tina@test.com"}',
    now(), now(), now()
  ),
  (
    gen_random_uuid(),
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'email',
    '{"sub": "33333333-3333-3333-3333-333333333333", "email": "fred@test.com"}',
    now(), now(), now()
  );


-- ============================================================
-- 2. Update public.users (created by auth trigger)
-- ============================================================

UPDATE public.users SET
  display_name = 'Premium Pete',
  subscription_status = 'active',
  subscription_tier = 'annual',
  units = 'metric',
  timezone = 'Europe/London'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE public.users SET
  display_name = 'Trial Tina',
  subscription_status = 'free',
  trial_started_at = now(),
  units = 'imperial',
  timezone = 'America/New_York'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE public.users SET
  display_name = 'Free Fred',
  subscription_status = 'free',
  units = 'metric',
  timezone = 'Europe/London'
WHERE id = '33333333-3333-3333-3333-333333333333';


-- ============================================================
-- 3. Athlete profiles
-- ============================================================

INSERT INTO public.athlete_profile (
  user_id, experience_level,
  training_availability, pool_days,
  access_pool, access_open_water, access_road_bike, access_turbo,
  access_power_meter, access_hr_monitor, access_gym,
  benchmark_swim_400m_tt, benchmark_swim_css,
  benchmark_bike_ftp_watts, benchmark_bike_20min_power,
  benchmark_run_threshold_pace, benchmark_run_5k,
  benchmark_run_10k, benchmark_run_half
)
VALUES
  -- Pete: advanced (4/5), fully equipped, all benchmarks
  (
    '11111111-1111-1111-1111-111111111111',
    4,
    '{"monday": 60, "tuesday": 90, "wednesday": 60, "thursday": 90, "friday": 0, "saturday": 150, "sunday": 180}',
    '["monday", "wednesday", "saturday"]',
    true, true, true, true, true, true, true,
    390,   -- 400m TT: 6:30
    95,    -- CSS: 1:35/100m
    260,   -- FTP watts
    275,   -- 20min power
    255,   -- threshold: 4:15/km
    1230,  -- 5k: 20:30
    2580,  -- 10k: 43:00
    5820   -- half: 1:37:00
  ),
  -- Tina: intermediate (3/5), moderate gear, some benchmarks
  (
    '22222222-2222-2222-2222-222222222222',
    3,
    '{"monday": 45, "tuesday": 60, "wednesday": 45, "thursday": 60, "friday": 0, "saturday": 90, "sunday": 120}',
    '["tuesday", "thursday"]',
    true, false, true, true, false, true, false,
    480,   -- 400m TT: 8:00
    115,   -- CSS: 1:55/100m
    NULL, NULL,
    300,   -- threshold: 5:00/km
    1560,  -- 5k: 26:00
    3300,  -- 10k: 55:00
    NULL
  ),
  -- Fred: beginner (1/5), minimal gear, few benchmarks
  (
    '33333333-3333-3333-3333-333333333333',
    1,
    '{"monday": 0, "tuesday": 45, "wednesday": 0, "thursday": 45, "friday": 0, "saturday": 60, "sunday": 60}',
    '["saturday"]',
    false, true, true, false, false, false, false,
    NULL, NULL, NULL, NULL,
    NULL,
    1800,  -- 5k: 30:00 (parkrun)
    NULL, NULL
  );


-- ============================================================
-- 4. Plans
-- ============================================================
-- Dates chosen so that as of ~April 9 2026:
--   Pete's half-iron  -> complete (raced April 5)
--   Pete's full-iron  -> 5 weeks in (base phase)
--   Tina's olympic    -> 4 weeks in (base -> build transition)
--   Fred's sprint     -> 3 weeks in (base phase)

-- Pete: COMPLETED half-iron
INSERT INTO public.plans (
  id, user_id, status, distance,
  race_date, plan_start_date, goal,
  target_time_overall, target_time_swim, target_time_bike, target_time_run,
  plan_input_snapshot, plan_length_days
)
VALUES (
  'aaaa1111-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'complete', 'half_iron',
  '2026-04-05', '2025-12-08', 'target_time',
  19800, 2400, 9900, 6600,
  '{
    "experience_level": 4,
    "access_pool": true, "access_open_water": true,
    "access_road_bike": true, "access_turbo": true,
    "access_power_meter": true, "access_hr_monitor": true, "access_gym": true,
    "benchmark_swim_400m_tt": 390, "benchmark_swim_css": 95,
    "benchmark_bike_ftp_watts": 260,
    "benchmark_run_threshold_pace": 255, "benchmark_run_5k": 1230, "benchmark_run_half": 5820,
    "training_availability": {"monday": 60, "tuesday": 90, "wednesday": 60, "thursday": 90, "friday": 0, "saturday": 150, "sunday": 180}
  }',
  119
);

-- Pete: ACTIVE full-iron (started ~5 weeks ago)
INSERT INTO public.plans (
  id, user_id, status, distance,
  race_date, plan_start_date, goal,
  target_time_overall, target_time_swim, target_time_bike, target_time_run,
  plan_input_snapshot, plan_length_days
)
VALUES (
  'aaaa1111-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'active', 'full_iron',
  '2026-08-31', '2026-03-09', 'target_time',
  39600, 4500, 19800, 14400,
  '{
    "experience_level": 4,
    "access_pool": true, "access_open_water": true,
    "access_road_bike": true, "access_turbo": true,
    "access_power_meter": true, "access_hr_monitor": true, "access_gym": true,
    "benchmark_swim_400m_tt": 390, "benchmark_swim_css": 95,
    "benchmark_bike_ftp_watts": 260,
    "benchmark_run_threshold_pace": 255, "benchmark_run_5k": 1230, "benchmark_run_half": 5820,
    "training_availability": {"monday": 60, "tuesday": 90, "wednesday": 60, "thursday": 90, "friday": 0, "saturday": 150, "sunday": 180}
  }',
  175
);

-- Tina: ACTIVE olympic (started ~4 weeks ago)
INSERT INTO public.plans (
  id, user_id, status, distance,
  race_date, plan_start_date, goal,
  target_time_overall, target_time_swim, target_time_bike, target_time_run,
  plan_input_snapshot, plan_length_days
)
VALUES (
  'aaaa2222-0000-0000-0000-000000000001',
  '22222222-2222-2222-2222-222222222222',
  'active', 'olympic',
  '2026-07-12', '2026-03-16', 'finish',
  NULL, NULL, NULL, NULL,
  '{
    "experience_level": 3,
    "access_pool": true, "access_open_water": false,
    "access_road_bike": true, "access_turbo": true,
    "access_power_meter": false, "access_hr_monitor": true, "access_gym": false,
    "benchmark_swim_400m_tt": 480, "benchmark_swim_css": 115,
    "benchmark_run_threshold_pace": 300, "benchmark_run_5k": 1560, "benchmark_run_10k": 3300,
    "training_availability": {"monday": 45, "tuesday": 60, "wednesday": 45, "thursday": 60, "friday": 0, "saturday": 90, "sunday": 120}
  }',
  119
);

-- Fred: ACTIVE sprint (started ~3 weeks ago)
INSERT INTO public.plans (
  id, user_id, status, distance,
  race_date, plan_start_date, goal,
  target_time_overall, target_time_swim, target_time_bike, target_time_run,
  plan_input_snapshot, plan_length_days
)
VALUES (
  'aaaa3333-0000-0000-0000-000000000001',
  '33333333-3333-3333-3333-333333333333',
  'active', 'sprint',
  '2026-06-07', '2026-03-23', 'finish',
  NULL, NULL, NULL, NULL,
  '{
    "experience_level": 1,
    "access_pool": false, "access_open_water": true,
    "access_road_bike": true, "access_turbo": false,
    "access_power_meter": false, "access_hr_monitor": false, "access_gym": false,
    "benchmark_run_5k": 1800,
    "training_availability": {"monday": 0, "tuesday": 45, "wednesday": 0, "thursday": 45, "friday": 0, "saturday": 60, "sunday": 60}
  }',
  77
);


-- ============================================================
-- 5. Plan weeks
-- ============================================================

-- Pete's completed half-iron (17 weeks, all complete)

INSERT INTO public.plan_weeks (plan_id, week_number, week_start_date, phase, theme, target_tss, status)
SELECT
  'aaaa1111-0000-0000-0000-000000000001', n,
  '2025-12-08'::date + ((n - 1) * 7),
  CASE
    WHEN n <= 5  THEN 'base'
    WHEN n <= 10 THEN 'build'
    WHEN n <= 14 THEN 'peak'
    WHEN n <= 16 THEN 'taper'
    ELSE 'recovery'
  END,
  CASE
    WHEN n <= 5  THEN 'Aerobic foundation'
    WHEN n <= 10 THEN 'Progressive overload'
    WHEN n <= 14 THEN 'Race-specific intensity'
    WHEN n <= 16 THEN 'Freshening up'
    ELSE 'Race week'
  END,
  CASE
    WHEN n <= 5  THEN (280 + n * 15)::smallint
    WHEN n <= 10 THEN (350 + (n - 5) * 20)::smallint
    WHEN n <= 14 THEN (420 - (n - 10) * 15)::smallint
    WHEN n <= 16 THEN (250 - (n - 14) * 50)::smallint
    ELSE 100::smallint
  END,
  'complete'
FROM generate_series(1, 17) AS n;

-- Pete's active full-iron (25 weeks)
-- Weeks 1-4 complete, week 5 in_progress, rest upcoming

INSERT INTO public.plan_weeks (plan_id, week_number, week_start_date, phase, theme, target_tss, status)
SELECT
  'aaaa1111-0000-0000-0000-000000000002', n,
  '2026-03-09'::date + ((n - 1) * 7),
  CASE
    WHEN n <= 7  THEN 'base'
    WHEN n <= 15 THEN 'build'
    WHEN n <= 20 THEN 'peak'
    WHEN n <= 23 THEN 'taper'
    ELSE 'recovery'
  END,
  CASE
    WHEN n <= 7  THEN 'Aerobic foundation'
    WHEN n <= 15 THEN 'Progressive overload'
    WHEN n <= 20 THEN 'Race-specific intensity'
    WHEN n <= 23 THEN 'Freshening up'
    ELSE 'Race week'
  END,
  CASE
    WHEN n <= 7  THEN (300 + n * 20)::smallint
    WHEN n <= 15 THEN (420 + (n - 7) * 25)::smallint
    WHEN n <= 20 THEN (600 - (n - 15) * 20)::smallint
    WHEN n <= 23 THEN (350 - (n - 20) * 60)::smallint
    ELSE 150::smallint
  END,
  CASE
    WHEN n <= 4 THEN 'complete'
    WHEN n = 5  THEN 'in_progress'
    ELSE 'upcoming'
  END
FROM generate_series(1, 25) AS n;

-- Tina's active olympic (17 weeks)
-- Weeks 1-3 complete, week 4 in_progress, rest upcoming

INSERT INTO public.plan_weeks (plan_id, week_number, week_start_date, phase, theme, target_tss, status)
SELECT
  'aaaa2222-0000-0000-0000-000000000001', n,
  '2026-03-16'::date + ((n - 1) * 7),
  CASE
    WHEN n <= 5  THEN 'base'
    WHEN n <= 11 THEN 'build'
    WHEN n <= 14 THEN 'peak'
    WHEN n <= 16 THEN 'taper'
    ELSE 'recovery'
  END,
  CASE
    WHEN n <= 5  THEN 'Aerobic foundation'
    WHEN n <= 11 THEN 'Progressive overload'
    WHEN n <= 14 THEN 'Race-specific intensity'
    WHEN n <= 16 THEN 'Freshening up'
    ELSE 'Race week'
  END,
  CASE
    WHEN n <= 5  THEN (200 + n * 15)::smallint
    WHEN n <= 11 THEN (280 + (n - 5) * 20)::smallint
    WHEN n <= 14 THEN (380 - (n - 11) * 15)::smallint
    WHEN n <= 16 THEN (220 - (n - 14) * 40)::smallint
    ELSE 100::smallint
  END,
  CASE
    WHEN n <= 3 THEN 'complete'
    WHEN n = 4  THEN 'in_progress'
    ELSE 'upcoming'
  END
FROM generate_series(1, 17) AS n;

-- Fred's active sprint (11 weeks)
-- Weeks 1-2 complete, week 3 in_progress, rest upcoming

INSERT INTO public.plan_weeks (plan_id, week_number, week_start_date, phase, theme, target_tss, status)
SELECT
  'aaaa3333-0000-0000-0000-000000000001', n,
  '2026-03-23'::date + ((n - 1) * 7),
  CASE
    WHEN n <= 3  THEN 'base'
    WHEN n <= 7  THEN 'build'
    WHEN n <= 9  THEN 'peak'
    WHEN n <= 10 THEN 'taper'
    ELSE 'recovery'
  END,
  CASE
    WHEN n <= 3  THEN 'Aerobic foundation'
    WHEN n <= 7  THEN 'Progressive overload'
    WHEN n <= 9  THEN 'Race-specific intensity'
    WHEN n <= 10 THEN 'Freshening up'
    ELSE 'Race week'
  END,
  CASE
    WHEN n <= 3  THEN (150 + n * 10)::smallint
    WHEN n <= 7  THEN (190 + (n - 3) * 15)::smallint
    WHEN n <= 9  THEN (240 - (n - 7) * 15)::smallint
    WHEN n <= 10 THEN 150::smallint
    ELSE 80::smallint
  END,
  CASE
    WHEN n <= 2 THEN 'complete'
    WHEN n = 3  THEN 'in_progress'
    ELSE 'upcoming'
  END
FROM generate_series(1, 11) AS n;


-- ============================================================
-- 6. Sessions
-- ============================================================
-- Sample sessions for completed and in-progress weeks.
-- Uses subqueries to look up plan_week IDs.
-- Upcoming weeks would be populated by the training engine.

-- ────────────────────────────────────────────
-- Pete's full-iron: Week 4 (complete)
-- ────────────────────────────────────────────

INSERT INTO public.sessions (
  plan_week_id, plan_id, day_of_week, sort_order,
  discipline, session_type, title, duration_minutes,
  coaches_notes, workout_steps, target_format,
  planned_distance_m, estimated_tss, status, completed_at
)
VALUES
  -- Monday: Swim technique
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 4),
    'aaaa1111-0000-0000-0000-000000000002', 1, 1,
    'swim', 'technique', 'Drill & Skill', 45,
    'Focus on catch and high-elbow recovery',
    '[
      {"type": "warmup", "distance_m": 200, "description": "Easy freestyle"},
      {"type": "drill", "reps": 4, "distance_m": 50, "description": "Catch-up drill, 15s rest"},
      {"type": "main", "reps": 6, "distance_m": 100, "rest_seconds": 15, "target": "CSS + 5s"},
      {"type": "cooldown", "distance_m": 200, "description": "Easy backstroke"}
    ]',
    'pace', 1600, 35,
    'completed', '2026-03-30 07:30:00+00'
  ),
  -- Tuesday: Bike intervals
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 4),
    'aaaa1111-0000-0000-0000-000000000002', 2, 1,
    'bike', 'intervals', 'Sweet Spot Intervals', 75,
    'Stay seated for intervals, cadence 85-95',
    '[
      {"type": "warmup", "duration_minutes": 15, "description": "Easy spin, progressive"},
      {"type": "main", "reps": 4, "duration_minutes": 8, "rest_minutes": 3, "target": "88-93% FTP"},
      {"type": "cooldown", "duration_minutes": 10, "description": "Easy spin"}
    ]',
    'power', 48000, 68,
    'completed', '2026-03-31 18:00:00+00'
  ),
  -- Wednesday: Swim CSS
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 4),
    'aaaa1111-0000-0000-0000-000000000002', 3, 1,
    'swim', 'intervals', 'CSS Repeats', 50,
    'Hold CSS pace throughout, tight rest',
    '[
      {"type": "warmup", "distance_m": 300, "description": "200 free + 4x25 build"},
      {"type": "main", "reps": 10, "distance_m": 100, "rest_seconds": 10, "target": "CSS pace"},
      {"type": "cooldown", "distance_m": 200, "description": "Easy choice stroke"}
    ]',
    'pace', 1500, 42,
    'completed', '2026-04-01 06:45:00+00'
  ),
  -- Thursday: Run tempo
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 4),
    'aaaa1111-0000-0000-0000-000000000002', 4, 1,
    'run', 'tempo', 'Steady State Tempo', 55,
    'Even effort, dont chase pace on hills',
    '[
      {"type": "warmup", "duration_minutes": 10, "description": "Easy jog with strides"},
      {"type": "main", "duration_minutes": 30, "target": "Threshold pace (4:15/km)"},
      {"type": "cooldown", "duration_minutes": 15, "description": "Easy jog"}
    ]',
    'pace', 11000, 52,
    'completed', '2026-04-02 18:15:00+00'
  ),
  -- Saturday: Bike endurance
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 4),
    'aaaa1111-0000-0000-0000-000000000002', 6, 1,
    'bike', 'endurance', 'Long Ride', 120,
    'Steady zone 2, fuel every 30 minutes',
    '[
      {"type": "main", "duration_minutes": 120, "target": "55-75% FTP, zone 2"}
    ]',
    'power', 80000, 90,
    'completed', '2026-04-04 08:00:00+00'
  ),
  -- Sunday: Run long
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 4),
    'aaaa1111-0000-0000-0000-000000000002', 7, 1,
    'run', 'endurance', 'Long Run', 90,
    'Conversational pace, practice race nutrition',
    '[
      {"type": "main", "duration_minutes": 90, "target": "Easy pace, zone 2"}
    ]',
    'hr', 15000, 75,
    'completed', '2026-04-05 08:30:00+00'
  );

-- ────────────────────────────────────────────
-- Pete's full-iron: Week 5 (in_progress)
-- ────────────────────────────────────────────

INSERT INTO public.sessions (
  plan_week_id, plan_id, day_of_week, sort_order,
  discipline, session_type, title, duration_minutes,
  coaches_notes, workout_steps, target_format,
  planned_distance_m, estimated_tss, status, completed_at
)
VALUES
  -- Monday: Swim (completed)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 5),
    'aaaa1111-0000-0000-0000-000000000002', 1, 1,
    'swim', 'technique', 'Catch Focus', 45,
    'Fingertip drag drill between main reps',
    '[
      {"type": "warmup", "distance_m": 300, "description": "Easy free"},
      {"type": "main", "reps": 8, "distance_m": 100, "rest_seconds": 15, "target": "CSS pace"},
      {"type": "cooldown", "distance_m": 200, "description": "Easy"}
    ]',
    'pace', 1300, 38,
    'completed', '2026-04-06 07:30:00+00'
  ),
  -- Tuesday: Bike (completed)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 5),
    'aaaa1111-0000-0000-0000-000000000002', 2, 1,
    'bike', 'tempo', 'Tempo Blocks', 70,
    'Consistent power output, practice aero position',
    '[
      {"type": "warmup", "duration_minutes": 15, "description": "Progressive spin"},
      {"type": "main", "reps": 3, "duration_minutes": 12, "rest_minutes": 4, "target": "80-85% FTP"},
      {"type": "cooldown", "duration_minutes": 10, "description": "Easy spin"}
    ]',
    'power', 45000, 62,
    'completed', '2026-04-07 18:00:00+00'
  ),
  -- Wednesday: Swim (completed)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 5),
    'aaaa1111-0000-0000-0000-000000000002', 3, 1,
    'swim', 'intervals', 'Threshold Set', 50,
    'Negative split the 200s',
    '[
      {"type": "warmup", "distance_m": 300, "description": "200 free + 4x25 fast"},
      {"type": "main", "reps": 5, "distance_m": 200, "rest_seconds": 20, "target": "CSS pace"},
      {"type": "cooldown", "distance_m": 200, "description": "Easy"}
    ]',
    'pace', 1500, 44,
    'completed', '2026-04-08 06:45:00+00'
  ),
  -- Thursday: Run (upcoming — today)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 5),
    'aaaa1111-0000-0000-0000-000000000002', 4, 1,
    'run', 'intervals', 'Hill Repeats', 55,
    'Strong effort uphill, easy jog back down',
    '[
      {"type": "warmup", "duration_minutes": 15, "description": "Easy jog to hill"},
      {"type": "main", "reps": 6, "duration_minutes": 3, "description": "Hill at 5k effort, jog down recovery"},
      {"type": "cooldown", "duration_minutes": 15, "description": "Easy jog home"}
    ]',
    'rpe', 10000, 55,
    'upcoming', NULL
  ),
  -- Saturday: Bike + Run brick (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 5),
    'aaaa1111-0000-0000-0000-000000000002', 6, 1,
    'bike', 'brick', 'Brick: Bike', 130,
    'Steady ride with a push in last 20 minutes',
    '[
      {"type": "main", "duration_minutes": 110, "target": "65-75% FTP"},
      {"type": "main", "duration_minutes": 20, "target": "80-85% FTP, simulate race finish"}
    ]',
    'power', 85000, 95,
    'upcoming', NULL
  ),
  -- Saturday: brick run (sort_order 2)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 5),
    'aaaa1111-0000-0000-0000-000000000002', 6, 2,
    'run', 'brick', 'Brick: Run off bike', 25,
    'Quick transition, settle into rhythm',
    '[
      {"type": "main", "duration_minutes": 25, "target": "Start easy, build to marathon pace"}
    ]',
    'pace', 4500, 30,
    'upcoming', NULL
  ),
  -- Sunday: Run long (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa1111-0000-0000-0000-000000000002' AND week_number = 5),
    'aaaa1111-0000-0000-0000-000000000002', 7, 1,
    'run', 'endurance', 'Long Run', 95,
    'Easy pace, take a gel at 45 minutes',
    '[
      {"type": "main", "duration_minutes": 95, "target": "Zone 2 effort"}
    ]',
    'hr', 16000, 78,
    'upcoming', NULL
  );


-- ────────────────────────────────────────────
-- Tina's olympic: Week 3 (complete)
-- ────────────────────────────────────────────

INSERT INTO public.sessions (
  plan_week_id, plan_id, day_of_week, sort_order,
  discipline, session_type, title, duration_minutes,
  coaches_notes, workout_steps, target_format,
  planned_distance_m, estimated_tss, status, completed_at
)
VALUES
  -- Monday: Swim technique
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa2222-0000-0000-0000-000000000001', 1, 1,
    'swim', 'technique', 'Stroke Basics', 40,
    'Keep it relaxed, focus on breathing pattern',
    '[
      {"type": "warmup", "distance_m": 200, "description": "Easy free"},
      {"type": "drill", "reps": 4, "distance_m": 50, "description": "Side kick drill"},
      {"type": "main", "reps": 6, "distance_m": 75, "rest_seconds": 20, "target": "Steady"},
      {"type": "cooldown", "distance_m": 100, "description": "Easy"}
    ]',
    'rpe', 900, 28,
    'completed', '2026-03-30 07:00:00+00'
  ),
  -- Tuesday: Bike turbo
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa2222-0000-0000-0000-000000000001', 2, 1,
    'bike', 'endurance', 'Turbo Steady', 50,
    'Consistent cadence on the turbo',
    '[
      {"type": "warmup", "duration_minutes": 10, "description": "Easy spin"},
      {"type": "main", "duration_minutes": 30, "target": "Zone 2 HR"},
      {"type": "cooldown", "duration_minutes": 10, "description": "Easy spin"}
    ]',
    'hr', 30000, 38,
    'completed', '2026-03-31 18:30:00+00'
  ),
  -- Thursday: Run tempo
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa2222-0000-0000-0000-000000000001', 4, 1,
    'run', 'tempo', 'Threshold Run', 45,
    'Comfortable hard effort',
    '[
      {"type": "warmup", "duration_minutes": 10, "description": "Easy jog"},
      {"type": "main", "duration_minutes": 20, "target": "Threshold pace (5:00/km)"},
      {"type": "cooldown", "duration_minutes": 15, "description": "Easy jog"}
    ]',
    'pace', 7500, 40,
    'completed', '2026-04-02 18:00:00+00'
  ),
  -- Saturday: Bike outdoor
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa2222-0000-0000-0000-000000000001', 6, 1,
    'bike', 'endurance', 'Weekend Ride', 75,
    'Find a flat route, enjoy the ride',
    '[
      {"type": "main", "duration_minutes": 75, "target": "Zone 2 HR, cadence 80+"}
    ]',
    'hr', 45000, 55,
    'completed', '2026-04-04 09:00:00+00'
  ),
  -- Sunday: Run easy
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa2222-0000-0000-0000-000000000001', 7, 1,
    'run', 'endurance', 'Easy Long Run', 60,
    'Chat pace, walk breaks are fine',
    '[
      {"type": "main", "duration_minutes": 60, "target": "Easy pace, conversational"}
    ]',
    'rpe', 9000, 42,
    'completed', '2026-04-05 09:00:00+00'
  );

-- ────────────────────────────────────────────
-- Tina's olympic: Week 4 (in_progress)
-- ────────────────────────────────────────────

INSERT INTO public.sessions (
  plan_week_id, plan_id, day_of_week, sort_order,
  discipline, session_type, title, duration_minutes,
  coaches_notes, workout_steps, target_format,
  planned_distance_m, estimated_tss, status, completed_at
)
VALUES
  -- Monday: Swim (completed)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 4),
    'aaaa2222-0000-0000-0000-000000000001', 1, 1,
    'swim', 'intervals', 'CSS Builder', 40,
    'Hold pace on each rep, tight rest',
    '[
      {"type": "warmup", "distance_m": 200, "description": "Easy free"},
      {"type": "main", "reps": 8, "distance_m": 75, "rest_seconds": 15, "target": "CSS pace"},
      {"type": "cooldown", "distance_m": 100, "description": "Easy"}
    ]',
    'pace', 900, 32,
    'completed', '2026-04-06 07:00:00+00'
  ),
  -- Tuesday: Bike (completed)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 4),
    'aaaa2222-0000-0000-0000-000000000001', 2, 1,
    'bike', 'intervals', 'Turbo Intervals', 50,
    'Short sharp efforts on the turbo',
    '[
      {"type": "warmup", "duration_minutes": 10, "description": "Easy spin"},
      {"type": "main", "reps": 6, "duration_minutes": 3, "rest_minutes": 2, "target": "Hard effort, RPE 7-8"},
      {"type": "cooldown", "duration_minutes": 10, "description": "Easy spin"}
    ]',
    'rpe', 28000, 42,
    'completed', '2026-04-07 18:30:00+00'
  ),
  -- Thursday: Run (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 4),
    'aaaa2222-0000-0000-0000-000000000001', 4, 1,
    'run', 'intervals', 'Fartlek', 45,
    'Playful speed changes, use lampposts or landmarks',
    '[
      {"type": "warmup", "duration_minutes": 10, "description": "Easy jog"},
      {"type": "main", "duration_minutes": 25, "description": "Alternate 2min hard / 2min easy"},
      {"type": "cooldown", "duration_minutes": 10, "description": "Easy jog"}
    ]',
    'rpe', 7000, 40,
    'upcoming', NULL
  ),
  -- Saturday: Bike (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 4),
    'aaaa2222-0000-0000-0000-000000000001', 6, 1,
    'bike', 'endurance', 'Turbo Endurance', 70,
    'Steady effort, watch a film if needed',
    '[
      {"type": "main", "duration_minutes": 70, "target": "Zone 2 HR"}
    ]',
    'hr', 42000, 50,
    'upcoming', NULL
  ),
  -- Sunday: Run (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa2222-0000-0000-0000-000000000001' AND week_number = 4),
    'aaaa2222-0000-0000-0000-000000000001', 7, 1,
    'run', 'endurance', 'Easy Long Run', 65,
    'Steady and comfortable throughout',
    '[
      {"type": "main", "duration_minutes": 65, "target": "Easy pace, zone 2"}
    ]',
    'rpe', 9500, 44,
    'upcoming', NULL
  );


-- ────────────────────────────────────────────
-- Fred's sprint: Week 2 (complete)
-- ────────────────────────────────────────────

INSERT INTO public.sessions (
  plan_week_id, plan_id, day_of_week, sort_order,
  discipline, session_type, title, duration_minutes,
  coaches_notes, workout_steps, target_format,
  planned_distance_m, estimated_tss, status, completed_at
)
VALUES
  -- Tuesday: Run easy
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 2),
    'aaaa3333-0000-0000-0000-000000000001', 2, 1,
    'run', 'endurance', 'Easy Run', 30,
    'Keep it easy, walk breaks are perfectly fine',
    '[
      {"type": "main", "duration_minutes": 30, "target": "Easy effort, can hold a conversation"}
    ]',
    'rpe', 4000, 22,
    'completed', '2026-03-31 18:00:00+00'
  ),
  -- Thursday: Bike easy
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 2),
    'aaaa3333-0000-0000-0000-000000000001', 4, 1,
    'bike', 'endurance', 'Easy Ride', 40,
    'Flat route, focus on smooth pedalling',
    '[
      {"type": "main", "duration_minutes": 40, "target": "Easy spinning, RPE 3-4"}
    ]',
    'rpe', 18000, 25,
    'completed', '2026-04-02 18:00:00+00'
  ),
  -- Saturday: Swim open water
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 2),
    'aaaa3333-0000-0000-0000-000000000001', 6, 1,
    'swim', 'technique', 'Open Water Intro', 30,
    'Shallow water, practice sighting every 6 strokes',
    '[
      {"type": "warmup", "duration_minutes": 5, "description": "Wade in, get comfortable"},
      {"type": "main", "duration_minutes": 20, "description": "Swim easy with sighting practice"},
      {"type": "cooldown", "duration_minutes": 5, "description": "Float and relax"}
    ]',
    'rpe', 600, 18,
    'completed', '2026-04-04 10:00:00+00'
  ),
  -- Sunday: Run weekend
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 2),
    'aaaa3333-0000-0000-0000-000000000001', 7, 1,
    'run', 'endurance', 'Weekend Jog', 35,
    'Enjoy it — no pressure on pace',
    '[
      {"type": "main", "duration_minutes": 35, "target": "Easy effort"}
    ]',
    'rpe', 4500, 24,
    'completed', '2026-04-05 09:30:00+00'
  );

-- ────────────────────────────────────────────
-- Fred's sprint: Week 3 (in_progress)
-- ────────────────────────────────────────────

INSERT INTO public.sessions (
  plan_week_id, plan_id, day_of_week, sort_order,
  discipline, session_type, title, duration_minutes,
  coaches_notes, workout_steps, target_format,
  planned_distance_m, estimated_tss, status, completed_at
)
VALUES
  -- Tuesday: Run (completed)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa3333-0000-0000-0000-000000000001', 2, 1,
    'run', 'tempo', 'First Tempo Run', 30,
    'Just pick the pace up slightly in the middle section',
    '[
      {"type": "warmup", "duration_minutes": 10, "description": "Easy jog"},
      {"type": "main", "duration_minutes": 10, "target": "Comfortably hard, RPE 6"},
      {"type": "cooldown", "duration_minutes": 10, "description": "Easy jog"}
    ]',
    'rpe', 4500, 26,
    'completed', '2026-04-07 18:00:00+00'
  ),
  -- Thursday: Bike (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa3333-0000-0000-0000-000000000001', 4, 1,
    'bike', 'endurance', 'Steady Ride', 45,
    'Slightly longer than last week, same effort',
    '[
      {"type": "main", "duration_minutes": 45, "target": "Easy spinning, RPE 3-4"}
    ]',
    'rpe', 20000, 28,
    'upcoming', NULL
  ),
  -- Saturday: Swim (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa3333-0000-0000-0000-000000000001', 6, 1,
    'swim', 'technique', 'Open Water Practice', 30,
    'Try bilateral breathing today',
    '[
      {"type": "warmup", "duration_minutes": 5, "description": "Easy swim"},
      {"type": "main", "duration_minutes": 20, "description": "Continuous swim with bilateral breathing"},
      {"type": "cooldown", "duration_minutes": 5, "description": "Easy float"}
    ]',
    'rpe', 700, 20,
    'upcoming', NULL
  ),
  -- Sunday: Run (upcoming)
  (
    (SELECT id FROM public.plan_weeks WHERE plan_id = 'aaaa3333-0000-0000-0000-000000000001' AND week_number = 3),
    'aaaa3333-0000-0000-0000-000000000001', 7, 1,
    'run', 'endurance', 'Weekend Run', 40,
    'Build to 40 minutes this week — walk if needed',
    '[
      {"type": "main", "duration_minutes": 40, "target": "Easy effort, RPE 3-4"}
    ]',
    'rpe', 5000, 26,
    'upcoming', NULL
  );