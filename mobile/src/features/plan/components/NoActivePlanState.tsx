// src/components/EmptyPlanState.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const NoActivePlanState = ({ onCreate }: { onCreate: () => void }) => (
    <View style={styles.container}>
        <Text style={styles.text}>No active training plan.</Text>
        <Button title="Let's start a new plan" onPress={onCreate} />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    text: { fontSize: 18, marginBottom: 20, color: '#555' }
});