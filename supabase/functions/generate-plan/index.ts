

Deno.serve(async (req: Request) => {

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1. Verify JWT and get user
  // let user: User;
  // try {
  //   const result = await requireAuth(req);
  //   user = result.user;
  // } catch (errResponse) {
  //   return errResponse as Response;
  // }

  try {
    // 2. TODO: Cancel subscription
    console.log("generate-plan for user:")

    // 3. TODO: Revoke Strava token / Garmin Token
    //    await revokeStravaToken(user.id);

    // 4. Delete the auth user — cascades to public.users


    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-plan error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate plan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
