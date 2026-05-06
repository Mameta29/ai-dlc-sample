import { z } from "zod";

export const startConversationSchema = z.object({
  taskId: z.string().uuid().optional(),
  characterType: z.enum(["SABOROU", "NAMAKEMONO_SENPAI", "SABORIST"]),
  conversationType: z.enum(["TASK_QUANTIFY", "EXCUSE_GENERATION", "PROVOCATION", "OPEN_QUESTION"]),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

export const switchCharacterSchema = z.object({
  conversationId: z.string().uuid(),
  characterType: z.enum(["SABOROU", "NAMAKEMONO_SENPAI", "SABORIST"]),
});

export const reactToExcuseSchema = z.object({
  excusePatternId: z.string().uuid(),
  reaction: z.enum(["AGREE", "DISAGREE", "SKIP"]),
});

export const conversationIdSchema = z.object({
  conversationId: z.string().uuid(),
});
