import { z } from "zod";

const dimensionField = z.number().int().min(1).max(5);

export const setDimensionScoresSchema = z.object({
  taskId: z.string().uuid(),
  stakeholders: dimensionField,
  financialImpact: dimensionField,
  urgency: dimensionField,
  difficulty: dimensionField,
  uncertainty: dimensionField,
  reputationImpact: dimensionField,
  source: z.enum(["AI_ESTIMATED", "USER_PROVIDED", "MANUALLY_ADJUSTED"]).default("USER_PROVIDED"),
});

export const taskIdSchema = z.object({
  taskId: z.string().uuid(),
});

export const userWeekSchema = z.object({
  weekKey: z.string().optional(),
});

export type SetDimensionScoresInput = z.infer<typeof setDimensionScoresSchema>;
