-- Grant permissions to authenticated and anon roles for all public tables
-- Required because "Automatically expose new tables" was disabled during project creation

-- Users
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Account deletion requests
GRANT SELECT, INSERT, UPDATE ON public.account_deletion_requests TO authenticated;

-- Tasks
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;

-- Task change logs
GRANT SELECT, INSERT ON public.task_change_logs TO authenticated;

-- Dimension scores
GRANT SELECT, INSERT, UPDATE ON public.dimension_scores TO authenticated;

-- Finalized scores
GRANT SELECT ON public.finalized_scores TO authenticated;

-- Weekly aggregates
GRANT SELECT ON public.weekly_aggregates TO authenticated;

-- Conversations
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;

-- Messages
GRANT SELECT, INSERT ON public.messages TO authenticated;

-- Excuse patterns
GRANT SELECT, INSERT, UPDATE ON public.excuse_patterns TO authenticated;

-- Analytics events
GRANT SELECT, INSERT ON public.analytics_events TO authenticated;

-- User profiles analysis
GRANT SELECT ON public.user_profiles_analysis TO authenticated;

-- Follows
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;

-- Groups
GRANT SELECT, INSERT, UPDATE ON public.groups TO authenticated;

-- Group members
GRANT SELECT, INSERT, DELETE ON public.group_members TO authenticated;

-- Feed items
GRANT SELECT ON public.feed_items TO authenticated;

-- Reactions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reactions TO authenticated;

-- Notification settings
GRANT SELECT, INSERT, UPDATE ON public.notification_settings TO authenticated;

-- Privacy settings
GRANT SELECT, INSERT, UPDATE ON public.privacy_settings TO authenticated;

-- Push subscriptions
GRANT SELECT, INSERT, DELETE ON public.push_subscriptions TO authenticated;

-- Global ranking view
GRANT SELECT ON public.global_ranking TO authenticated;
