import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TaskCard } from "../TaskCard";
import type { TaskWithElapsed } from "../../lib/types";

const createMockTask = (): TaskWithElapsed => ({
  id: "test-id",
  userId: "user-id",
  title: "テストタスク",
  status: "PROCRASTINATING",
  deadline: new Date("2026-12-31").toISOString(),
  taskScore: 75,
  procrastinationScore: null,
  startedAt: new Date("2026-01-01").toISOString(),
  completedAt: null,
  expiredAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  elapsedPercentage: 30,
  remainingTime: "10日5時間",
});

describe("TaskCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render task title and status", () => {
    const mockTask = createMockTask();
    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={vi.fn()} />
    );

    expect(screen.getByTestId("task-card-title")).toHaveTextContent("テストタスク");
    expect(screen.getByTestId("task-card-status")).toHaveTextContent("先延ばし中");
  });

  it("should show complete button for PROCRASTINATING tasks", () => {
    const mockTask = createMockTask();
    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={vi.fn()} />
    );

    expect(screen.getByTestId("task-card-complete-button")).toBeInTheDocument();
  });

  it("should not show complete button for COMPLETED tasks", () => {
    const completedTask = { ...createMockTask(), status: "COMPLETED" as const };
    render(
      <TaskCard task={completedTask} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={vi.fn()} />
    );

    expect(screen.queryByTestId("task-card-complete-button")).not.toBeInTheDocument();
  });

  it("should call onComplete when complete button is clicked", () => {
    const mockTask = createMockTask();
    const onComplete = vi.fn();
    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={onComplete} />
    );

    fireEvent.click(screen.getByTestId("task-card-complete-button"));
    expect(onComplete).toHaveBeenCalledWith("test-id");
  });

  it("should display task score", () => {
    const mockTask = createMockTask();
    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={vi.fn()} />
    );

    expect(screen.getByTestId("task-card-score")).toHaveTextContent("75");
  });
});
