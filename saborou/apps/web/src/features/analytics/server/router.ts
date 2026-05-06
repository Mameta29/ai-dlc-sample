import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import * as analyticsService from "./service";

const eventTypeEnum = z.enum([
  "ACCEPTANCE_PATTERN", "SUBJECTIVE_WEIGHT", "STAKEHOLDER_HIERARCHY",
  "SELF_IDENTITY", "IGNITION_THRESHOLD", "LINGUISTIC_TRIGGER",
  "BIORHYTHM", "SELF_GENERATED_EXCUSE",
]);

export const analyticsRouter = router({
  track: protectedProcedure
    .input(z.object({
      eventType: eventTypeEnum,
      payload: z.record(z.unknown()),
      taskId: z.string().uuid().optional(),
      conversationId: z.string().uuid().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return analyticsService.trackEvent(
        ctx.supabase, ctx.userId, input.eventType,
        input.payload, input.taskId, input.conversationId
      );
    }),

  getByType: protectedProcedure
    .input(z.object({
      eventType: eventTypeEnum,
      limit: z.number().int().min(1).max(500).default(100),
    }))
    .query(async ({ ctx, input }) => {
      return analyticsService.getEventsByType(ctx.supabase, ctx.userId, input.eventType, input.limit);
    }),

  profileAnalysis: protectedProcedure
    .query(async ({ ctx }) => {
      return analyticsService.getProfileAnalysis(ctx.supabase, ctx.userId);
    }),
});
