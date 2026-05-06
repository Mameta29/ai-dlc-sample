"use client";

import { useTRPC } from "@/lib/trpc/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { TaskFilterStatus, TaskSortBy } from "../lib/types";

export function useTaskList(status: TaskFilterStatus, sortBy: TaskSortBy) {
  const trpc = useTRPC();

  return useInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(
      { status, sortBy },
      { getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined }
    )
  );
}
