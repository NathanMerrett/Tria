// src/lib/fixtures/workouts.ts
import { WorkoutSummary } from '@/src/types';
import { addDays, format } from 'date-fns'; // Highly recommended for date math

// Helper to generate a date string relative to a start date
const getDate = (base: Date, offset: number) => format(addDays(base, offset), 'yyyy-MM-dd');

export const generateIronmanWorkouts = (planId: string, startDate: Date = new Date()): WorkoutSummary[] => [
    {
        id: 'wk-im-1',
        plan_id: planId,
        title: 'Aerobic Endurance',
        description: 'Steady Z2 effort. Focus on cadence.',
        discipline: 'bike',
        duration_mins: 90,
        date: getDate(startDate, 0), // Day 1
        completed: false,
    },
    {
        id: 'wk-im-2',
        plan_id: planId,
        title: 'Recovery Run',
        description: 'Keep it very light.',
        discipline: 'run',
        duration_mins: 30,
        date: getDate(startDate, 0), // Day 1 (Two workouts same day)
        completed: true,
    },
    {
        id: 'wk-im-3',
        plan_id: planId,
        title: 'Morning Swim',
        description: 'Technique drills.',
        discipline: 'swim',
        duration_mins: 45,
        date: getDate(startDate, 1), // Day 2
        completed: false,
    }
];