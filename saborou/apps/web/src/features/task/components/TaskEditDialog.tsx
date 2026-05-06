"use client";

import { useState } from "react";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "../lib/types";

interface TaskEditDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export function TaskEditDialog({ task, isOpen, onClose, onSave }: TaskEditDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ""
  );
  const [showDeadlineWarning, setShowDeadlineWarning] = useState(false);

  const updateTask = useUpdateTask();

  if (!isOpen) return null;

  const handleSave = async () => {
    const newDeadline = deadline ? new Date(deadline).toISOString() : null;
    const deadlineChanged = newDeadline !== task.deadline;

    if (deadlineChanged && task.status === "PROCRASTINATING" && !showDeadlineWarning) {
      setShowDeadlineWarning(true);
      return;
    }

    const result = await updateTask.mutateAsync({
      id: task.id,
      title: title !== task.title ? title : undefined,
      deadline: deadlineChanged ? newDeadline : undefined,
    });

    onSave(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="task-edit-dialog">
      <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl w-full">
        <h2 className="text-lg font-bold text-gray-900 mb-4">タスク編集</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              data-testid="task-edit-title-input"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">締切</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                setShowDeadlineWarning(false);
              }}
              min={new Date().toISOString().slice(0, 16)}
              data-testid="task-edit-deadline-input"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {showDeadlineWarning && (
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm" data-testid="task-edit-deadline-warning">
              先延ばし時間が再計算されます。よろしいですか？
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!title.trim() || updateTask.isPending}
            data-testid="task-edit-save-button"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {showDeadlineWarning ? "確認して保存" : updateTask.isPending ? "保存中..." : "保存"}
          </button>
          <button
            onClick={onClose}
            data-testid="task-edit-cancel-button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
