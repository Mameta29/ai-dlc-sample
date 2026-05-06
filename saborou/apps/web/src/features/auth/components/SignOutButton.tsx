"use client";

import { useState } from "react";
import { useAuthContext } from "./AuthProvider";

interface SignOutButtonProps {
  variant?: "icon" | "text";
}

export function SignOutButton({ variant = "text" }: SignOutButtonProps) {
  const { signOut } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        data-testid="signout-icon-button"
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        aria-label="ログアウト"
      >
        {isLoading ? (
          <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      data-testid="signout-text-button"
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
    >
      {isLoading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
