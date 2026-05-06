import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("../../hooks/useCreateTask", () => ({
  useCreateTask: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe("TaskCreateForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render form with title input and submit button", async () => {
    const { TaskCreateForm } = await import("../TaskCreateForm");
    render(<TaskCreateForm />);

    expect(screen.getByTestId("task-create-title-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-create-submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("task-create-deadline-toggle")).toBeInTheDocument();
  });

  it("should disable submit when title is empty", async () => {
    const { TaskCreateForm } = await import("../TaskCreateForm");
    render(<TaskCreateForm />);

    const submitButton = screen.getByTestId("task-create-submit-button");
    expect(submitButton).toBeDisabled();
  });
});
