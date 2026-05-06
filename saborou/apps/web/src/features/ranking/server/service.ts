import type { TypedSupabaseClient } from "@/types/database.types";
import { getWeekKey } from "@/features/scoring/lib/calculator";
import type { RankEntry, RankPosition } from "../lib/types";

export async function getGlobalRanking(
  supabase: TypedSupabaseClient,
  weekKey?: string,
  limit = 50,
  offset = 0
): Promise<RankEntry[]> {
  const key = weekKey ?? getWeekKey();

  const { data, error } = await supabase
    .from("global_ranking" as any)
    .select("*")
    .eq("week_key", key)
    .order("rank_position", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return (data ?? []).map((d: any) => ({
    userId: d.user_id,
    displayName: d.display_name,
    avatarUrl: d.avatar_url,
    totalScore: Number(d.total_score),
    taskCount: d.task_count,
    weekKey: d.week_key,
    rankPosition: Number(d.rank_position),
  }));
}

export async function getUserRank(
  supabase: TypedSupabaseClient,
  userId: string,
  weekKey?: string
): Promise<RankPosition> {
  const key = weekKey ?? getWeekKey();

  const { data, error } = await supabase
    .from("global_ranking" as any)
    .select("rank_position, total_score")
    .eq("week_key", key)
    .eq("user_id", userId)
    .single();

  const { count } = await supabase
    .from("weekly_aggregates")
    .select("*", { count: "exact", head: true })
    .eq("week_key", key);

  if (error || !data) {
    return { rank: 0, totalScore: 0, totalUsers: count ?? 0 };
  }

  const rankData = data as unknown as { rank_position: number; total_score: number };
  return {
    rank: Number(rankData.rank_position),
    totalScore: Number(rankData.total_score),
    totalUsers: count ?? 0,
  };
}

export async function getGroupRanking(
  supabase: TypedSupabaseClient,
  groupId: string,
  weekKey?: string
): Promise<RankEntry[]> {
  const key = weekKey ?? getWeekKey();

  // Get group members
  const { data: members } = await supabase
    .from("group_members" as any)
    .select("user_id")
    .eq("group_id", groupId);

  if (!members || members.length === 0) return [];

  const memberIds = members.map((m: any) => m.user_id);

  const { data, error } = await supabase
    .from("global_ranking" as any)
    .select("*")
    .eq("week_key", key)
    .in("user_id", memberIds)
    .order("rank_position", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((d: any, index: number) => ({
    userId: d.user_id,
    displayName: d.display_name,
    avatarUrl: d.avatar_url,
    totalScore: Number(d.total_score),
    taskCount: d.task_count,
    weekKey: d.week_key,
    rankPosition: index + 1, // Re-rank within group
  }));
}
