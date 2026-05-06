import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";

// Test that useAuthContext throws when used outside provider
describe("AuthProvider", () => {
  it("useAuthContext should throw when used outside AuthProvider", async () => {
    // Mock the supabase client
    vi.mock("@/lib/supabase/client", () => ({
      createClient: () => ({
        auth: {
          onAuthStateChange: vi.fn(() => ({
            data: { subscription: { unsubscribe: vi.fn() } },
          })),
          signInWithOAuth: vi.fn(),
          signOut: vi.fn(),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        })),
      }),
    }));

    const { useAuthContext } = await import("../AuthProvider");

    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow("useAuthContext must be used within an AuthProvider");
  });
});
