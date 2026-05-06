import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { getWeekKey } from "@/features/scoring/lib/calculator";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get previous week key
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const weekKey = getWeekKey(lastWeek);

  // Aggregate finalized scores for the week
  const { data: scores, error } = await supabase
    .from("finalized_scores")
    .select("user_id, procrastination_score")
    .eq("week_key", weekKey);

  if (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      event: "scoring.weekly_aggregate.failure",
      metadata: { error: error.message, weekKey },
    }));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by user
  const userScores = new Map<string, { total: number; count: number }>();
  for (const score of scores ?? []) {
    const existing = userScores.get(score.user_id) ?? { total: 0, count: 0 };
    existing.total += Number(score.procrastination_score);
    existing.count += 1;
    userScores.set(score.user_id, existing);
  }

  // Upsert aggregates
  let updated = 0;
  for (const [userId, { total, count }] of userScores) {
    await supabase
      .from("weekly_aggregates")
      .upsert(
        {
          user_id: userId,
          week_key: weekKey,
          total_score: total,
          task_count: count,
        },
        { onConflict: "user_id,week_key" }
      );
    updated++;
  }

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "info",
    event: "scoring.weekly_aggregate.complete",
    metadata: { weekKey, usersProcessed: updated },
  }));

  return NextResponse.json({ weekKey, usersProcessed: updated });
}
