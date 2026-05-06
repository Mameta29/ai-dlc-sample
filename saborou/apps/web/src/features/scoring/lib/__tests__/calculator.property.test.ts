import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { calculateTaskScore, calculateProcrastinationScore } from "../calculator";

const dimensionArb = fc.integer({ min: 1, max: 5 });
const dimensionsArb = fc.record({
  stakeholders: dimensionArb,
  financialImpact: dimensionArb,
  urgency: dimensionArb,
  difficulty: dimensionArb,
  uncertainty: dimensionArb,
  reputationImpact: dimensionArb,
});

describe("PBT: calculateTaskScore", () => {
  it("should always return value between 20 and 100 (Invariant)", () => {
    fc.assert(
      fc.property(dimensionsArb, (dims) => {
        const score = calculateTaskScore(dims);
        expect(score).toBeGreaterThanOrEqual(20);
        expect(score).toBeLessThanOrEqual(100);
      })
    );
  });

  it("should be idempotent (Idempotence)", () => {
    fc.assert(
      fc.property(
        dimensionsArb,
        fc.integer({ min: 1, max: 50 }),
        (dims, callCount) => {
          const first = calculateTaskScore(dims);
          for (let i = 1; i < callCount; i++) {
            expect(calculateTaskScore(dims)).toBe(first);
          }
        }
      )
    );
  });
});

describe("PBT: calculateProcrastinationScore", () => {
  it("should always return value between 0 and 100 (Invariant)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (taskScore, elapsed) => {
          const score = calculateProcrastinationScore(taskScore, elapsed);
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      )
    );
  });

  it("should be idempotent (Idempotence)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1, max: 50 }),
        (taskScore, elapsed, callCount) => {
          const first = calculateProcrastinationScore(taskScore, elapsed);
          for (let i = 1; i < callCount; i++) {
            expect(calculateProcrastinationScore(taskScore, elapsed)).toBe(first);
          }
        }
      )
    );
  });

  it("should be monotonically increasing with elapsed (Invariant)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 99 }),
        (taskScore, elapsed1) => {
          const elapsed2 = elapsed1 + 1;
          const score1 = calculateProcrastinationScore(taskScore, elapsed1);
          const score2 = calculateProcrastinationScore(taskScore, elapsed2);
          expect(score2).toBeGreaterThanOrEqual(score1);
        }
      )
    );
  });
});
