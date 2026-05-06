import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "タスクタイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください")
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, "空白のみのタイトルは使用できません"),
  deadline: z
    .string()
    .datetime()
    .nullable()
    .refine(
      (v) => !v || new Date(v) > new Date(),
      "締切は未来の日時を指定してください"
    ),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(1)
    .max(200)
    .transform((v) => v.trim())
    .refine((v) => v.length > 0)
    .optional(),
  deadline: z
    .string()
    .datetime()
    .nullable()
    .refine((v) => !v || new Date(v) > new Date())
    .optional(),
});

export const taskListSchema = z.object({
  status: z.enum(["PROCRASTINATING", "COMPLETED", "EXPIRED", "all"]).default("all"),
  sortBy: z.enum(["created", "deadline", "score"]).default("created"),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).default(20),
});

export const taskIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskListInput = z.infer<typeof taskListSchema>;
