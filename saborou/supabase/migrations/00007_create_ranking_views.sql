-- Global ranking view (current week)
CREATE OR REPLACE VIEW public.global_ranking AS
SELECT
  wa.user_id,
  u.display_name,
  u.avatar_url,
  wa.total_score,
  wa.task_count,
  wa.week_key,
  RANK() OVER (PARTITION BY wa.week_key ORDER BY wa.total_score DESC) as rank_position
FROM public.weekly_aggregates wa
JOIN public.users u ON u.id = wa.user_id
WHERE u.status = 'ACTIVE';

-- Grant access to authenticated users
GRANT SELECT ON public.global_ranking TO authenticated;
