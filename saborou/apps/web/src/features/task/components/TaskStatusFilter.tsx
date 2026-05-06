"use client";

import type { TaskFilterStatus } from "../lib/types";

interface TaskStatusFilterProps {
  value: TaskFilterStatus;
  onChange: (status: TaskFilterStatus) => void;
  counts: Record<TaskFilterStatus, number>;
}

const STATUS_OPTIONS: { value: TaskFilterStatus; label: string }[] = [
  { value: "all", label: "全て" },
  { value: "PROCRASTINATING", label: "先延ばし中" },
  { value: "COMPLETED", label: "完了" },
  { value: "EXPIRED", label: "期限切れ" },
];

export function TaskStatusFilter({
  value,
  onChange,
  counts,
}: TaskStatusFilterProps) {
  return (
    <div
      className="flex gap-1 bg-gray-100 rounded-lg p-1"
      data-testid="task-status-filter"
    >
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          data-testid={`task-filter-${option.value}`}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            value === option.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {option.label}({counts[option.value] ?? 0})
        </button>
      ))}
    </div>
  );
}
