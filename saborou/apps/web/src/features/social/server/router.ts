import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";

export const socialRouter = router({
  follow: protectedProcedure
    .input(z.object({ targetUserId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("follows")
        .insert({ follower_id: ctx.userId, following_id: input.targetUserId });
      if (error) throw error;
    }),

  unfollow: protectedProcedure
    .input(z.object({ targetUserId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("follows")
        .delete()
        .eq("follower_id", ctx.userId)
        .eq("following_id", input.targetUserId);
    }),

  followers: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data } = await ctx.supabase
        .from("follows")
        .select("follower_id, users!follows_follower_id_fkey(id, display_name, avatar_url)")
        .eq("following_id", input.userId);
      return data ?? [];
    }),

  following: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data } = await ctx.supabase
        .from("follows")
        .select("following_id, users!follows_following_id_fkey(id, display_name, avatar_url)")
        .eq("follower_id", input.userId);
      return data ?? [];
    }),

  createGroup: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(50), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { data: group, error } = await ctx.supabase
        .from("groups")
        .insert({ name: input.name, description: input.description ?? null, owner_id: ctx.userId })
        .select()
        .single();
      if (error) throw error;
      // Auto-join owner
      await ctx.supabase
        .from("group_members")
        .insert({ group_id: group.id, user_id: ctx.userId });
      return group;
    }),

  joinGroup: protectedProcedure
    .input(z.object({ inviteCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data: group } = await ctx.supabase
        .from("groups")
        .select("id")
        .eq("invite_code", input.inviteCode)
        .single();
      if (!group) throw new Error("Invalid invite code");
      await ctx.supabase
        .from("group_members")
        .insert({ group_id: group.id, user_id: ctx.userId });
      return group;
    }),

  leaveGroup: protectedProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("group_members")
        .delete()
        .eq("group_id", input.groupId)
        .eq("user_id", ctx.userId);
    }),

  react: protectedProcedure
    .input(z.object({
      targetType: z.enum(["task_completion", "feed_item"]),
      targetId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("reactions")
        .upsert({
          user_id: ctx.userId,
          target_type: input.targetType,
          target_id: input.targetId,
        }, { onConflict: "user_id,target_type,target_id" });
    }),

  searchUsers: protectedProcedure
    .input(z.object({ query: z.string().min(1).max(50) }))
    .query(async ({ ctx, input }) => {
      const { data } = await ctx.supabase
        .from("users")
        .select("id, display_name, avatar_url")
        .ilike("display_name", `%${input.query}%`)
        .neq("id", ctx.userId)
        .eq("status", "ACTIVE")
        .limit(20);
      return data ?? [];
    }),

  feed: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20), cursor: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from("feed_items")
        .select("*")
        .eq("user_id", ctx.userId)
        .order("created_at", { ascending: false })
        .limit(input.limit + 1);

      if (input.cursor) {
        query = query.lt("created_at", input.cursor);
      }

      const { data } = await query;
      const items = data ?? [];
      const hasMore = items.length > input.limit;
      return {
        items: items.slice(0, input.limit),
        nextCursor: hasMore ? items[input.limit - 1]?.created_at : null,
      };
    }),
});
