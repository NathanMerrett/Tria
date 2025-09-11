import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { View, StyleSheet, Alert} from 'react-native';
import { useTheme, Text, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/context/UserContext';
import { getInitials } from "@/utils/helpers";

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, profile } = useUser();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign out failed", error.message);
      return;
    }
    router.replace("/");
  };

  const handleEditProfile = () => {
    console.log('go to edit');
    // You can navigate to the edit screen like this:
    // router.push('/profile/edit');
  };

  const first_name = profile?.first_name || user?.email || 'User';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Avatar with initials */}
      <Avatar.Text
        size={100}
        label={getInitials(first_name)}
        style={styles.avatar}
      />

      {/* 2. Full Name */}
      <Text variant="titleLarge" style={styles.nameText}>
        {first_name}
      </Text>

      {/* 3. Joined Date Placeholder */}
      <Text variant="bodyMedium" style={styles.joinedText}>
        Joined August 2025
      </Text>

      {/* 4. Edit Profile Button */}
      <Button
        icon="pencil"
        mode="contained-tonal"
        onPress={handleEditProfile}
        style={styles.button}
      >
        Edit Profile
      </Button>

      {/* 5. Sign Out Button */}
      <Button
        onPress={signOut}
        textColor={theme.colors.error}
        style={styles.button}
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // Center all content
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginBottom: 20,
  },
  nameText: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  joinedText: {
    marginBottom: 24, // More space before buttons
  },
  button: {
    width: '80%', // Make buttons a consistent width
    marginVertical: 8, // Add vertical space between buttons
  },
});