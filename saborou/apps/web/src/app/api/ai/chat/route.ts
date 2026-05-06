import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getCharacterConfig } from "@/features/ai/lib/characters";
import * as aiService from "@/features/ai/server/service";
import type { CharacterType } from "@/features/ai/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { conversationId, message, characterType } = await request.json();

  if (!conversationId || !message) {
    return new Response("Missing required fields", { status: 400 });
  }

  // Save user message
  await aiService.saveMessage(supabase, conversationId, "USER", message);

  // Get conversation history
  const messages = await aiService.getConversationMessages(
    supabase,
    user.id,
    conversationId
  );

  const charConfig = getCharacterConfig(
    (characterType as CharacterType) ?? "SABOROU"
  );

  const result = streamText({
    model: openai("gpt-4o"),
    system: charConfig.systemPrompt,
    messages: messages.map((m) => ({
      role: m.role === "AI" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    })),
    onFinish: async ({ text }) => {
      // Save AI response
      await aiService.saveMessage(supabase, conversationId, "AI", text);
    },
  });

  return result.toDataStreamResponse();
}
