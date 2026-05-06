"use client";

import { ProcrastinationTimer } from "./ProcrastinationTimer";
import type { TaskWithElapsed } from "../lib/types";

interface TaskCardProps {
  task: TaskWithElapsed;
  onEdit: (task: TaskWithElapsed) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PROCRASTINATING":
      return { label: "先延ばし中", className: "bg-blue-100 text-blue-700" };
    case "COMPLETED":
      return { label: "完了", className: "bg-green-100 text-green-700" };
    case "EXPIRED":
      return { label: "期限切れ", className: "bg-red-100 text-red-700" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const badge = getStatusBadge(task.status);

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
      data-testid={`task-card-${task.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900" data-testid="task-card-title">
            {task.title}
          </h3>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
            data-testid="task-card-status"
          >
            {badge.label}
          </span>
        </div>

        {task.taskScore != null && (
          <div className="text-right" data-testid="task-card-score">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(task.taskScore)}
            </div>
            <div className="text-xs text-gray-400">スコア</div>
          </div>
        )}
      </div>

      {task.status === "PROCRASTINATING" && task.deadline && (
        <ProcrastinationTimer
          startedAt={new Date(task.startedAt)}
          deadline={new Date(task.deadline)}
          status={task.status}
        />
      )}

      {task.status === "COMPLETED" && task.deadline && (
        <ProcrastinationTimer
          startedAt={new Date(task.startedAt)}
          deadline={new Date(task.deadline)}
          status={task.status}
          completedAt={task.completedAt ? new Date(task.completedAt) : null}
        />
      )}

      <div className="flex gap-2 pt-1">
        {task.status === "PROCRASTINATING" && (
          <button
            onClick={() => onComplete(task.id)}
            data-testid="task-card-complete-button"
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            完了
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          data-testid="task-card-edit-button"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          編集
        </button>
        <button
          onClick={() => onDelete(task.id)}
          data-testid="task-card-delete-button"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-red-600 hover:bg-red-50"
        >
          削除
        </button>
      </div>
    </div>
  );
}
