# Tria

A triathlon training app — Runna, but for triathlons.

## Prerequisites

- **Node.js 18+**
- **Xcode** — install from the Mac App Store (required for iOS builds)
- **Xcode Command Line Tools** — run `xcode-select --install` after installing Xcode
- **CocoaPods** — run `brew install cocoapods` (required for native dependencies)
- A Supabase project with the schema applied

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Set up the database**

   Run the migrations against your Supabase project:

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

## Running the app

### iOS development build (required for Google Sign-In)

Google OAuth uses the `tria://` custom URL scheme for the redirect, which only works in a native build — not Expo Go.

```bash
npx expo run:ios
```

This installs a development build directly on your device or simulator. Re-run this command whenever native dependencies change.

### Start the JS bundler (after initial build)

Once the native build is installed, you only need to restart the bundler for JS changes:

```bash
npx expo start
```

Then press `i` to open in the iOS simulator, or scan the QR code to open on your device.

> **Note:** Expo Go does not support Google Sign-In. Always use the development build.

## Supabase

### Regenerate TypeScript types

After any schema changes, regenerate `types/database.ts`:

```bash
supabase gen types typescript --linked > types/database.ts
```

### Migrations

```bash
supabase migration new <migration-name>   # create a new migration
supabase db push                          # push migrations to remote
supabase db pull                          # pull remote schema changes
```

## Tech stack

- **Framework:** React Native + Expo (SDK 54) with expo-router
- **UI:** react-native-paper (Material Design 3)
- **State:** Zustand + TanStack Query
- **Backend:** Supabase (auth, database, storage)
- **Auth:** Google OAuth via PKCE + expo-web-browser
