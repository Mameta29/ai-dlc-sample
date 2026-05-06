"use client";

import { useTRPC } from "@/lib/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetDimensions() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.scoring.setDimensions.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.task.list.queryKey() });
      },
    })
  );
}
