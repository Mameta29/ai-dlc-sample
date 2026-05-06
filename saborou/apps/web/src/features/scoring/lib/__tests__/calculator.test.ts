import { describe, it, expect } from "vitest";
import { calculateTaskScore, calculateProcrastinationScore, getWeekKey } from "../calculator";

describe("calculateTaskScore", () => {
  it("should return 20 for all 1s", () => {
    expect(
      calculateTaskScore({
        stakeholders: 1, financialImpact: 1, urgency: 1,
        difficulty: 1, uncertainty: 1, reputationImpact: 1,
      })
    ).toBe(20);
  });

  it("should return 100 for all 5s", () => {
    expect(
      calculateTaskScore({
        stakeholders: 5, financialImpact: 5, urgency: 5,
        difficulty: 5, uncertainty: 5, reputationImpact: 5,
      })
    ).toBe(100);
  });

  it("should return 60 for all 3s", () => {
    expect(
      calculateTaskScore({
        stakeholders: 3, financialImpact: 3, urgency: 3,
        difficulty: 3, uncertainty: 3, reputationImpact: 3,
      })
    ).toBe(60);
  });
});

describe("calculateProcrastinationScore", () => {
  it("should return 0 when taskScore is 0", () => {
    expect(calculateProcrastinationScore(0, 50)).toBe(0);
  });

  it("should return 0 when elapsed is 0", () => {
    expect(calculateProcrastinationScore(80, 0)).toBe(0);
  });

  it("should calculate correctly", () => {
    expect(calculateProcrastinationScore(80, 50)).toBe(40);
    expect(calculateProcrastinationScore(100, 100)).toBe(100);
  });
});

describe("getWeekKey", () => {
  it("should return ISO week format", () => {
    const key = getWeekKey(new Date("2026-01-05")); // Monday of week 2
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });
});
