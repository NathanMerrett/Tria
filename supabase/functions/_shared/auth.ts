import { createClient } from 'npm:@supabase/supabase-js@2';

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns the authenticated Supabase client scoped to that user,
 * or throws a Response with the appropriate error status.
 *
 * Usage:
 *   const { supabase, user } = await requireAuth(req);
 */
export async function requireAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const jwt = authHeader.replace("Bearer ", "");

  // Creating a user scoped client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return { supabase, user };
}

/**
 * Creates a Supabase admin client using the service role key.
 * Only use this AFTER you've already verified the user via requireAuth().
 * Never expose this client or its key to the client side.
 */
export function createAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
