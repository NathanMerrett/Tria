import { Stack, Redirect } from "expo-router";
import { useUser } from '@/src/context/UserContext';
import { WizardProvider } from '@/src/context/WizardContext';

export default function WizardLayout() {
  const { session } = useUser();

  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <WizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WizardProvider>
  );
}
