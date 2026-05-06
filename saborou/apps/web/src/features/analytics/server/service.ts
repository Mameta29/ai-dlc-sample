import type { TypedSupabaseClient } from "@/types/database.types";
import type { AnalyticsEvent, AnalyticsEventType, UserProfileAnalysis } from "../lib/types";

export async function trackEvent(
  supabase: TypedSupabaseClient,
  userId: string,
  eventType: AnalyticsEventType,
  payload: Record<string, unknown>,
  taskId?: string,
  conversationId?: string
): Promise<AnalyticsEvent> {
  const { data, error } = await supabase
    .from("analytics_events")
    .insert({
      user_id: userId,
      event_type: eventType,
      payload: payload as import("@/types/database.types").Json,
      task_id: taskId ?? null,
      conversation_id: conversationId ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    eventType: data.event_type,
    payload: data.payload as Record<string, unknown>,
    taskId: data.task_id,
    conversationId: data.conversation_id,
    createdAt: data.created_at,
  };
}

export async function getEventsByType(
  supabase: TypedSupabaseClient,
  userId: string,
  eventType: AnalyticsEventType,
  limit = 100
): Promise<AnalyticsEvent[]> {
  const { data, error } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("user_id", userId)
    .eq("event_type", eventType)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((d) => ({
    id: d.id,
    userId: d.user_id,
    eventType: d.event_type,
    payload: d.payload as Record<string, unknown>,
    taskId: d.task_id,
    conversationId: d.conversation_id,
    createdAt: d.created_at,
  }));
}

export async function getProfileAnalysis(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<UserProfileAnalysis | null> {
  const { data, error } = await supabase
    .from("user_profiles_analysis")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    acceptancePattern: data.acceptance_pattern as Record<string, unknown> | null,
    subjectiveWeightProfile: data.subjective_weight_profile as Record<string, unknown> | null,
    stakeholderHierarchy: data.stakeholder_hierarchy as Record<string, unknown> | null,
    selfIdentity: data.self_identity as Record<string, unknown> | null,
    ignitionThreshold: data.ignition_threshold as Record<string, unknown> | null,
    linguisticTriggers: data.linguistic_triggers as Record<string, unknown> | null,
    biorhythmPattern: data.biorhythm_pattern as Record<string, unknown> | null,
    generatedAt: data.generated_at,
  };
}
