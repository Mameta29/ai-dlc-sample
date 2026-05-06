-- Create analytics_event_type enum
CREATE TYPE public.analytics_event_type AS ENUM (
  'ACCEPTANCE_PATTERN',      -- 受容パターン
  'SUBJECTIVE_WEIGHT',       -- 重さの主観次元
  'STAKEHOLDER_HIERARCHY',   -- ステークホルダー階層
  'SELF_IDENTITY',           -- 自己同一性
  'IGNITION_THRESHOLD',      -- 着火閾値
  'LINGUISTIC_TRIGGER',      -- 言語的トリガー
  'BIORHYTHM',              -- 回避行動の生体リズム
  'SELF_GENERATED_EXCUSE'    -- 自己生成型言い訳
);

-- Create analytics_events table (raw event storage)
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_type public.analytics_event_type NOT NULL,
  payload JSONB NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(user_id, event_type);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(user_id, created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analytics events"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all analytics events"
  ON public.analytics_events FOR ALL
  USING (auth.role() = 'service_role');

-- Users can insert their own events (triggered by app)
CREATE POLICY "Users can insert own analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user_profiles table (self-manual / 自己取扱説明書)
CREATE TABLE public.user_profiles_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  acceptance_pattern JSONB,
  subjective_weight_profile JSONB,
  stakeholder_hierarchy JSONB,
  self_identity JSONB,
  ignition_threshold JSONB,
  linguistic_triggers JSONB,
  biorhythm_pattern JSONB,
  generated_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_profiles_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile analysis"
  ON public.user_profiles_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all profile analysis"
  ON public.user_profiles_analysis FOR ALL
  USING (auth.role() = 'service_role');

CREATE TRIGGER on_user_profiles_analysis_updated
  BEFORE UPDATE ON public.user_profiles_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
