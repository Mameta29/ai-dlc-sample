"use client";

import { useAuthContext } from "@/features/auth/components/AuthProvider";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { TaskCreateForm } from "@/features/task/components/TaskCreateForm";
import { TaskList } from "@/features/task/components/TaskList";

export default function DashboardPage() {
  const { appUser, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">SABOROU</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {appUser?.displayName ?? "ユーザー"}
            </span>
            <SignOutButton variant="icon" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            タスクを追加
          </h2>
          <TaskCreateForm />
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            タスク一覧
          </h2>
          <TaskList />
        </section>
      </main>
    </div>
  );
}
