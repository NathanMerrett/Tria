import { supabase } from '@/src/lib/supabase';
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export const authService = {
    signIn: async ({ email, password }: SignInWithPasswordCredentials) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        return data;
    },

    signUp: async ({ email, password, options }: SignUpWithPasswordCredentials) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options,
        });

        if (error) throw new Error(error.message);
        return data;
    },

    resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // This tells Supabase to open your app after they click the link
            // Ensure your app.json has a scheme defined (e.g., "scheme": "mytriathlonapp")
            redirectTo: 'mytriathlonapp://reset-callback',
        });

        if (error) throw new Error(error.message);
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },

};