"use client";

import { useEffect, useState } from "react";
import { calcElapsedPercentage, formatRemainingTime } from "../lib/calculator";
import type { TaskStatus } from "../lib/types";

interface ProcrastinationTimerProps {
  startedAt: Date;
  deadline: Date | null;
  status: TaskStatus;
  completedAt?: Date | null;
}

function getBarColor(percentage: number): string {
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-green-500";
}

export function ProcrastinationTimer({
  startedAt,
  deadline,
  status,
  completedAt,
}: ProcrastinationTimerProps) {
  const [percentage, setPercentage] = useState(() =>
    calcElapsedPercentage(startedAt, deadline, status, completedAt)
  );
  const [remaining, setRemaining] = useState(() =>
    formatRemainingTime(deadline)
  );

  useEffect(() => {
    if (!deadline || status !== "PROCRASTINATING") return;

    const interval = setInterval(() => {
      setPercentage(calcElapsedPercentage(startedAt, deadline, status));
      setRemaining(formatRemainingTime(deadline));
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [startedAt, deadline, status]);

  if (!deadline) return null;

  return (
    <div data-testid="procrastination-timer" className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{Math.round(percentage)}% 消費</span>
        {remaining && <span>残り {remaining}</span>}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          data-testid="procrastination-timer-bar"
        />
      </div>
    </div>
  );
}
