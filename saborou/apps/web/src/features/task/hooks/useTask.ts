"use client";

import { useTRPC } from "@/lib/trpc/react";
import { useQuery } from "@tanstack/react-query";

export function useTask(id: string) {
  const trpc = useTRPC();
  return useQuery(trpc.task.get.queryOptions({ id }));
}
