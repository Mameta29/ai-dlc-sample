import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: "EXPIRED" as const,
      expired_at: now,
    })
    .eq("status", "PROCRASTINATING")
    .not("deadline", "is", null)
    .lt("deadline", now)
    .select("id");

  if (error) {
    console.error(
      JSON.stringify({
        timestamp: now,
        level: "error",
        event: "task.expiration.failure",
        metadata: { error: error.message },
      })
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const expiredCount = data?.length ?? 0;

  if (expiredCount > 0) {
    console.log(
      JSON.stringify({
        timestamp: now,
        level: "info",
        event: "task.expiration.batch",
        metadata: { expiredCount },
      })
    );
  }

  return NextResponse.json({ expired: expiredCount });
}
