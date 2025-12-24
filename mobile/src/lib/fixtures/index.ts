// src/lib/fixtures/index.ts
import { generateIronmanPlan } from './plans';
import { generateIronmanWorkouts } from './workouts';
import { generateIronmanCoachNotes } from './coachnotes';
import { subWeeks } from 'date-fns'; // Import if you want to simulate being mid-plan

// --- CONFIGURATION ---
// Option A: Start Plan Today (Week 1)
const PLAN_START_DATE = '2025-12-01';

// Option B: Simulate we are currently in Week 4 (Backdate the start)
// const PLAN_START_DATE = subWeeks(new Date(), 3); 
// ---------------------

// 1. Generate the Plan first
const activePlan = generateIronmanPlan(new Date(PLAN_START_DATE));

// 2. Generate Workouts & Notes using the SAME start date
// Note: We use the ID from the generated plan to link them
const baseWorkouts = generateIronmanWorkouts(activePlan.id, new Date(PLAN_START_DATE));
const baseCoachNotes = generateIronmanCoachNotes(activePlan.id, new Date(PLAN_START_DATE));

export const MockRepository = {
    activePlan, // Export the generated plan

    getWorkoutsByRange: (startDate: string, endDate: string) => {
        return baseWorkouts.filter(w => w.date >= startDate && w.date <= endDate);
    },
    getCoachNotesByRange: (startDate: string, endDate: string) => {
        return baseCoachNotes.filter(n => n.date >= startDate && n.date <= endDate);
    },
    getWorkoutById: (id: string) => {
        return baseWorkouts.find(w => w.id === id);
    },
    updateWorkoutStatus: (id: string, status: boolean) => {
        const workout = baseWorkouts.find(w => w.id === id);
        if (workout) workout.completed = status;
        return workout;
    },
    getAllWorkoutsForPlan: () => {
        return baseWorkouts;
    },
};