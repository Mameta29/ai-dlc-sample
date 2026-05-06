import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.supabase
      .from("users")
      .select("*")
      .eq("id", ctx.userId)
      .single();
    return data;
  }),

  update: protectedProcedure
    .input(z.object({
      displayName: z.string().min(2).max(20).optional(),
      avatarUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: { display_name?: string; avatar_url?: string } = {};
      if (input.displayName !== undefined) updates.display_name = input.displayName;
      if (input.avatarUrl !== undefined) updates.avatar_url = input.avatarUrl;

      const { data, error } = await ctx.supabase
        .from("users")
        .update(updates)
        .eq("id", ctx.userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }),

  getNotificationSettings: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.supabase
      .from("notification_settings" as any)
      .select("*")
      .eq("user_id", ctx.userId)
      .single();
    return data;
  }),

  updateNotificationSettings: protectedProcedure
    .input(z.object({
      pushEnabled: z.boolean().optional(),
      reminderFrequency: z.enum(["hourly", "daily", "weekly", "off"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("notification_settings" as any)
        .upsert({
          user_id: ctx.userId,
          push_enabled: input.pushEnabled,
          reminder_frequency: input.reminderFrequency,
        }, { onConflict: "user_id" });
    }),

  getPrivacySettings: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.supabase
      .from("privacy_settings" as any)
      .select("*")
      .eq("user_id", ctx.userId)
      .single();
    return data;
  }),

  updatePrivacySettings: protectedProcedure
    .input(z.object({
      profileVisible: z.boolean().optional(),
      rankingVisible: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("privacy_settings" as any)
        .upsert({
          user_id: ctx.userId,
          profile_visible: input.profileVisible,
          ranking_visible: input.rankingVisible,
        }, { onConflict: "user_id" });
    }),

  exportData: protectedProcedure.mutation(async ({ ctx }) => {
    // Gather all user data for export
    const [tasks, scores, conversations, analytics] = await Promise.all([
      ctx.supabase.from("tasks").select("*").eq("user_id", ctx.userId),
      ctx.supabase.from("finalized_scores").select("*").eq("user_id", ctx.userId),
      ctx.supabase.from("conversations").select("*, messages(*)").eq("user_id", ctx.userId),
      ctx.supabase.from("analytics_events").select("*").eq("user_id", ctx.userId),
    ]);

    return {
      tasks: tasks.data ?? [],
      scores: scores.data ?? [],
      conversations: conversations.data ?? [],
      analytics: analytics.data ?? [],
      exportedAt: new Date().toISOString(),
    };
  }),
});
