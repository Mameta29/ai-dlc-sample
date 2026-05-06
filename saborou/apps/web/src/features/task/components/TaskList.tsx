"use client";

import { useState, useCallback } from "react";
import { useTaskList } from "../hooks/useTaskList";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useCompleteTask } from "../hooks/useCompleteTask";
import { TaskCard } from "./TaskCard";
import { TaskStatusFilter } from "./TaskStatusFilter";
import { TaskEditDialog } from "./TaskEditDialog";
import { TaskDeleteConfirm } from "./TaskDeleteConfirm";
import type { TaskFilterStatus, TaskSortBy, TaskWithElapsed } from "../lib/types";

export function TaskList() {
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>("all");
  const [sortBy] = useState<TaskSortBy>("created");
  const [editingTask, setEditingTask] = useState<TaskWithElapsed | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskWithElapsed | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTaskList(statusFilter, sortBy);
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();

  const tasks = data?.pages.flatMap((page) => page.items) ?? [];

  // Calculate counts (approximate from loaded data)
  const counts: Record<TaskFilterStatus, number> = {
    all: tasks.length,
    PROCRASTINATING: tasks.filter((t) => t.status === "PROCRASTINATING").length,
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED").length,
    EXPIRED: tasks.filter((t) => t.status === "EXPIRED").length,
  };

  const handleComplete = useCallback(
    async (taskId: string) => {
      await completeTask.mutateAsync({ id: taskId });
    },
    [completeTask]
  );

  const handleDelete = useCallback(async () => {
    if (!deletingTask) return;
    await deleteTask.mutateAsync({ id: deletingTask.id });
    setDeletingTask(null);
  }, [deletingTask, deleteTask]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12" data-testid="task-list-loading">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="task-list">
      <TaskStatusFilter value={statusFilter} onChange={setStatusFilter} counts={counts} />

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400" data-testid="task-list-empty">
          タスクがありません
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={(id) => {
                const t = tasks.find((t) => t.id === id);
                if (t) setDeletingTask(t);
              }}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          data-testid="task-list-load-more"
          className="w-full py-3 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
        >
          {isFetchingNextPage ? "読み込み中..." : "もっと見る"}
        </button>
      )}

      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onSave={() => setEditingTask(null)}
        />
      )}

      {deletingTask && (
        <TaskDeleteConfirm
          isOpen={true}
          taskTitle={deletingTask.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}
