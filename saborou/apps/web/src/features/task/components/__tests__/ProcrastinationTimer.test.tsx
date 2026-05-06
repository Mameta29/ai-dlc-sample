import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ProcrastinationTimer } from "../ProcrastinationTimer";

describe("ProcrastinationTimer", () => {
  afterEach(() => {
    cleanup();
  });

  it("should not render when deadline is null", () => {
    const { container } = render(
      <ProcrastinationTimer
        startedAt={new Date()}
        deadline={null}
        status="PROCRASTINATING"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render progress bar when deadline exists", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));

    render(
      <ProcrastinationTimer
        startedAt={new Date("2026-01-01T00:00:00Z")}
        deadline={new Date("2026-01-02T00:00:00Z")}
        status="PROCRASTINATING"
      />
    );

    expect(screen.getByTestId("procrastination-timer")).toBeInTheDocument();
    expect(screen.getByTestId("procrastination-timer-bar")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("should show 100% for EXPIRED tasks", () => {
    render(
      <ProcrastinationTimer
        startedAt={new Date("2026-01-01T00:00:00Z")}
        deadline={new Date("2026-01-02T00:00:00Z")}
        status="EXPIRED"
      />
    );

    expect(screen.getByText("100% 消費")).toBeInTheDocument();
  });
});
