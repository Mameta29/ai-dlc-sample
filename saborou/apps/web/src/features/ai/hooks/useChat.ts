"use client";

import { useChat as useAIChat } from "@ai-sdk/react";
import type { CharacterType } from "../lib/types";

export function useChat(conversationId: string, characterType: CharacterType) {
  return useAIChat({
    api: "/api/ai/chat",
    body: { conversationId, characterType },
  });
}
