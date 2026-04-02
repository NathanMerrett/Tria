import { createAdminClient, requireAuth } from "../_shared/auth.ts";


Deno.serve(async (req: Request) => {

  if (req.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1. Verify JWT and get user
  let user: User;
  try {
    const result = await requireAuth(req);
    user = result.user;
  } catch (errResponse) {
    return errResponse as Response;
  }

  try {
    // 2. TODO: Cancel subscription
    //    await cancelStripeSubscription(user.id);

    // 3. TODO: Revoke Strava token / Garmin Token
    //    await revokeStravaToken(user.id);

    // 4. Delete the auth user — cascades to public.users
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.delete_user(user.id);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("delete-account error:", err);
    return new Response(JSON.stringify({ error: "Failed to delete account" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
