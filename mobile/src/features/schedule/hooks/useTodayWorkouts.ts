// src/features/schedule/hooks/useTodayWorkouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/src/context/UserContext';
import * as scheduleApi from '../api/today'; // Import the file above
import { Workout } from '@/src/types';

export const useTodayWorkouts = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Get Plan
    const planQuery = useQuery({
        queryKey: ['activePlan', user?.id],
        queryFn: () => scheduleApi.getActivePlan(user?.id!),
        enabled: !!user?.id,
    });

    const activePlan = planQuery.data;

    // Define the specific query key so we can target it easily later
    const workoutsQueryKey = ['todayWorkouts', activePlan?.id, todayStr];

    // 2. Get Workouts (Dependent)
    const workoutsQuery = useQuery({
        queryKey: workoutsQueryKey,
        queryFn: () => scheduleApi.getTodayWorkouts(activePlan!.id, todayStr),
        enabled: !!activePlan, // Only fetch if plan exists
    });

    // 3. Mutation (Toggle Complete)
    const toggleMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: boolean }) =>
            scheduleApi.toggleWorkoutComplete(id, status),

        // When mutate is called:
        onMutate: async ({ id, status }) => {
            // A. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: workoutsQueryKey });

            // B. Snapshot the previous value (for rollback)
            const previousWorkouts = queryClient.getQueryData<Workout[]>(workoutsQueryKey);

            // C. Optimistically update to the new value
            queryClient.setQueryData<Workout[]>(workoutsQueryKey, (old) => {
                if (!old) return [];
                return old.map((w) =>
                    w.id === id ? { ...w, completed: status } : w
                );
            });

            // Return context object with the snapshot
            return { previousWorkouts };
        },

        // If the API fails:
        onError: (_err, _newTodo, context) => {
            // Rollback to the snapshot
            if (context?.previousWorkouts) {
                queryClient.setQueryData(workoutsQueryKey, context.previousWorkouts);
            }
        },

        // Always run after error or success:
        onSettled: () => {
            // Sync with server just to be safe
            queryClient.invalidateQueries({ queryKey: ['todayWorkouts'] });
        },
    });

    return {
        isLoading: planQuery.isLoading || (!!activePlan && workoutsQuery.isLoading),
        hasPlan: !!activePlan,
        planName: activePlan?.name,
        workouts: workoutsQuery.data || [],
        // Wrapper to make it easy to call from UI
        toggleWorkout: (id: string, status: boolean) => toggleMutation.mutate({ id, status }),
        refresh: () => {
            planQuery.refetch();
            workoutsQuery.refetch();
        }
    };
};