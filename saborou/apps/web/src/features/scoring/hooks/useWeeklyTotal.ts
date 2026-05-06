"use client";

import { useTRPC } from "@/lib/trpc/react";
import { useQuery } from "@tanstack/react-query";

export function useWeeklyTotal(weekKey?: string) {
  const trpc = useTRPC();
  return useQuery(trpc.scoring.weeklyTotal.queryOptions({ weekKey }));
}
