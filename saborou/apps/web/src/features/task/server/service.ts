import type { TypedSupabaseClient, Database } from "@/types/database.types";
import type { Task, TaskWithElapsed, TaskPage } from "../lib/types";
import type { CreateTaskInput, UpdateTaskInput, TaskListInput } from "../lib/schemas";
import { calcElapsedPercentage, formatRemainingTime } from "../lib/calculator";

function mapTask(row: Database["public"]["Tables"]["tasks"]["Row"]): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    status: row.status,
    deadline: row.deadline,
    taskScore: row.task_score ? Number(row.task_score) : null,
    procrastinationScore: row.procrastination_score
      ? Number(row.procrastination_score)
      : null,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    expiredAt: row.expired_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function enrichTask(task: Task): TaskWithElapsed {
  return {
    ...task,
    elapsedPercentage: calcElapsedPercentage(
      new Date(task.startedAt),
      task.deadline ? new Date(task.deadline) : null,
      task.status,
      task.completedAt ? new Date(task.completedAt) : null
    ),
    remainingTime: formatRemainingTime(
      task.deadline ? new Date(task.deadline) : null
    ),
  };
}

export async function createTask(
  supabase: TypedSupabaseClient,
  userId: string,
  input: CreateTaskInput
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: input.title,
      deadline: input.deadline,
    })
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

export async function updateTask(
  supabase: TypedSupabaseClient,
  userId: string,
  input: UpdateTaskInput
): Promise<Task> {
  // Get current task for change log
  const { data: current, error: fetchError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", input.id)
    .eq("user_id", userId)
    .single();

  if (fetchError || !current) throw fetchError ?? new Error("Task not found");

  // Build update object
  const updates: { title?: string; deadline?: string | null } = {};
  const changeLogs: Array<{ field_name: string; old_value: string | null; new_value: string | null }> = [];

  if (input.title !== undefined && input.title !== current.title) {
    updates.title = input.title;
    changeLogs.push({
      field_name: "title",
      old_value: current.title,
      new_value: input.title,
    });
  }

  if (input.deadline !== undefined && input.deadline !== current.deadline) {
    updates.deadline = input.deadline;
    changeLogs.push({
      field_name: "deadline",
      old_value: current.deadline,
      new_value: input.deadline,
    });
  }

  if (Object.keys(updates).length === 0) {
    return mapTask(current);
  }

  // Update task
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", input.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  // Insert change logs
  if (changeLogs.length > 0) {
    await supabase.from("task_change_logs").insert(
      changeLogs.map((log) => ({ ...log, task_id: input.id }))
    );
  }

  return mapTask(data);
}

export async function deleteTask(
  supabase: TypedSupabaseClient,
  userId: string,
  taskId: string
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function completeTask(
  supabase: TypedSupabaseClient,
  userId: string,
  taskId: string
): Promise<Task> {
  const { data: current, error: fetchError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !current) throw fetchError ?? new Error("Task not found");
  if (current.status !== "PROCRASTINATING") {
    throw new Error("Only PROCRASTINATING tasks can be completed");
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: "COMPLETED" as const,
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

export async function listTasks(
  supabase: TypedSupabaseClient,
  userId: string,
  input: TaskListInput
): Promise<TaskPage> {
  let query = supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (input.status !== "all") {
    query = query.eq("status", input.status);
  }

  // Sort
  switch (input.sortBy) {
    case "deadline":
      query = query.order("deadline", { ascending: true, nullsFirst: false });
      break;
    case "score":
      query = query.order("procrastination_score", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Cursor pagination
  if (input.cursor) {
    query = query.lt("created_at", input.cursor);
  }

  query = query.limit(input.limit + 1);

  const { data, error } = await query;
  if (error) throw error;

  const hasMore = data.length > input.limit;
  const items = data.slice(0, input.limit).map(mapTask).map(enrichTask);
  const nextCursor = hasMore ? items[items.length - 1]?.createdAt ?? null : null;

  return { items, nextCursor };
}

export async function getTask(
  supabase: TypedSupabaseClient,
  userId: string,
  taskId: string
): Promise<TaskWithElapsed> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return enrichTask(mapTask(data));
}
