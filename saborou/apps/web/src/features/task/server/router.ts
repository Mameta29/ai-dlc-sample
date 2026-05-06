import { router, protectedProcedure } from "@/lib/trpc/server";
import {
  createTaskSchema,
  updateTaskSchema,
  taskListSchema,
  taskIdSchema,
} from "../lib/schemas";
import * as taskService from "./service";

export const taskRouter = router({
  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return taskService.createTask(ctx.supabase, ctx.userId, input);
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return taskService.updateTask(ctx.supabase, ctx.userId, input);
    }),

  delete: protectedProcedure
    .input(taskIdSchema)
    .mutation(async ({ ctx, input }) => {
      return taskService.deleteTask(ctx.supabase, ctx.userId, input.id);
    }),

  complete: protectedProcedure
    .input(taskIdSchema)
    .mutation(async ({ ctx, input }) => {
      return taskService.completeTask(ctx.supabase, ctx.userId, input.id);
    }),

  list: protectedProcedure
    .input(taskListSchema)
    .query(async ({ ctx, input }) => {
      return taskService.listTasks(ctx.supabase, ctx.userId, input);
    }),

  get: protectedProcedure
    .input(taskIdSchema)
    .query(async ({ ctx, input }) => {
      return taskService.getTask(ctx.supabase, ctx.userId, input.id);
    }),
});
