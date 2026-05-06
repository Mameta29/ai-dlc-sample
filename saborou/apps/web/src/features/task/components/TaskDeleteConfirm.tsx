"use client";

import { useState } from "react";

interface TaskDeleteConfirmProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function TaskDeleteConfirm({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}: TaskDeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="task-delete-confirm">
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-2">タスク削除</h2>
        <p className="text-gray-600 mb-6">
          「{taskTitle}」を削除しますか？この操作は取り消せません。
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            data-testid="task-delete-confirm-button"
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            data-testid="task-delete-cancel-button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
