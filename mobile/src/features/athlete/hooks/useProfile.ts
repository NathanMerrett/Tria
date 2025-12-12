import { useQuery } from '@tanstack/react-query';
import { profileService } from '../api/profileService';

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'], // Unique key for caching
        queryFn: profileService.getProfile,
        staleTime: 1000 * 60 * 60, // Keep data fresh for 1 hour
    });
};