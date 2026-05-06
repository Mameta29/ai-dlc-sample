"use client";

import { useTRPC } from "@/lib/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AnalyticsEventType } from "../lib/types";

export function useTrackEvent() {
  const trpc = useTRPC();
  return useMutation(trpc.analytics.track.mutationOptions());
}

export function useEventsByType(eventType: AnalyticsEventType) {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getByType.queryOptions({ eventType }));
}

export function useProfileAnalysis() {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.profileAnalysis.queryOptions());
}
