import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @supabase/supabase-js
const mockFrom = {
  select: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  lt: vi.fn(),
};

const mockSupabase = {
  from: vi.fn(() => mockFrom),
  auth: {
    admin: {
      signOut: vi.fn(),
    },
  },
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockSupabase),
}));

describe("DELETE /api/cron/delete-accounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  });

  it("should reject unauthorized requests", async () => {
    const { GET } = await import("../route");

    const request = new Request("http://localhost/api/cron/delete-accounts", {
      headers: { authorization: "Bearer wrong-secret" },
    });

    const response = await GET(request as any);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("should return 0 processed when no pending requests", async () => {
    mockFrom.lt.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const { GET } = await import("../route");

    const request = new Request("http://localhost/api/cron/delete-accounts", {
      headers: { authorization: "Bearer test-secret" },
    });

    const response = await GET(request as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.processed).toBe(0);
  });
});
