import type { TypedSupabaseClient } from "@/types/database.types";
import type { Conversation, Message, ExcusePattern } from "../lib/types";
import type { z } from "zod";
import type { startConversationSchema, sendMessageSchema, switchCharacterSchema, reactToExcuseSchema } from "../lib/schemas";

export async function startConversation(
  supabase: TypedSupabaseClient,
  userId: string,
  input: z.infer<typeof startConversationSchema>
): Promise<Conversation> {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      task_id: input.taskId ?? null,
      character_type: input.characterType,
      conversation_type: input.conversationType,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    taskId: data.task_id,
    characterType: data.character_type,
    conversationType: data.conversation_type,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function saveMessage(
  supabase: TypedSupabaseClient,
  conversationId: string,
  role: "AI" | "USER",
  content: string,
  metadata?: Record<string, unknown>
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
      metadata: (metadata ?? null) as import("@/types/database.types").Json | null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    conversationId: data.conversation_id,
    role: data.role,
    content: data.content,
    metadata: data.metadata as Record<string, unknown> | undefined,
    createdAt: data.created_at,
  };
}

export async function getConversationMessages(
  supabase: TypedSupabaseClient,
  userId: string,
  conversationId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*, conversations!inner(user_id)")
    .eq("conversation_id", conversationId)
    .eq("conversations.user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((d: any) => ({
    id: d.id,
    conversationId: d.conversation_id,
    role: d.role,
    content: d.content,
    metadata: d.metadata,
    createdAt: d.created_at,
  }));
}

export async function switchCharacter(
  supabase: TypedSupabaseClient,
  userId: string,
  input: z.infer<typeof switchCharacterSchema>
): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .update({ character_type: input.characterType })
    .eq("id", input.conversationId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function saveExcusePattern(
  supabase: TypedSupabaseClient,
  conversationId: string,
  category: string,
  content: string
): Promise<ExcusePattern> {
  const { data, error } = await supabase
    .from("excuse_patterns")
    .insert({
      conversation_id: conversationId,
      category: category as any,
      content,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    conversationId: data.conversation_id,
    category: data.category,
    content: data.content,
    userReaction: data.user_reaction,
    createdAt: data.created_at,
  };
}

export async function reactToExcuse(
  supabase: TypedSupabaseClient,
  userId: string,
  input: z.infer<typeof reactToExcuseSchema>
): Promise<void> {
  const { error } = await supabase
    .from("excuse_patterns")
    .update({ user_reaction: input.reaction })
    .eq("id", input.excusePatternId);

  if (error) throw error;
}
