export type TaskStatus = "PROCRASTINATING" | "COMPLETED" | "EXPIRED";

export interface Task {
  id: string;
  userId: string;
  title: string;
  status: TaskStatus;
  deadline: string | null;
  taskScore: number | null;
  procrastinationScore: number | null;
  startedAt: string;
  completedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskWithElapsed extends Task {
  elapsedPercentage: number;
  remainingTime: string | null;
}

export interface TaskCompletion {
  task: Task;
  finalScore: number;
}

export interface TaskPage {
  items: TaskWithElapsed[];
  nextCursor: string | null;
}

export type TaskSortBy = "created" | "deadline" | "score";
export type TaskFilterStatus = TaskStatus | "all";
