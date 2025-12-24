// src/lib/fixtures/workouts.ts
import { WorkoutSummary } from '@/src/types';
import { addDays, format } from 'date-fns';

const getDate = (base: Date, offset: number) => format(addDays(base, offset), 'yyyy-MM-dd');

export const generateIronmanWorkouts = (planId: string, startDate: Date = new Date()): WorkoutSummary[] => {
    const NUM_WEEKS = 6;
    const workouts: WorkoutSummary[] = [];

    for (let w = 0; w < NUM_WEEKS; w++) {
        const weekNum = w + 1;
        const weekStartOffset = w * 7;

        // Logic: Week 4 is recovery (reduce load), otherwise progressive build
        const isRecovery = weekNum === 4;
        const loadFactor = isRecovery ? 0.7 : 1 + (w * 0.05);

        // 1. Tuesday: Swim Intervals (Technique/Speed)
        workouts.push({
            id: `wk-${weekNum}-swim`,
            plan_id: planId,
            title: isRecovery ? 'Recovery Swim' : `Speed Intervals ${weekNum}`,
            category: 'Technique',
            description: isRecovery
                ? 'Focus purely on body position and breathing. Easy effort.'
                : 'Warm up, then 10x100m at CSS pace, 15s rest.',
            discipline: 'swim',
            duration_mins: Math.round(45 * loadFactor),
            date: getDate(startDate, weekStartOffset + 1), // Tuesday
            week_number: weekNum,
            completed: w < 1, // Mark first week as done for UI testing
            is_key_session: false,
        });

        // 2. Thursday: Bike Threshold (Power)
        workouts.push({
            id: `wk-${weekNum}-bike-pwr`,
            plan_id: planId,
            title: `Sweet Spot Intervals ${weekNum}`,
            category: 'Build',
            description: '2x20 mins at 88-92% FTP. Focus on keeping aero position.',
            discipline: 'bike',
            duration_mins: Math.round(60 * loadFactor),
            date: getDate(startDate, weekStartOffset + 3), // Thursday
            week_number: weekNum,
            completed: w < 1,
            is_key_session: true,
        });

        // 3. Saturday: Long Run (Endurance)
        workouts.push({
            id: `wk-${weekNum}-run-long`,
            plan_id: planId,
            title: 'Aerobic Endurance Run',
            category: 'Endurance',
            description: 'Strict Z2 heart rate. Conversational pace.',
            discipline: 'run',
            duration_mins: Math.round(50 * loadFactor), // Builds from 50m to ~1h15
            date: getDate(startDate, weekStartOffset + 5), // Saturday
            week_number: weekNum,
            completed: false,
            is_key_session: true,
        });

        // 4. Sunday: Brick Session (Bike + Run) or Recovery
        workouts.push({
            id: `wk-${weekNum}-brick`,
            plan_id: planId,
            title: isRecovery ? 'Coffee Ride' : 'Sunday Brick',
            category: isRecovery ? 'Recovery' : 'Simulation',
            description: isRecovery
                ? 'Spin the legs out, high cadence, low power.'
                : 'Moderate bike followed immediately by 15 min run off the bike.',
            discipline: 'bike',
            duration_mins: Math.round(90 * loadFactor),
            date: getDate(startDate, weekStartOffset + 6), // Sunday
            week_number: weekNum,
            completed: false,
            is_key_session: !isRecovery,
        });
    }

    return workouts;
};