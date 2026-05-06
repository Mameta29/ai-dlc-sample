import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";

export const notificationRouter = router({
  subscribe: protectedProcedure
    .input(z.object({
      endpoint: z.string().url(),
      keys: z.object({
        p256dh: z.string(),
        auth: z.string(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("push_subscriptions")
        .upsert({
          user_id: ctx.userId,
          endpoint: input.endpoint,
          keys: input.keys,
        }, { onConflict: "endpoint" });
    }),

  unsubscribe: protectedProcedure
    .input(z.object({ endpoint: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("push_subscriptions")
        .delete()
        .eq("user_id", ctx.userId)
        .eq("endpoint", input.endpoint);
    }),
});
