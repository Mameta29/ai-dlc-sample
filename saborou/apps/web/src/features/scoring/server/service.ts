import type { TypedSupabaseClient } from "@/types/database.types";
import { calculateTaskScore, calculateProcrastinationScore, getWeekKey } from "../lib/calculator";
import { calcElapsedPercentage } from "@/features/task/lib/calculator";
import type { SetDimensionScoresInput } from "../lib/schemas";
import type { FinalizedScore } from "../lib/types";

export async function setDimensionScores(
  supabase: TypedSupabaseClient,
  userId: string,
  input: SetDimensionScoresInput
) {
  // Verify task ownership
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id, user_id")
    .eq("id", input.taskId)
    .eq("user_id", userId)
    .single();

  if (taskError || !task) throw taskError ?? new Error("Task not found");

  // Upsert dimension scores
  const { data, error } = await supabase
    .from("dimension_scores")
    .upsert(
      {
        task_id: input.taskId,
        stakeholders: input.stakeholders,
        financial_impact: input.financialImpact,
        urgency: input.urgency,
        difficulty: input.difficulty,
        uncertainty: input.uncertainty,
        reputation_impact: input.reputationImpact,
        source: input.source,
      },
      { onConflict: "task_id" }
    )
    .select()
    .single();

  if (error) throw error;

  // Calculate and update task_score
  const taskScore = calculateTaskScore({
    stakeholders: input.stakeholders,
    financialImpact: input.financialImpact,
    urgency: input.urgency,
    difficulty: input.difficulty,
    uncertainty: input.uncertainty,
    reputationImpact: input.reputationImpact,
  });

  await supabase
    .from("tasks")
    .update({ task_score: taskScore })
    .eq("id", input.taskId);

  return { dimensionScores: data, taskScore };
}

export async function finalizeScore(
  supabase: TypedSupabaseClient,
  userId: string,
  taskId: string
): Promise<FinalizedScore> {
  // Check if already finalized
  const { data: existing } = await supabase
    .from("finalized_scores")
    .select("id")
    .eq("task_id", taskId)
    .single();

  if (existing) throw new Error("Score already finalized");

  // Get task data
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", userId)
    .single();

  if (taskError || !task) throw taskError ?? new Error("Task not found");

  const taskScore = task.task_score ? Number(task.task_score) : 0;
  const elapsedPct = calcElapsedPercentage(
    new Date(task.started_at),
    task.deadline ? new Date(task.deadline) : null,
    task.status,
    task.completed_at ? new Date(task.completed_at) : null
  );

  const procrastinationScore = calculateProcrastinationScore(taskScore, elapsedPct);
  const now = new Date();
  const weekKey = getWeekKey(now);

  // Create finalized score
  const { data: finalized, error: finalizeError } = await supabase
    .from("finalized_scores")
    .insert({
      task_id: taskId,
      user_id: userId,
      task_score: taskScore,
      elapsed_percentage: elapsedPct,
      procrastination_score: procrastinationScore,
      week_key: weekKey,
    })
    .select()
    .single();

  if (finalizeError) throw finalizeError;

  // Update task's procrastination_score
  await supabase
    .from("tasks")
    .update({ procrastination_score: procrastinationScore })
    .eq("id", taskId);

  // Upsert weekly aggregate
  const { data: existingAgg } = await supabase
    .from("weekly_aggregates")
    .select("*")
    .eq("user_id", userId)
    .eq("week_key", weekKey)
    .single();

  if (existingAgg) {
    await supabase
      .from("weekly_aggregates")
      .update({
        total_score: Number(existingAgg.total_score) + procrastinationScore,
        task_count: existingAgg.task_count + 1,
      })
      .eq("id", existingAgg.id);
  } else {
    await supabase.from("weekly_aggregates").insert({
      user_id: userId,
      week_key: weekKey,
      total_score: procrastinationScore,
      task_count: 1,
    });
  }

  return {
    id: finalized.id,
    taskId: finalized.task_id,
    userId: finalized.user_id,
    taskScore: Number(finalized.task_score),
    elapsedPercentage: Number(finalized.elapsed_percentage),
    procrastinationScore: Number(finalized.procrastination_score),
    finalizedAt: finalized.finalized_at,
    weekKey: finalized.week_key,
  };
}

export async function getWeeklyTotal(
  supabase: TypedSupabaseClient,
  userId: string,
  weekKey?: string
): Promise<{ totalScore: number; taskCount: number }> {
  const key = weekKey ?? getWeekKey();

  const { data } = await supabase
    .from("weekly_aggregates")
    .select("total_score, task_count")
    .eq("user_id", userId)
    .eq("week_key", key)
    .single();

  return {
    totalScore: data ? Number(data.total_score) : 0,
    taskCount: data?.task_count ?? 0,
  };
}
