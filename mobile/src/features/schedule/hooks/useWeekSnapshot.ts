import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';
import { useUser } from '@/src/context/UserContext'; // Assuming you have this
import { WorkoutSummary, CoachNote } from '@/src/types';
import * as scheduleApi from '../api';

export const useWeekSnapshot = (selectedDate: Date) => {
    const { user } = useUser();
    const queryClient = useQueryClient();

    // 1. Calculate Range (Mon-Sun)
    // Note: We format these just once to keep keys stable
    const rangeStart = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const rangeEnd = format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');

    // 2. Fetch Plan Context
    const planQuery = useQuery({
        queryKey: ['activePlan', user?.id],
        queryFn: () => scheduleApi.getActivePlan(user?.id!),
        enabled: !!user?.id,
    });

    const activePlan = planQuery.data;

    // 3. Fetch Week Workouts
    // We include user.id and rangeStart in the key so it refetches on week change
    const weekQueryKey = ['weekWorkouts', activePlan?.id, rangeStart];

    const weekQuery = useQuery({
        queryKey: weekQueryKey,
        queryFn: () => scheduleApi.getWorkoutsInRange(activePlan!.id, rangeStart, rangeEnd),
        enabled: !!activePlan?.id,
        // Keep previous data visible while fetching the next week to prevent "flicker"
        placeholderData: (previousData) => previousData,
    });

    const weekNotesQueryKey = ['weekNotes', activePlan?.id, rangeStart];

    const weekNotesQuery = useQuery({
        queryKey: weekNotesQueryKey,
        queryFn: () => scheduleApi.getCoachNotesInRange(activePlan!.id, rangeStart, rangeEnd),
        enabled: !!activePlan?.id,
        placeholderData: (previousData) => previousData,
    });

    // 4. Mutation: Toggle Status
    // This connects the UI checkbox to the API + Optimistic Updates
    const toggleMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: boolean }) =>
            scheduleApi.updateWorkoutStatus(id, status),

        onMutate: async ({ id, status }) => {
            // A. Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: weekQueryKey });

            // B. Snapshot previous value
            const previousWorkouts = queryClient.getQueryData<WorkoutSummary[]>(weekQueryKey);
            // C. Optimistically update the cache
            if (previousWorkouts) {
                queryClient.setQueryData<WorkoutSummary[]>(weekQueryKey, (old) => {
                    if (!old) return [];
                    return old.map((w) =>
                        w.id === id ? { ...w, completed: status } : w
                    );
                });
            }

            return { previousWorkouts };
        },

        onError: (_err, _vars, context) => {
            // Rollback on error
            if (context?.previousWorkouts) {
                queryClient.setQueryData(weekQueryKey, context.previousWorkouts);
            }
        },

        onSettled: () => {
            // Sync with server eventually
            queryClient.invalidateQueries({ queryKey: weekQueryKey });
        },
    });

    // 5. Derived State (The Magic Layer)
    const snapshot = useMemo(() => {
        const workouts = weekQuery.data || [];
        const notes = weekNotesQuery.data || [];
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

        // Filter for the selected day
        const todaysWorkouts = workouts.filter(w => w.date === selectedDateStr);
        const todaysNote = notes.find(n => n.date === selectedDateStr);

        // Calculate stats for the WHOLE week
        const totalWorkouts = workouts.length;
        const completedCount = workouts.filter(w => w.completed).length;
        const progressPercentage = totalWorkouts ? (completedCount / totalWorkouts) : 0;

        return {
            status: 'active', // You could expand this logic later
            planName: activePlan?.name,

            currentPhase: activePlan?.current_phase || 'General',

            planProgress: {
                currentWeek: activePlan?.current_week,
                totalWeeks: activePlan?.total_weeks,
            },

            // The Day View
            selectedDay: {
                date: selectedDateStr,
                workouts: todaysWorkouts,
                isRestDay: todaysWorkouts.length === 0,
                notes: todaysNote?.content,
            },

            // The Week Context
            weekStats: {
                totalWorkouts,
                completedWorkouts: completedCount,
                completionRate: progressPercentage,
            }
        };
    }, [weekQuery.data, selectedDate, activePlan]);

    const isWeekLoading = (weekQuery.isLoading && !weekQuery.isPlaceholderData) ||
        (weekNotesQuery.isLoading && !weekNotesQuery.isPlaceholderData);

    return {
        isLoading: planQuery.isLoading || isWeekLoading,
        data: snapshot,
        hasPlan: !!activePlan,
        toggleWorkout: (id: string, status: boolean) => toggleMutation.mutate({ id, status }),
        refetch: () => {
            planQuery.refetch();
            weekQuery.refetch();
            weekNotesQuery.refetch();
        }
    };
};