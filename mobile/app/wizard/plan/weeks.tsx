// app/wizard/gear/gear.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView, Platform, View } from 'react-native';
import { Text, Button, Card, Divider, useTheme, ToggleButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import { useWizardDispatch, useWizardState } from '@/src/context/WizardContext';

type YesNoStr = 'yes' | 'no';

export default function Gear() {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useWizardDispatch();
    const { hasHRMonitor, hasPowerMeter } = useWizardState();

    // local UI state only
    const [hrBool, setHrBool] = useState<boolean | null>(null);
    const [powerBool, setPowerBool] = useState<boolean | null>(null);

    // prefill from wizard context if user goes back
    useEffect(() => {
        if (typeof hasHRMonitor === 'boolean') setHrBool(hasHRMonitor);
        if (typeof hasPowerMeter === 'boolean') setPowerBool(hasPowerMeter);
    }, [hasHRMonitor, hasPowerMeter]);

    const hrValue: YesNoStr | '' = hrBool === null ? '' : hrBool ? 'yes' : 'no';
    const powerValue: YesNoStr | '' = powerBool === null ? '' : powerBool ? 'yes' : 'no';

    const canContinue = useMemo(() => hrBool !== null && powerBool !== null, [hrBool, powerBool]);

    const onContinue = () => {
        if (!canContinue) return;

        // ✅ commit local answers to wizard context
        dispatch({ type: 'SET_HAS_HR_MONITOR', payload: hrBool! });
        dispatch({ type: 'SET_HAS_POWER_METER', payload: powerBool! });

        // then navigate to the next screen
        router.push('/wizard/race/startdate'); // replace with your actual next step
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
            <WizardHeader step={8} />
            <ScrollView
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text variant="headlineSmall" style={{ marginBottom: 8 }}>What sensors do you have access to?</Text>
                <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
                    Tell us what training sensors you have so we can use these as part of training. If you don't have access to them, don't worry.
                </Text>

                <Card mode="elevated" style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={{ marginBottom: 12 }}>Do you have a heart-rate monitor?</Text>
                        <ToggleButton.Group onValueChange={(v) => setHrBool(v === 'yes')} value={hrValue}>
                            <View style={styles.toggleRow}>
                                <ToggleButton icon="check" value='yes' style={styles.toggle} />
                                <ToggleButton icon="close" value="no" style={styles.toggle} />
                            </View>
                        </ToggleButton.Group>
                    </Card.Content>
                </Card>

                <Divider style={{ marginVertical: 8 }} />

                <Card mode="elevated" style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={{ marginBottom: 12 }}>Do you have a cycling power meter?</Text>
                        <ToggleButton.Group onValueChange={(v) => setPowerBool(v === 'yes')} value={powerValue}>
                            <View style={styles.toggleRow}>
                                <ToggleButton icon="check" value="yes" style={styles.toggle} />
                                <ToggleButton icon="close" value="no" style={styles.toggle} />
                            </View>
                        </ToggleButton.Group>
                    </Card.Content>
                </Card>

                <Button mode="contained" onPress={onContinue} disabled={!canContinue} style={{ marginTop: 12 }}>
                    Next
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flexGrow: 1, padding: 20, gap: 16, justifyContent: 'flex-start' },
    card: { borderRadius: 12 },
    toggleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    toggle: { flex: 1, borderRadius: 8, borderWidth: 2 },
});
