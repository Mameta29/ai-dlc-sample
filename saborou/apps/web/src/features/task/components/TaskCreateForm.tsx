"use client";

import { useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask";
import type { Task } from "../lib/types";

interface TaskCreateFormProps {
  onSuccess?: (task: Task) => void;
}

export function TaskCreateForm({ onSuccess }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [hasDeadline, setHasDeadline] = useState(true);
  const [deadline, setDeadline] = useState("");

  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const result = await createTask.mutateAsync({
      title: title.trim(),
      deadline: hasDeadline && deadline ? new Date(deadline).toISOString() : null,
    });

    setTitle("");
    setDeadline("");
    onSuccess?.(result);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="task-create-form" className="space-y-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクを入力..."
          maxLength={200}
          data-testid="task-create-title-input"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasDeadline}
            onChange={(e) => setHasDeadline(e.target.checked)}
            data-testid="task-create-deadline-toggle"
            className="rounded"
          />
          締切を設定
        </label>

        {hasDeadline && (
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            data-testid="task-create-deadline-input"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        )}

        {!hasDeadline && (
          <span className="text-xs text-orange-500" data-testid="task-create-no-ranking-label">
            ランキング対象外
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={!title.trim() || createTask.isPending}
        data-testid="task-create-submit-button"
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {createTask.isPending ? "登録中..." : "タスクを登録"}
      </button>
    </form>
  );
}
