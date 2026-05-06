import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock AuthProvider context
const mockSignOut = vi.fn();

vi.mock("../AuthProvider", () => ({
  useAuthContext: () => ({
    signOut: mockSignOut,
    user: { id: "test-user" },
    appUser: null,
    session: null,
    isLoading: false,
    isPendingDeletion: false,
    signInWithGoogle: vi.fn(),
  }),
}));

describe("SignOutButton", () => {
  it("should render text variant by default", async () => {
    const { SignOutButton } = await import("../SignOutButton");
    render(<SignOutButton />);

    const button = screen.getByTestId("signout-text-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("ログアウト");
  });

  it("should render icon variant", async () => {
    const { SignOutButton } = await import("../SignOutButton");
    render(<SignOutButton variant="icon" />);

    const button = screen.getByTestId("signout-icon-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "ログアウト");
  });
});
