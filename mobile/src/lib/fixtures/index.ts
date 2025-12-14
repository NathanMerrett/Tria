// src/lib/fixtures/index.ts
import { DEFAULT_PLAN } from './plans';
import { generateIronmanWorkouts } from './workouts';
import { generateIronmanCoachNotes } from './coachnotes';

// Generate the data ONCE when the app loads
const today = new Date();
const baseWorkouts = generateIronmanWorkouts(DEFAULT_PLAN.id, today);
const baseCoachNotes = generateIronmanCoachNotes(DEFAULT_PLAN.id, today);

export const MockRepository = {
    activePlan: DEFAULT_PLAN,

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
    }
};