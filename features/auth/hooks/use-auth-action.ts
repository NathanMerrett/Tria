import { useState } from 'react';

import type { LoadingState } from '@/features/auth/lib/auth';

/**
 * Manages loading and error state for auth actions.
 * Exposes `run` for fire-and-forget auth calls, and raw setters
 * for flows that need finer control (e.g. email sign-up with field errors).
 */
export function useAuthAction() {
  const [loading, setLoading] = useState<LoadingState>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(
    provider: LoadingState,
    fn: () => Promise<void>,
    fallback = 'Authentication failed. Please try again.',
  ) {
    setLoading(provider);
    setError(null);
    try {
      await fn();
    } catch (e: unknown) {
      setError((e as any)?.message ?? fallback);
    } finally {
      setLoading(null);
    }
  }

  return { loading, setLoading, error, setError, run };
}
