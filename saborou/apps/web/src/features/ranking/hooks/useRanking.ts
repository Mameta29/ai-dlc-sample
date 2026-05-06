"use client";

import { useTRPC } from "@/lib/trpc/react";
import { useQuery } from "@tanstack/react-query";

export function useGlobalRanking(weekKey?: string) {
  const trpc = useTRPC();
  return useQuery(trpc.ranking.global.queryOptions({ weekKey }));
}

export function useUserRank(weekKey?: string) {
  const trpc = useTRPC();
  return useQuery(trpc.ranking.userRank.queryOptions({ weekKey }));
}

export function useGroupRanking(groupId: string, weekKey?: string) {
  const trpc = useTRPC();
  return useQuery(trpc.ranking.group.queryOptions({ groupId, weekKey }));
}
