import { router, protectedProcedure } from "@/lib/trpc/server";
import {
  startConversationSchema,
  switchCharacterSchema,
  reactToExcuseSchema,
  conversationIdSchema,
} from "../lib/schemas";
import * as aiService from "./service";

export const aiRouter = router({
  startConversation: protectedProcedure
    .input(startConversationSchema)
    .mutation(async ({ ctx, input }) => {
      return aiService.startConversation(ctx.supabase, ctx.userId, input);
    }),

  getMessages: protectedProcedure
    .input(conversationIdSchema)
    .query(async ({ ctx, input }) => {
      return aiService.getConversationMessages(
        ctx.supabase,
        ctx.userId,
        input.conversationId
      );
    }),

  switchCharacter: protectedProcedure
    .input(switchCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      return aiService.switchCharacter(ctx.supabase, ctx.userId, input);
    }),

  reactToExcuse: protectedProcedure
    .input(reactToExcuseSchema)
    .mutation(async ({ ctx, input }) => {
      return aiService.reactToExcuse(ctx.supabase, ctx.userId, input);
    }),
});
