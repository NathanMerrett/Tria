// src/features/schedule/api.ts
import { supabase } from '@/src/lib/supabase';
import { CONFIG } from '@/src/lib/config';
import { MockRepository } from '@/src/lib/fixtures';
import { CurrentActivePlan, WorkoutSummary, CoachDayNote, CoachWeekNote } from '@/src/types';

// 1. GET ACTIVE PLAN (Unchanged)
export const getActivePlan = async (userId: string): Promise<CurrentActivePlan | null> => {
    if (CONFIG.USE_MOCKS) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MockRepository.activePlan;
    }

    const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// 2. GET WORKOUTS IN RANGE (Replaces getTodayWorkouts)
export const getWorkoutsInRange = async (
    planId: string,
    startDate: string,
    endDate: string
): Promise<WorkoutSummary[]> => {

    if (CONFIG.USE_MOCKS) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MockRepository.getWorkoutsByRange(startDate, endDate);
    }

    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('plan_id', planId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getCoachNotesInRange = async (
    planId: string,
    startDate: string,
    endDate: string
): Promise<CoachDayNote[]> => {

    if (CONFIG.USE_MOCKS) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MockRepository.getCoachNotesByRange(startDate, endDate);
    }

    const { data, error } = await supabase
        .from('coaches_notes')
        .select('*')
        .eq('plan_id', planId)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) throw error;
    return data || [];
};

// 3. UPDATE STATUS (Renamed for clarity, logic stays similar)
export const updateWorkoutStatus = async (workoutId: string, isComplete: boolean): Promise<void> => {
    if (CONFIG.USE_MOCKS) {
        console.log(`[MOCK API] Toggled workout ${workoutId} to ${isComplete}`);
        MockRepository.updateWorkoutStatus(workoutId, isComplete);
        return;
    }

    const { error } = await supabase
        .from('workouts')
        .update({ completed: isComplete })
        .eq('id', workoutId);

    if (error) throw error;
};

export const getAllWorkoutsForPlan = async (
    planId: string): Promise<WorkoutSummary[]> => {

    if (CONFIG.USE_MOCKS) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MockRepository.getAllWorkoutsForPlan();
    }

    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('plan_id', planId)
        .order('date', { ascending: true });

    if (error) throw error;
    return data;
};

export const getWorkoutById = async (
    workoutId: string
): Promise<WorkoutSummary | null> => {

    if (CONFIG.USE_MOCKS) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MockRepository.getWorkoutById(workoutId) || null;
    }

    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

