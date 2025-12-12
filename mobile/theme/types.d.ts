// src/theme/types.d.ts
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

// 1. Define your discipline colors structure
type DisciplineColors = {
    swim: string;
    bike: string;
    run: string;
    strength: string;
    other: string;
};

// 2. Merge it into the React Native Paper theme
declare module 'react-native-paper' {
    interface MD3Colors {
        discipline: DisciplineColors;
    }
}