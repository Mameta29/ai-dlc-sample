import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import * as rankingService from "./service";

export const rankingRouter = router({
  global: protectedProcedure
    .input(z.object({
      weekKey: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      return rankingService.getGlobalRanking(ctx.supabase, input.weekKey, input.limit, input.offset);
    }),

  userRank: protectedProcedure
    .input(z.object({ weekKey: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return rankingService.getUserRank(ctx.supabase, ctx.userId, input.weekKey);
    }),

  group: protectedProcedure
    .input(z.object({
      groupId: z.string().uuid(),
      weekKey: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return rankingService.getGroupRanking(ctx.supabase, input.groupId, input.weekKey);
    }),
});
