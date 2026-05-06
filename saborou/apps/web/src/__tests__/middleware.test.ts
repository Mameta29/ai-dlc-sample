import { describe, it, expect } from "vitest";

// Test the route matching logic in isolation
const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/callback"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith("/auth/");
}

describe("Middleware Route Matching", () => {
  describe("isPublicRoute", () => {
    it("should match landing page", () => {
      expect(isPublicRoute("/")).toBe(true);
    });

    it("should match signin page", () => {
      expect(isPublicRoute("/auth/signin")).toBe(true);
    });

    it("should match callback page", () => {
      expect(isPublicRoute("/auth/callback")).toBe(true);
    });

    it("should not match dashboard", () => {
      expect(isPublicRoute("/dashboard")).toBe(false);
    });

    it("should not match profile", () => {
      expect(isPublicRoute("/profile")).toBe(false);
    });

    it("should not match ranking", () => {
      expect(isPublicRoute("/ranking")).toBe(false);
    });

    it("should not match social pages", () => {
      expect(isPublicRoute("/social")).toBe(false);
    });

    it("should not match manual pages", () => {
      expect(isPublicRoute("/manual")).toBe(false);
    });

    it("should not match API routes", () => {
      expect(isPublicRoute("/api/trpc/auth")).toBe(false);
    });
  });

  describe("isAuthRoute", () => {
    it("should match auth signin", () => {
      expect(isAuthRoute("/auth/signin")).toBe(true);
    });

    it("should match auth callback", () => {
      expect(isAuthRoute("/auth/callback")).toBe(true);
    });

    it("should not match dashboard", () => {
      expect(isAuthRoute("/dashboard")).toBe(false);
    });

    it("should not match root", () => {
      expect(isAuthRoute("/")).toBe(false);
    });
  });

  describe("Protected routes", () => {
    const protectedPaths = [
      "/dashboard",
      "/dashboard/tasks",
      "/ranking",
      "/social",
      "/social/groups",
      "/profile",
      "/profile/settings",
      "/manual",
      "/manual/report",
    ];

    protectedPaths.forEach((path) => {
      it(`should treat ${path} as protected`, () => {
        expect(isPublicRoute(path)).toBe(false);
      });
    });
  });
});
