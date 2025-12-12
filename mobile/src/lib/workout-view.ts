// src/types/workout-view.ts

// 1. The Atomic Step (The Card)
export interface StepView {
    id: string; // unique for React keys
    type: 'warmup' | 'active' | 'rest' | 'cooldown';
    label: string; // "Tempo Interval"
    durationLabel: string; // "10:00" or "400m"
    intensityLabel: string; // "200-220W" or "Z2"
    intensityColor: string; // Hex code for UI (e.g., #FFD700 for Z4)
    description: string; // The short human instruction
}

// 2. The Block (The Grouping)
export interface BlockView {
    id: string;
    repeats: number; // If > 1, show "2x" badge
    steps: StepView[];
    totalBlockDuration: number; // helpful for "Block length: 20m"
}

// 3. The Full Page Model
export interface WorkoutDetailView {
    // Header Stats
    title: string;
    totalDurationLabel: string; // "1h 30m"
    totalDistanceLabel: string; // "10km" (or null if time-based)
    mainFocus: 'Endurance' | 'Threshold' | 'VO2 Max';

    // The Meat (List of Blocks)
    blocks: BlockView[];

    // Text Sections
    coachNotes: string;
    phaseInstructions: {
        before: string; // "Hydrate well, bring a gel"
        during: string; // "Focus on cadence"
        after: string;  // "Stretch calves, protein shake"
    };
}