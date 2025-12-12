import { useQuery } from '@tanstack/react-query';
import * as workoutApi from '../api/workout';

export const useWorkout = (id: string) => {
    const queryKey = ['workout', id];

    const query = useQuery({
        queryKey,
        queryFn: () => workoutApi.getWorkoutById(id),
        enabled: !!id,
    });

    return {
        workout: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};
