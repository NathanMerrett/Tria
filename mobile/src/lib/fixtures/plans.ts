// src/lib/fixtures/plans.ts
import { CurrentActivePlan } from '@/src/types';
import { addWeeks, differenceInWeeks, format } from 'date-fns';

export const generateIronmanPlan = (startDate: Date): CurrentActivePlan => {
    const TOTAL_WEEKS = 12;
    const today = new Date();

    // Calculate race date based on start date + total duration
    const raceDate = addWeeks(startDate, TOTAL_WEEKS);

    // Calculate current week (1-based index), ensuring it doesn't go below 1 or above total
    const weeksPassed = differenceInWeeks(today, startDate);
    const currentWeek = Math.max(1, Math.min(weeksPassed + 1, TOTAL_WEEKS));

    // Simple phase logic based on week number
    let phase = 'Base';
    if (currentWeek > 8) phase = 'Build';
    if (currentWeek > 20) phase = 'Peak';
    if (currentWeek > 24) phase = 'Taper';

    return {
        id: 'plan-im-703',
        name: 'Ironman 70.3 - Intermediate',
        start_date: format(startDate, 'yyyy-MM-dd'),
        race_date: format(raceDate, 'yyyy-MM-dd'),
        status: 'active',
        current_week: currentWeek,
        total_weeks: TOTAL_WEEKS,
        current_phase: phase as 'Base' | 'Build' | 'Peak' | 'Taper' | 'Race',
    };
};