import type { TaskStatus } from "./types";

export function calcElapsedPercentage(
  startedAt: Date,
  deadline: Date | null,
  status: TaskStatus,
  completedAt?: Date | null
): number {
  // Expired: always 100% regardless of dates
  if (status === "EXPIRED") return 100;

  // No deadline or invalid date: always 0%
  if (!deadline || isNaN(deadline.getTime()) || isNaN(startedAt.getTime())) return 0;

  // Completed: fixed at completion time
  const now = status === "COMPLETED" && completedAt && !isNaN(completedAt.getTime()) ? completedAt : new Date();

  const totalDuration = deadline.getTime() - startedAt.getTime();
  if (totalDuration <= 0) return 100;

  const elapsed = now.getTime() - startedAt.getTime();
  const percentage = (elapsed / totalDuration) * 100;

  return Math.min(Math.max(percentage, 0), 100);
}

export function formatRemainingTime(deadline: Date | null): string | null {
  if (!deadline) return null;

  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return "期限切れ";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}日${hours}時間`;
  if (hours > 0) return `${hours}時間${minutes}分`;
  return `${minutes}分`;
}
