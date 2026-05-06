"use client";

import { useState } from "react";

interface DeletionCancelDialogProps {
  isOpen: boolean;
  scheduledDeletionAt: Date;
  onCancel: () => Promise<void>;
  onContinue: () => void;
}

export function DeletionCancelDialog({
  isOpen,
  scheduledDeletionAt,
  onCancel,
  onContinue,
}: DeletionCancelDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await onCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  const formattedDate = scheduledDeletionAt.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      data-testid="deletion-cancel-dialog"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
        <h2
          className="text-lg font-bold text-gray-900 mb-2"
          data-testid="deletion-cancel-dialog-title"
        >
          アカウント削除リクエスト中
        </h2>

        <p className="text-gray-600 mb-6">
          {formattedDate}にアカウントが削除されます。キャンセルしますか？
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            data-testid="deletion-cancel-button"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing
              ? "処理中..."
              : "キャンセルして利用を続ける"}
          </button>

          <button
            onClick={onContinue}
            disabled={isProcessing}
            data-testid="deletion-continue-button"
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            削除を継続する
          </button>
        </div>
      </div>
    </div>
  );
}
