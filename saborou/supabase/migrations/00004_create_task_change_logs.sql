-- Create task_change_logs table
CREATE TABLE public.task_change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL CHECK (field_name IN ('title', 'deadline')),
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for task-based lookups
CREATE INDEX idx_task_change_logs_task_id ON public.task_change_logs(task_id);

-- Enable RLS
ALTER TABLE public.task_change_logs ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read change logs for their own tasks
CREATE POLICY "Users can read own task change logs"
  ON public.task_change_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.id = task_change_logs.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Service role can manage all
CREATE POLICY "Service role can manage all task change logs"
  ON public.task_change_logs FOR ALL
  USING (auth.role() = 'service_role');
