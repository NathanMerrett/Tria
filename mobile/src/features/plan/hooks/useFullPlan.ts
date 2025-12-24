import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { differenceInWeeks, parseISO, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { useUser } from '@/src/context/UserContext';
import * as planApi from '../api';
import { PlanMatrix, WeekData } from '@/src/types';

export const useFullPlan = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();

    // 1. Fetch Plan Metadata
    const planQuery = useQuery({
        queryKey: ['activePlan', user?.id],
        queryFn: () => planApi.getActivePlan(user?.id!),
        enabled: !!user?.id,
    });
    const activePlan = planQuery.data;

    // 2. Fetch ALL Workouts for the Plan
    const workoutsQueryKey = ['planWorkouts', activePlan?.id];
    const workoutsQuery = useQuery({
        queryKey: workoutsQueryKey,
        queryFn: () => planApi.getAllWorkoutsForPlan(activePlan!.id),
        enabled: !!activePlan?.id,
    });

    // // 3. Mutation: Move Workout (Drag & Drop)
    // const moveWorkoutMutation = useMutation({
    //     mutationFn: ({ id, newDate }: { id: string, newDate: string }) => 
    //         planApi.updateWorkoutDate(id, newDate),

    //     onMutate: async ({ id, newDate }) => {
    //         await queryClient.cancelQueries({ queryKey: workoutsQueryKey });
    //         const previous = queryClient.getQueryData(workoutsQueryKey);

    //         // Optimistic Update: Find the workout and change its date in the cache
    //         queryClient.setQueryData(workoutsQueryKey, (old: any[]) => {
    //             return old.map(w => w.id === id ? { ...w, date: newDate } : w);
    //         });

    //         return { previous };
    //     },
    //     onError: (err, vars, context) => {
    //         if (context?.previous) queryClient.setQueryData(workoutsQueryKey, context.previous);
    //     },
    //     onSettled: () => queryClient.invalidateQueries({ queryKey: workoutsQueryKey })
    // });

    // 4. THE MAGIC: Transform Data for the UI
    const matrix = useMemo<PlanMatrix | null>(() => {
        if (!workoutsQuery.data || !activePlan) return null;

        const workouts = workoutsQuery.data;

        // A. Calculate Macro Stats (for the Dashboard Header)
        const completedWorkouts = workouts.filter(w => w.completed);
        const stats = {
            currentWeek: activePlan.current_week,
            totalWeeks: activePlan.total_weeks,
            swimTotal: completedWorkouts.filter(w => w.discipline === 'swim').reduce((acc, curr) => acc + curr.duration_mins, 0),
            bikeTotal: completedWorkouts.filter(w => w.discipline === 'bike').reduce((acc, curr) => acc + curr.duration_mins, 0),
            runTotal: completedWorkouts.filter(w => w.discipline === 'run').reduce((acc, curr) => acc + curr.duration_mins, 0),
            daysUntilRace: differenceInDays(parseISO(activePlan.race_date), new Date()),
        };

        // B. Structure the Timeline (Grouping by Week)
        // We create an array of 12 (or however many) weeks

        const timeline: WeekData[] = Array.from({ length: activePlan.total_weeks }).map((_, index) => {
            const weekNum = index + 1;
            const weekWorkouts = workouts.filter(w => w.week_number === weekNum);

            // Sort by date to avoid UI jumble
            weekWorkouts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            const totalDuration = weekWorkouts.reduce((acc, curr) => acc + (curr.duration_mins || 0), 0);

            // Logic to determine status
            const isPast = weekNum < activePlan.current_week;
            const isCurrent = weekNum === activePlan.current_week;

            // TS might infer 'string', so we force the specific union type
            const status: WeekData['status'] = isCurrent ? 'active' : (isPast ? 'completed' : 'future');

            return {
                weekNumber: weekNum,
                status,
                totalDuration,
                workouts: weekWorkouts,
            };
        });

        return {
            stats,
            timeline,
            raceName: activePlan.name,
            raceDate: activePlan.race_date
        };

    }, [workoutsQuery.data, activePlan]);

    return {
        isLoading: planQuery.isLoading || workoutsQuery.isLoading,
        data: matrix,
    };
};