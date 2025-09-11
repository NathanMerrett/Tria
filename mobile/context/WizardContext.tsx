// context/WizardContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define all possible types for your wizard
export type DistanceType = 'Sprint' | 'Olympic' | 'Half Ironman' | 'Full Ironman';
export type WeekdaysType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type AbilityRatingType = 1 | 2 | 3 | 4 | 5;
// AM/PM availability
export type DaySlot = 'am' | 'pm';
export type SlotAvailability = {
  selected: boolean;
  longOK: boolean;
};
export type DayAvailability = Record<DaySlot, SlotAvailability>;
export type WeeklyAvailability = Record<WeekdaysType, DayAvailability>;



// Type for the entire state of your wizard
type WizardState = {
  distance?: DistanceType;
  startDate?: Date;
  planWeeks?: number;
  raceDate?: Date;

  // Availability (replaces workoutDays + hoursPerDay)
  availability: WeeklyAvailability;

  // Abilities / metrics
  swimAbility?: AbilityRatingType;
  bikeAbility?: AbilityRatingType;
  runAbility?: AbilityRatingType;
  swimCSS?: number;
  bikeFTP?: number;
  runThreshold?: number;
  swimDistance?: number;
  bikeDistance?: number;
  runDistance?: number;
  
  // Gear
  hasHRMonitor?: boolean;
  hasPowerMeter?: boolean;
};

// Define all possible actions that can modify the state
type WizardAction =
  // Plan
  | { type: 'SET_DISTANCE'; payload: DistanceType }
  | { type: 'SET_PLAN_WEEKS'; payload: number }
  | { type: 'SET_START_DATE'; payload: Date }
  | { type: 'SET_RACE_DATE'; payload: Date }

  // Availability (AM/PM)
  | { type: 'SET_SLOT_SELECTED'; payload: { day: WeekdaysType; slot: DaySlot; selected: boolean } }
  | { type: 'SET_SLOT_LONG_OK'; payload: { day: WeekdaysType; slot: DaySlot; longOK: boolean } }

  // Abilities / metrics
  | { type: 'SET_SWIM_ABILITY'; payload: AbilityRatingType }
  | { type: 'SET_BIKE_ABILITY'; payload: AbilityRatingType }
  | { type: 'SET_RUN_ABILITY'; payload: AbilityRatingType }
  | { type: 'SET_SWIM_CSS'; payload: number }
  | { type: 'SET_BIKE_FTP'; payload: number }
  | { type: 'SET_RUN_PACE'; payload: number }
  | { type: 'SET_SWIM_DISTANCE'; payload: number }
  | { type: 'SET_BIKE_DISTANCE'; payload: number }
  | { type: 'SET_RUN_DISTANCE'; payload: number }

  // Gear
  | { type: 'SET_HAS_HR_MONITOR'; payload: boolean }
  | { type: 'SET_HAS_POWER_METER'; payload: boolean }

  | { type: 'RESET' };

const emptyDay = (): DayAvailability => ({
  am: { selected: false, longOK: false },
  pm: { selected: false, longOK: false },
});

const makeWeek = (): WeeklyAvailability => ({
  Monday: emptyDay(),
  Tuesday: emptyDay(),
  Wednesday: emptyDay(),
  Thursday: emptyDay(),
  Friday: emptyDay(),
  Saturday: emptyDay(),
  Sunday: emptyDay(),
});

// Initial state for the wizard
const initialState: WizardState = {
  availability: makeWeek(),
};

// Reducer function to handle state transitions based on actions
function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {

    // Plan
    case 'SET_DISTANCE':
      return { ...state, distance: action.payload };
    case 'SET_PLAN_WEEKS':
      return { ...state, planWeeks: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_RACE_DATE':
      return { ...state, raceDate: action.payload };

    // Availability
    case 'SET_SLOT_SELECTED': {
      const { day, slot, selected } = action.payload;
      const dayAvail = state.availability[day];
      const current = dayAvail[slot];

      // If unselecting, also clear longOK to keep state clean.
      const nextSlot: SlotAvailability = selected
        ? { ...current, selected: true }
        : { selected: false, longOK: false };

      return {
        ...state,
        availability: {
          ...state.availability,
          [day]: { ...dayAvail, [slot]: nextSlot },
        },
      };
    }
    case 'SET_SLOT_LONG_OK': {
      const { day, slot, longOK } = action.payload;
      const dayAvail = state.availability[day];
      const current = dayAvail[slot];
      if (!current.selected) return state; // ignore: long only makes sense if selected
      return {
        ...state,
        availability: {
          ...state.availability,
          [day]: { ...dayAvail, [slot]: { ...current, longOK } },
        },
      };
    }
    case 'SET_SWIM_ABILITY':
      return { ...state, swimAbility: action.payload };
    case 'SET_BIKE_ABILITY':
      return { ...state, bikeAbility: action.payload };
    case 'SET_RUN_ABILITY':
      return { ...state, runAbility: action.payload };
    case 'SET_SWIM_CSS':
      return { ...state, swimCSS: action.payload };
    case 'SET_BIKE_FTP':
      return { ...state, bikeFTP: action.payload };
    case 'SET_RUN_PACE':
      return { ...state, runThreshold: action.payload };
    case 'SET_SWIM_DISTANCE':
      return { ...state, swimDistance: action.payload };
    case 'SET_BIKE_DISTANCE':
      return { ...state, bikeDistance: action.payload };
    case 'SET_RUN_DISTANCE':
      return { ...state, runDistance: action.payload };

    case 'SET_HAS_HR_MONITOR':
      return { ...state, hasHRMonitor: action.payload };
    case 'SET_HAS_POWER_METER':
      return { ...state, hasPowerMeter: action.payload };
    case 'RESET':
      return initialState;
    default:
      // Ensure all action types are handled, or provide a fallback
      // If you add a new action, TypeScript will remind you to add it here.
      return state;
  }
}

// Create contexts for state and dispatch
const WizardStateCtx = createContext<WizardState | undefined>(undefined);
const WizardDispatchCtx = createContext<React.Dispatch<WizardAction> | undefined>(undefined);

// Provider component that wraps your application
export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WizardStateCtx.Provider value={state}>
      <WizardDispatchCtx.Provider value={dispatch}>{children}</WizardDispatchCtx.Provider>
    </WizardStateCtx.Provider>
  );
}

// Custom hooks for easily accessing state and dispatch
export function useWizardState() {
  const ctx = useContext(WizardStateCtx);
  if (!ctx) throw new Error('useWizardState must be used within WizardProvider');
  return ctx;
}

export function useWizardDispatch() {
  const ctx = useContext(WizardDispatchCtx);
  if (!ctx) throw new Error('useWizardDispatch must be used within WizardProvider');
  return ctx;
}