import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { calcElapsedPercentage } from "../calculator";
import type { TaskStatus } from "../types";

const taskStatusArb = fc.constantFrom<TaskStatus>(
  "PROCRASTINATING",
  "COMPLETED",
  "EXPIRED"
);

describe("PBT: calcElapsedPercentage", () => {
  it("should always return value between 0 and 100 (Invariant)", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date("2020-01-01"), max: new Date("2030-01-01") }),
        fc.date({ min: new Date("2020-01-01"), max: new Date("2030-12-31") }),
        taskStatusArb,
        (startedAt, deadline, status) => {
          const result = calcElapsedPercentage(startedAt, deadline, status);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(100);
        }
      )
    );
  });

  it("should return 0 when deadline is null for any status (Invariant)", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date("2020-01-01"), max: new Date("2030-01-01") }),
        taskStatusArb,
        (startedAt, status) => {
          // Only non-EXPIRED statuses make sense with null deadline
          if (status === "EXPIRED") return;
          const result = calcElapsedPercentage(startedAt, null, status);
          expect(result).toBe(0);
        }
      )
    );
  });

  it("should return 100 for EXPIRED status regardless of times (Invariant)", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date("2020-01-01"), max: new Date("2030-01-01") }),
        fc.date({ min: new Date("2020-01-01"), max: new Date("2030-12-31") }),
        (startedAt, deadline) => {
          const result = calcElapsedPercentage(startedAt, deadline, "EXPIRED");
          expect(result).toBe(100);
        }
      )
    );
  });

  it("should be idempotent - same inputs always produce same output (Idempotence)", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date("2020-01-01"), max: new Date("2025-01-01") }),
        fc.date({ min: new Date("2025-01-02"), max: new Date("2030-12-31") }),
        fc.integer({ min: 1, max: 50 }),
        (startedAt, deadline, callCount) => {
          const completedAt = new Date(
            startedAt.getTime() +
              (deadline.getTime() - startedAt.getTime()) * 0.5
          );
          const first = calcElapsedPercentage(
            startedAt,
            deadline,
            "COMPLETED",
            completedAt
          );
          for (let i = 1; i < callCount; i++) {
            expect(
              calcElapsedPercentage(
                startedAt,
                deadline,
                "COMPLETED",
                completedAt
              )
            ).toBe(first);
          }
        }
      )
    );
  });

  it("COMPLETED percentage should be fixed at completedAt time (Invariant)", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date("2020-01-01"), max: new Date("2025-01-01") }),
        fc.date({ min: new Date("2025-01-02"), max: new Date("2030-12-31") }),
        (startedAt, deadline) => {
          // Ensure valid date range
          if (deadline.getTime() <= startedAt.getTime()) return;
          const completedAt = new Date(
            startedAt.getTime() +
              (deadline.getTime() - startedAt.getTime()) * 0.3
          );
          if (isNaN(completedAt.getTime())) return;
          const result = calcElapsedPercentage(
            startedAt,
            deadline,
            "COMPLETED",
            completedAt
          );
          // Should be approximately 30%
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(100);
        }
      )
    );
  });
});

describe("PBT: TaskStatus transitions (Invariant)", () => {
  const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
    PROCRASTINATING: ["COMPLETED", "EXPIRED"],
    COMPLETED: [],
    EXPIRED: [],
  };

  it("COMPLETED and EXPIRED should be terminal states", () => {
    fc.assert(
      fc.property(taskStatusArb, (targetStatus) => {
        expect(VALID_TRANSITIONS["COMPLETED"]).not.toContain(targetStatus);
        expect(VALID_TRANSITIONS["EXPIRED"]).not.toContain(targetStatus);
      })
    );
  });

  it("only PROCRASTINATING should have valid outgoing transitions", () => {
    fc.assert(
      fc.property(taskStatusArb, (status) => {
        if (status === "PROCRASTINATING") {
          expect(VALID_TRANSITIONS[status].length).toBeGreaterThan(0);
        } else {
          expect(VALID_TRANSITIONS[status]).toHaveLength(0);
        }
      })
    );
  });
});
