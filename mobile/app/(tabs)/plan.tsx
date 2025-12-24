import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
// import { useRouter } from 'expo-router'; // Example navigation import

import { useFullPlan } from '@/src/features/plan/hooks/useFullPlan';
import { PlanOverviewCard } from '@/src/features/plan/components/planScreen/PlanSummaryCard/PlanOverviewCard';
import { PlanActions } from '@/src/features/plan/components/planScreen/PlanActions/PlanActions';
import { PlanWeekAccordion } from '@/src/features/plan/components/planScreen/PlanWeeks/WeekAccordion';
import { PlanWeekCard } from '@/src/features/plan/components/planScreen/PlanWeeks/WeekCard';

const PlanScreen = () => {
    const { isLoading, data } = useFullPlan();
    const theme = useTheme();
    // const router = useRouter();

    const handleRearrange = () => {
        console.log('[PlanScreen] Rearrange pressed');
        // router.push('/plan/rearrange');
    };

    const handleEditPlan = () => {
        console.log('[PlanScreen] Edit Plan pressed');
        // router.push('/plan/edit'); 
    };

    if (isLoading || !data) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const { stats, raceName, raceDate, timeline } = data;

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            contentContainerStyle={{ paddingBottom: 32 }} // Add bottom padding for scrolling
        >
            {/* 1. The Dashboard Data */}
            <PlanOverviewCard
                planName={raceName}
                raceDate={raceDate}
                daysUntilRace={stats.daysUntilRace}
                stats={stats}
            />

            {/* 2. The Control Strip (Sits flat on background) */}
            <PlanActions
                onRearrangePress={handleRearrange}
                onEditPress={handleEditPlan}
            />

            {/* 3. Future Week View will go here */}

            {/* 4. The Timeline (Week Accordions) */}
            <View style={{ paddingHorizontal: 16 }}>
                {/* {timeline.map((week) => (
                    <PlanWeekAccordion
                        key={week.weekNumber}
                        week={week}
                    />
                ))} */}

                {timeline.map((week) => (
                    <PlanWeekCard
                        key={week.weekNumber}
                        week={week}
                        onPress={() => console.log('Week pressed')}
                    />
                ))}
            </View>

        </ScrollView>
    );
}

export default PlanScreen;