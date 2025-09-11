import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

// Define the shape of your profile data
interface Profile {
  first_name: string;
  // Add other profile fields here
}

interface UserContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('UserProvider useEffect: Starting initial session check...');
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('UserProvider: Error getting initial session:', error.message);
        } else {
          console.log('UserProvider: Initial session data received.');
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            console.log('UserProvider: User found in initial session, fetching profile for ID:', session.user.id);
            fetchProfile(session.user);
          } else {
            console.log('UserProvider: No user found in initial session.');
          }
        }
      } catch (e) {
        console.error('UserProvider: Unexpected error during initial session check:', e);
      } finally {
        setLoading(false);
        console.log('UserProvider: Initial session check finished. Loading set to false.');
      }
    };

    getInitialSession();


    console.log('UserProvider: Setting up Auth State Change listener...');
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log(`UserProvider: Auth State Changed! Event: ${_event}`);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('UserProvider: User found after auth state change, fetching profile for ID:', session.user.id);
        fetchProfile(session.user);
      } else {
        console.log('UserProvider: No user found after auth state change (user logged out or session expired).');
      }
    });

    return () => {
      console.log('UserProvider: Unsubscribing from Auth State Change listener.');
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (user: User) => {
    console.log('UserProvider: Attempting to fetch profile for user ID:', user.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('UserProvider: Error fetching profile:', error.message);
      // Depending on your error handling strategy, you might want to clear the profile or keep the old one.
      // For now, we'll just log the error.
    } else {
      console.log('UserProvider: Profile fetched successfully for user ID:', user.id, data);
      setProfile(data);
    }
  };

  console.log('UserProvider: Rendering. Current session:', session ? 'Active' : 'None', 'User:', user ? user.id : 'None', 'Loading:', loading);

  return (
    <UserContext.Provider value={{ user, session, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    console.error('useUser must be used within a UserProvider');
    throw new Error('useUser must be used within a UserProvider');
  }
  // console.log('useUser: Context accessed. User:', context.user ? context.user.id : 'None', 'Loading:', context.loading);
  return context;
};