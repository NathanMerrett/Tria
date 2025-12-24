export const DISCIPLINE_COLORS: Record<string, string> = {
    swim: '#38b6ff',    // Electric Blue (Cyan-ish)
    bike: '#ff9f1c',    // Bright Amber/Orange
    run: '#2ec4b6',     // Teal/Green (Distinct from Swim blue)
    strength: '#c77dff', // Bright Violet/Purple
    default: '#E0E0E0'   // Off-White for totals
};

export const DISCIPLINE_ICONS: Record<string, string> = {
    swim: 'swim',
    bike: 'bike',         // 'bike' is usually simpler than 'bicycle'
    run: 'run-fast',      // implies motion better than static 'run'
    strength: 'dumbbell', // Cleaner icon for small sizes
    default: 'chart-bar'  // Represents "Total/Stats" well
};