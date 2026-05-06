"use client";

import { useTRPC } from "@/lib/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useStartConversation() {
  const trpc = useTRPC();
  return useMutation(trpc.ai.startConversation.mutationOptions());
}

export function useConversationMessages(conversationId: string) {
  const trpc = useTRPC();
  return useQuery(trpc.ai.getMessages.queryOptions({ conversationId }));
}

export function useSwitchCharacter() {
  const trpc = useTRPC();
  return useMutation(trpc.ai.switchCharacter.mutationOptions());
}

export function useReactToExcuse() {
  const trpc = useTRPC();
  return useMutation(trpc.ai.reactToExcuse.mutationOptions());
}
