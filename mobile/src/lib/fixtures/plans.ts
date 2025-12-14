// src/lib/fixtures/plans.ts
import { CurrentActivePlan } from '@/src/types';

export const IRONMAN_PLAN: CurrentActivePlan = {
    id: 'plan-im-703',
    name: 'Ironman 70.3 - Intermediate',
    start_date: '2024-01-01',
    race_date: '2024-06-30',
    current_week: 12,
    total_weeks: 26,
    current_phase: 'Build',
};

export const MARATHON_PLAN: CurrentActivePlan = {
    id: 'plan-marathon-1',
    name: 'Sub-3 Hour Marathon',
    start_date: '2023-08-01',
    race_date: '2023-11-05',
    current_week: 14, // Assuming the plan is finished or near the end
    total_weeks: 14,
    current_phase: 'Race Week',
};

// A helper to get a default for UI testing
export const DEFAULT_PLAN = IRONMAN_PLAN;