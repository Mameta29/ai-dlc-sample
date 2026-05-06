-- Create score_source enum
CREATE TYPE public.score_source AS ENUM ('AI_ESTIMATED', 'USER_PROVIDED', 'MANUALLY_ADJUSTED');

-- Create dimension_scores table
CREATE TABLE public.dimension_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE UNIQUE,
  stakeholders INTEGER NOT NULL CHECK (stakeholders BETWEEN 1 AND 5),
  financial_impact INTEGER NOT NULL CHECK (financial_impact BETWEEN 1 AND 5),
  urgency INTEGER NOT NULL CHECK (urgency BETWEEN 1 AND 5),
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  uncertainty INTEGER NOT NULL CHECK (uncertainty BETWEEN 1 AND 5),
  reputation_impact INTEGER NOT NULL CHECK (reputation_impact BETWEEN 1 AND 5),
  source public.score_source NOT NULL DEFAULT 'USER_PROVIDED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dimension_scores_task_id ON public.dimension_scores(task_id);

ALTER TABLE public.dimension_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own dimension scores"
  ON public.dimension_scores FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = dimension_scores.task_id AND tasks.user_id = auth.uid())
  );

CREATE POLICY "Service role can manage all dimension scores"
  ON public.dimension_scores FOR ALL
  USING (auth.role() = 'service_role');

-- Create finalized_scores table
CREATE TABLE public.finalized_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_score NUMERIC NOT NULL CHECK (task_score BETWEEN 1 AND 100),
  elapsed_percentage NUMERIC NOT NULL CHECK (elapsed_percentage BETWEEN 0 AND 100),
  procrastination_score NUMERIC NOT NULL CHECK (procrastination_score >= 0),
  finalized_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  week_key TEXT NOT NULL
);

CREATE INDEX idx_finalized_scores_user_id ON public.finalized_scores(user_id);
CREATE INDEX idx_finalized_scores_week_key ON public.finalized_scores(week_key);
CREATE INDEX idx_finalized_scores_user_week ON public.finalized_scores(user_id, week_key);

ALTER TABLE public.finalized_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own finalized scores"
  ON public.finalized_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all finalized scores"
  ON public.finalized_scores FOR ALL
  USING (auth.role() = 'service_role');

-- Create weekly_aggregates table
CREATE TABLE public.weekly_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  week_key TEXT NOT NULL,
  total_score NUMERIC NOT NULL DEFAULT 0,
  task_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_key)
);

CREATE INDEX idx_weekly_aggregates_week ON public.weekly_aggregates(week_key);
CREATE INDEX idx_weekly_aggregates_user_week ON public.weekly_aggregates(user_id, week_key);

ALTER TABLE public.weekly_aggregates ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read weekly aggregates (for ranking)
CREATE POLICY "Authenticated users can read all weekly aggregates"
  ON public.weekly_aggregates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage all weekly aggregates"
  ON public.weekly_aggregates FOR ALL
  USING (auth.role() = 'service_role');

CREATE TRIGGER on_weekly_aggregates_updated
  BEFORE UPDATE ON public.weekly_aggregates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
