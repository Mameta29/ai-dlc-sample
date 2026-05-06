import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function GET(request: NextRequest) {
  // Verify Cron Secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role client for admin operations
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  // Find expired PENDING deletion requests
  const { data: pendingRequests, error: fetchError } = await supabase
    .from("account_deletion_requests")
    .select("id, user_id")
    .eq("status", "PENDING")
    .lt("scheduled_deletion_at", now);

  if (fetchError) {
    console.error(
      JSON.stringify({
        timestamp: now,
        level: "error",
        event: "auth.deletion.failure",
        metadata: { error: fetchError.message, phase: "fetch" },
      })
    );
    return NextResponse.json(
      { error: "Failed to fetch pending requests" },
      { status: 500 }
    );
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;
  let failed = 0;

  for (const request of pendingRequests) {
    try {
      // Anonymize user data
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          display_name: "削除済みユーザー",
          avatar_url: null,
          status: "DELETED" as const,
        })
        .eq("id", request.user_id);

      if (userUpdateError) throw userUpdateError;

      // Mark deletion request as completed
      const { error: requestUpdateError } = await supabase
        .from("account_deletion_requests")
        .update({ status: "COMPLETED" as const })
        .eq("id", request.id);

      if (requestUpdateError) throw requestUpdateError;

      // Invalidate all sessions via admin API
      await supabase.auth.admin.signOut(request.user_id);

      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "info",
          event: "auth.deletion.execute",
          userId: request.user_id,
        })
      );

      processed++;
    } catch (error) {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          event: "auth.deletion.failure",
          userId: request.user_id,
          metadata: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        })
      );
      failed++;
    }
  }

  return NextResponse.json({ processed, failed, total: pendingRequests.length });
}
