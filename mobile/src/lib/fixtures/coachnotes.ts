// src/lib/fixtures/workouts.ts
import { CoachNote } from '@/src/types';
import { addDays, format } from 'date-fns';

const getDate = (base: Date, offset: number) => format(addDays(base, offset), 'yyyy-MM-dd');

export const generateIronmanCoachNotes = (planId: string, startDate: Date = new Date()): CoachNote[] => [
    // --- Day 1: Double Workout Day ---
    {
        id: 'note-im-1',
        plan_id: planId,
        date: getDate(startDate, 0),
        content: 'AM Swim: Focus on the catch. PM Bike: Keep the cadence high (95rpm) to flush the legs.',
    },
    {
        id: 'note-im-2',
        plan_id: planId,
        date: getDate(startDate, 0),
        content: 'If you are crunched for time, prioritize the Bike session over the Swim today.',
    },

    // --- Day 2: Reference to "Older Workouts" / Context ---
    {
        id: 'note-im-3',
        plan_id: planId,
        date: getDate(startDate, 1),
        content: 'Compare your heart rate on this tempo run to the one you did on Oct 12th. I want to see if the drift is lower.',
    },

    // --- Day 3: Detailed Nutrition/Strategy Instruction ---
    {
        id: 'note-im-4',
        plan_id: planId,
        date: getDate(startDate, 2),
        content: 'Big gear work today. Watch the knees. If you feel any twinge, switch immediately to the "Recovery Spin" workout from the library instead.',
    }
];