// src/features/schedule/api.ts
import { supabase } from '@/src/lib/supabase'; // Your supabase client
import { CONFIG } from '@/src/lib/config';
import { Workout, TrainingPlan } from '@/src/types';

// --- MOCK DATA ---
const MOCK_PLAN: TrainingPlan = {
    id: 'plan-123',
    user_id: 'mock-user',
    name: 'Ironman 70.3',
    status: 'active',
};

const MOCK_WORKOUTS: Workout[] = [
    {
        id: 'wk-1',
        plan_id: 'plan-123',
        title: 'Aerobic Endurance',
        description: 'Steady Z2 effort. Focus on cadence.',
        discipline: 'bike',
        duration_mins: 90,
        date: new Date().toISOString().split('T')[0], // Today
        completed: false,
    },
    {
        id: 'wk-2',
        plan_id: 'plan-123',
        title: 'Recovery Run',
        description: 'Keep it very light.',
        discipline: 'run',
        duration_mins: 30,
        date: new Date().toISOString().split('T')[0], // Today
        completed: true,
    },
    {
        id: 'wk-3',
        plan_id: 'plan-123',
        title: 'Morning Swim',
        description: 'Technique drills.',
        discipline: 'swim',
        duration_mins: 45,
        date: '2023-01-01', // Old date (shouldn't show up today)
        completed: true,
    }
];

// --- API FUNCTIONS ---

export const getActivePlan = async (userId: string): Promise<TrainingPlan | null> => {
    if (CONFIG.USE_MOCKS) {
        // Artificial delay to test your loading spinners!
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_PLAN;
        // Return null here to test "Empty State" UI
    }

    const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore "No rows" error
    return data;
};

export const getTodayWorkouts = async (planId: string, dateStr: string): Promise<Workout[]> => {
    if (CONFIG.USE_MOCKS) {
        await new Promise(resolve => setTimeout(resolve, 600));
        // Simple filter to simulate database query
        return MOCK_WORKOUTS.filter(w => w.date === dateStr);
    }

    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('plan_id', planId)
        .eq('date', dateStr);

    if (error) throw error;
    return data || [];
};

export const toggleWorkoutComplete = async (workoutId: string, isComplete: boolean): Promise<void> => {
    if (CONFIG.USE_MOCKS) {
        console.log(`[MOCK API] Toggled workout ${workoutId} to ${isComplete}`);
        const target = MOCK_WORKOUTS.find(w => w.id === workoutId);
        if (target) target.completed = isComplete;
        return;
    }

    const { error } = await supabase
        .from('workouts')
        .update({ completed: isComplete })
        .eq('id', workoutId);

    if (error) throw error;
};