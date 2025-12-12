// src/types/index.ts
import { User as SupabaseUser } from '@supabase/supabase-js';

// Re-export Supabase user for convenience
export type AuthUser = SupabaseUser;

export interface Workout {
    id: string;
    plan_id: string;
    title: string;
    description: string;
    discipline: 'swim' | 'bike' | 'run' | 'strength';
    duration_mins: number;
    date: string; // ISO String '2025-10-12'
    completed: boolean;
}

export interface TrainingPlan {
    id: string;
    user_id: string;
    name: string;
    status: 'active' | 'completed' | 'paused';
}