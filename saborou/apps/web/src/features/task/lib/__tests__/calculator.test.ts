import { describe, it, expect, vi } from "vitest";
import { calcElapsedPercentage, formatRemainingTime } from "../calculator";

describe("calcElapsedPercentage", () => {
  it("should return 0 when deadline is null", () => {
    expect(
      calcElapsedPercentage(new Date(), null, "PROCRASTINATING")
    ).toBe(0);
  });

  it("should return 100 for EXPIRED status", () => {
    const startedAt = new Date("2026-01-01");
    const deadline = new Date("2026-01-02");
    expect(calcElapsedPercentage(startedAt, deadline, "EXPIRED")).toBe(100);
  });

  it("should calculate percentage for PROCRASTINATING", () => {
    const startedAt = new Date("2026-01-01T00:00:00Z");
    const deadline = new Date("2026-01-03T00:00:00Z"); // 2 days total
    // Mock "now" as 1 day in
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00Z"));

    const result = calcElapsedPercentage(startedAt, deadline, "PROCRASTINATING");
    expect(result).toBeCloseTo(50, 0);

    vi.useRealTimers();
  });

  it("should cap at 100%", () => {
    const startedAt = new Date("2026-01-01T00:00:00Z");
    const deadline = new Date("2026-01-02T00:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-05T00:00:00Z")); // Way past deadline

    const result = calcElapsedPercentage(startedAt, deadline, "PROCRASTINATING");
    expect(result).toBe(100);

    vi.useRealTimers();
  });

  it("should use completedAt for COMPLETED tasks", () => {
    const startedAt = new Date("2026-01-01T00:00:00Z");
    const deadline = new Date("2026-01-03T00:00:00Z"); // 2 days
    const completedAt = new Date("2026-01-02T00:00:00Z"); // 1 day = 50%

    const result = calcElapsedPercentage(
      startedAt,
      deadline,
      "COMPLETED",
      completedAt
    );
    expect(result).toBeCloseTo(50, 0);
  });

  it("should return 100 when totalDuration is 0", () => {
    const same = new Date("2026-01-01T00:00:00Z");
    expect(calcElapsedPercentage(same, same, "PROCRASTINATING")).toBe(100);
  });
});

describe("formatRemainingTime", () => {
  it("should return null for null deadline", () => {
    expect(formatRemainingTime(null)).toBeNull();
  });

  it("should return '期限切れ' for past deadline", () => {
    expect(formatRemainingTime(new Date("2020-01-01"))).toBe("期限切れ");
  });

  it("should format days and hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const deadline = new Date("2026-01-03T06:00:00Z"); // 2 days 6 hours
    expect(formatRemainingTime(deadline)).toBe("2日6時間");

    vi.useRealTimers();
  });
});
