import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema, taskListSchema } from "../../lib/schemas";

describe("Task Schemas Validation", () => {
  describe("createTaskSchema", () => {
    it("should accept valid input with deadline", () => {
      const future = new Date(Date.now() + 86400000).toISOString();
      const result = createTaskSchema.safeParse({
        title: "Test task",
        deadline: future,
      });
      expect(result.success).toBe(true);
    });

    it("should accept valid input without deadline", () => {
      const result = createTaskSchema.safeParse({
        title: "Test task",
        deadline: null,
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty title", () => {
      const result = createTaskSchema.safeParse({
        title: "",
        deadline: null,
      });
      expect(result.success).toBe(false);
    });

    it("should reject whitespace-only title", () => {
      const result = createTaskSchema.safeParse({
        title: "   ",
        deadline: null,
      });
      expect(result.success).toBe(false);
    });

    it("should reject title over 200 chars", () => {
      const result = createTaskSchema.safeParse({
        title: "a".repeat(201),
        deadline: null,
      });
      expect(result.success).toBe(false);
    });

    it("should reject past deadline", () => {
      const result = createTaskSchema.safeParse({
        title: "Test",
        deadline: "2020-01-01T00:00:00.000Z",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateTaskSchema", () => {
    it("should accept partial update with title only", () => {
      const result = updateTaskSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        title: "Updated title",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID", () => {
      const result = updateTaskSchema.safeParse({
        id: "not-a-uuid",
        title: "Updated",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("taskListSchema", () => {
    it("should use defaults when no input", () => {
      const result = taskListSchema.parse({});
      expect(result.status).toBe("all");
      expect(result.sortBy).toBe("created");
      expect(result.limit).toBe(20);
    });

    it("should accept valid filter", () => {
      const result = taskListSchema.parse({ status: "PROCRASTINATING" });
      expect(result.status).toBe("PROCRASTINATING");
    });
  });
});
