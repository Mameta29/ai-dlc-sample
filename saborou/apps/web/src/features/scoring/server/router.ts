import { router, protectedProcedure } from "@/lib/trpc/server";
import { setDimensionScoresSchema, taskIdSchema, userWeekSchema } from "../lib/schemas";
import * as scoringService from "./service";

export const scoringRouter = router({
  setDimensions: protectedProcedure
    .input(setDimensionScoresSchema)
    .mutation(async ({ ctx, input }) => {
      return scoringService.setDimensionScores(ctx.supabase, ctx.userId, input);
    }),

  finalize: protectedProcedure
    .input(taskIdSchema)
    .mutation(async ({ ctx, input }) => {
      return scoringService.finalizeScore(ctx.supabase, ctx.userId, input.taskId);
    }),

  weeklyTotal: protectedProcedure
    .input(userWeekSchema)
    .query(async ({ ctx, input }) => {
      return scoringService.getWeeklyTotal(ctx.supabase, ctx.userId, input.weekKey);
    }),
});
