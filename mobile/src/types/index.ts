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
}

export interface CoachNote {
    id: string;
    plan_id: string;
    date: string; // "2025-12-12"
    content: string;
}

export interface CurrentActivePlan {
    id: string;
    name: string;
    start_date: string;
    race_date: string;
    current_week: number;
    total_weeks: number;
    current_phase: string;
}
