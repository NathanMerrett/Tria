// src/types/index.ts
import { User as SupabaseUser } from '@supabase/supabase-js';

// Re-export Supabase user for convenience
export type AuthUser = SupabaseUser;

export interface WorkoutSummary {
    id: string;
    plan_id: string;
    title: string;
    description: string;
    discipline: 'swim' | 'bike' | 'run' | 'strength';
    duration_mins: number;
    date: string; // ISO String '2025-10-12'
    completed: boolean;
    week_number: number;
    is_key_session: boolean;
    category: string;
}

export interface WeekData {
    weekNumber: number;
    status: 'active' | 'completed' | 'future';
    totalDuration: number;
    workouts: WorkoutSummary[];
}

export interface PlanMatrix {
    stats: {
        currentWeek: number;
        totalWeeks: number;
        swimTotal: number;
        bikeTotal: number;
        runTotal: number;
        daysUntilRace: number;
    };
    timeline: WeekData[];
    raceName: string;
    raceDate: string;
}

export interface CoachDayNote {
    id: string;
    plan_id: string;
    date: string; // "2025-12-12"
    content: string;
}

export interface CoachWeekNote {
    id: string;
    plan_id: string;
    week_id: string;
    content: string;
}

export interface CurrentActivePlan {
    id: string;
    name: string;
    start_date: string;
    race_date: string;
    current_week: number;
    total_weeks: number;
    current_phase: 'Base' | 'Build' | 'Peak' | 'Taper' | 'Race';
    status: 'active' | 'paused' | 'completed';
}
