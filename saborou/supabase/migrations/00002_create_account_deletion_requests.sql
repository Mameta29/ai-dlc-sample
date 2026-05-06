-- Create deletion_status enum
CREATE TYPE public.deletion_status AS ENUM ('PENDING', 'CANCELLED', 'COMPLETED');

-- Create account_deletion_requests table
CREATE TABLE public.account_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_deletion_at TIMESTAMPTZ NOT NULL,
  status public.deletion_status NOT NULL DEFAULT 'PENDING',
  cancelled_at TIMESTAMPTZ
);

-- Ensure only one PENDING request per user
CREATE UNIQUE INDEX idx_one_pending_deletion_per_user
  ON public.account_deletion_requests(user_id)
  WHERE status = 'PENDING';

-- Index for batch processing (find expired PENDING requests)
CREATE INDEX idx_deletion_pending_expired
  ON public.account_deletion_requests(scheduled_deletion_at)
  WHERE status = 'PENDING';

-- Enable RLS
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own deletion requests
CREATE POLICY "Users can read own deletion requests"
  ON public.account_deletion_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own deletion requests
CREATE POLICY "Users can create own deletion requests"
  ON public.account_deletion_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own deletion requests (for cancellation)
CREATE POLICY "Users can update own deletion requests"
  ON public.account_deletion_requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all records (for Cron jobs)
CREATE POLICY "Service role can manage all deletion requests"
  ON public.account_deletion_requests
  FOR ALL
  USING (auth.role() = 'service_role');
