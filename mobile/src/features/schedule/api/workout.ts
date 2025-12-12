import { supabase } from '@/src/lib/supabase';
import { CONFIG } from '@/src/lib/config';
import { Workout } from '@/src/types';

// --- MOCK DATA ---
const MOCK_WORKOUT_DETAIL: Workout = {
    id: 'wk-1',
    plan_id: 'plan-123',
    title: 'Aerobic Endurance',
    description: 'Steady Z2 effort. Focus on cadence. \n\nWarm up: 10 mins easy.\nMain Set: 3 x 15 mins Z2, 5 mins rest.\nCool down: 10 mins easy.',
    discipline: 'bike',
    duration_mins: 90,
    date: new Date().toISOString().split('T')[0],
    completed: false,
};

export const getWorkoutById = async (workoutId: string): Promise<Workout | null> => {
    if (CONFIG.USE_MOCKS) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { ...MOCK_WORKOUT_DETAIL, id: workoutId };
    }

    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

    if (error) throw error;
    return data;
};
