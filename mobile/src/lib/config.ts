// src/lib/config.ts
export const CONFIG = {
    // Reads from .env. If variable is missing, defaults to false (Safety first)
    USE_MOCKS: process.env.EXPO_PUBLIC_USE_MOCKS === 'true',

    // You can add other global toggles here later
    // LOG_LEVEL: 'debug', 
};