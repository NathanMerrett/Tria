import { supabase } from '@/src/lib/supabase';

export const profileService = {
    getProfile: async () => {
        // 1. Get current Auth User ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        // 2. Fetch public profile
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
};