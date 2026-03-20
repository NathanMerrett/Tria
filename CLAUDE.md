# Tria — Claude Instructions

## Project

Triathlon training app ("Runna for triathlons"). React Native + Expo SDK 54, expo-router, TypeScript.

## Stack

- **UI:** react-native-paper (MD3)
- **State:** Zustand + TanStack Query
- **Backend:** Supabase (auth, db) with PKCE OAuth
- **Auth:** Google + Strava via expo-web-browser — requires a native dev build, not Expo Go

## Commands

```bash
npx expo run:ios          # native build (required for auth)
npx expo start            # JS bundler only (after first build)
npx tsc --noEmit          # type check — must pass with 0 errors
supabase gen types typescript --linked > types/database.ts  # regenerate DB types
```

## Directory structure

Feature-based architecture:

```
app/                        — expo-router screens only (no logic)
  (auth)/                   — sign-in, callback
  (tabs)/                   — today, plan, settings
  _layout.tsx               — PaperProvider + QueryClient + AuthGate

features/                   — one folder per product feature
  auth/
    components/             — UI components specific to auth
    lib/                    — auth.ts (signIn, signOut, OAuth helpers)
    store/                  — auth-store.ts (Zustand)

shared/                     — cross-feature utilities, no feature-specific logic
  components/               — generic UI (HapticTab, ThemedText, etc.)
  constants/                — theme, colors
  hooks/                    — useColorScheme, useThemeColor
  lib/                      — supabase.ts, query-client.ts

supabase/                   — Supabase CLI only (config.toml, migrations)
types/                      — database.ts (generated), training.ts, user.ts
```

New features go in `features/<name>/` with `components/`, `lib/`, `store/` subfolders as needed. Only put things in `shared/` if they are genuinely used by 2+ features.

## Key conventions

- `session?.user` — never store `user` separately from `session` in Zustand
- Auth navigation is owned entirely by `AuthGate` in `app/_layout.tsx` via `onAuthStateChange` — don't add redirect logic elsewhere
- `supabase/migrations/` owns the schema — do not write ad-hoc SQL files

## What to run after changes

- JS-only changes: press `r` in the Expo terminal
- New native dependencies: `npx expo run:ios`
- Schema changes: regenerate types with the command above
