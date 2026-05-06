import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DeletionCancelDialog } from "../DeletionCancelDialog";

describe("DeletionCancelDialog", () => {
  const createProps = () => ({
    isOpen: true,
    scheduledDeletionAt: new Date("2026-05-13T00:00:00Z"),
    onCancel: vi.fn().mockResolvedValue(undefined),
    onContinue: vi.fn(),
  });

  afterEach(() => {
    cleanup();
  });

  it("should not render when isOpen is false", () => {
    render(<DeletionCancelDialog {...createProps()} isOpen={false} />);

    expect(
      screen.queryByTestId("deletion-cancel-dialog")
    ).not.toBeInTheDocument();
  });

  it("should render dialog when isOpen is true", () => {
    render(<DeletionCancelDialog {...createProps()} />);

    expect(
      screen.getByTestId("deletion-cancel-dialog")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("deletion-cancel-dialog-title")
    ).toHaveTextContent("アカウント削除リクエスト中");
  });

  it("should display cancel and continue buttons", () => {
    render(<DeletionCancelDialog {...createProps()} />);

    expect(
      screen.getByTestId("deletion-cancel-button")
    ).toHaveTextContent("キャンセルして利用を続ける");
    expect(
      screen.getByTestId("deletion-continue-button")
    ).toHaveTextContent("削除を継続する");
  });

  it("should call onContinue when continue button is clicked", () => {
    const props = createProps();
    render(<DeletionCancelDialog {...props} />);

    fireEvent.click(screen.getByTestId("deletion-continue-button"));

    expect(props.onContinue).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const props = createProps();
    render(<DeletionCancelDialog {...props} />);

    fireEvent.click(screen.getByTestId("deletion-cancel-button"));

    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });
});
