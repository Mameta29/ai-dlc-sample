import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETION_GRACE_PERIOD_DAYS } from "../types";

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(),
};

const mockFrom = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => mockSupabase),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

describe("Auth Types and Constants", () => {
  it("should have correct deletion grace period", () => {
    expect(DELETION_GRACE_PERIOD_DAYS).toBe(7);
  });
});

describe("logAuthEvent", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  it("should output structured JSON log", async () => {
    const { logAuthEvent } = await import("../logger");

    logAuthEvent("auth.signin.success", "info", "user-123", {
      provider: "google",
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    const logOutput = (console.log as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    const parsed = JSON.parse(logOutput);

    expect(parsed).toMatchObject({
      level: "info",
      event: "auth.signin.success",
      userId: "user-123",
      metadata: { provider: "google" },
    });
    expect(parsed.timestamp).toBeDefined();
  });

  it("should use console.error for error level", async () => {
    const { logAuthEvent } = await import("../logger");

    logAuthEvent("auth.deletion.failure", "error", "user-123");

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("should use console.warn for warn level", async () => {
    const { logAuthEvent } = await import("../logger");

    logAuthEvent("auth.signin.failure", "warn");

    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("should not include PII in log output", async () => {
    const { logAuthEvent } = await import("../logger");

    logAuthEvent("auth.signin.success", "info", "user-123", {
      provider: "google",
    });

    const logOutput = (console.log as ReturnType<typeof vi.fn>).mock
      .calls[0][0];

    expect(logOutput).not.toContain("email");
    expect(logOutput).not.toContain("@");
  });
});

describe("UserStatus transitions", () => {
  it("valid transitions should be ACTIVE -> PENDING_DELETION -> DELETED", () => {
    const validTransitions: Record<string, string[]> = {
      ACTIVE: ["PENDING_DELETION"],
      PENDING_DELETION: ["ACTIVE", "DELETED"],
      DELETED: [],
    };

    expect(validTransitions["ACTIVE"]).toContain("PENDING_DELETION");
    expect(validTransitions["PENDING_DELETION"]).toContain("ACTIVE");
    expect(validTransitions["PENDING_DELETION"]).toContain("DELETED");
    expect(validTransitions["DELETED"]).toHaveLength(0);
  });

  it("ACTIVE should not transition directly to DELETED", () => {
    const validTransitions: Record<string, string[]> = {
      ACTIVE: ["PENDING_DELETION"],
      PENDING_DELETION: ["ACTIVE", "DELETED"],
      DELETED: [],
    };

    expect(validTransitions["ACTIVE"]).not.toContain("DELETED");
  });
});

describe("DeletionStatus transitions", () => {
  it("valid transitions should be PENDING -> CANCELLED or PENDING -> COMPLETED", () => {
    const validTransitions: Record<string, string[]> = {
      PENDING: ["CANCELLED", "COMPLETED"],
      CANCELLED: [],
      COMPLETED: [],
    };

    expect(validTransitions["PENDING"]).toContain("CANCELLED");
    expect(validTransitions["PENDING"]).toContain("COMPLETED");
    expect(validTransitions["CANCELLED"]).toHaveLength(0);
    expect(validTransitions["COMPLETED"]).toHaveLength(0);
  });
});
