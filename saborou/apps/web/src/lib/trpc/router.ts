import { router } from "./server";
import { taskRouter } from "@/features/task/server/router";
import { scoringRouter } from "@/features/scoring/server/router";
import { aiRouter } from "@/features/ai/server/router";
import { rankingRouter } from "@/features/ranking/server/router";
import { analyticsRouter } from "@/features/analytics/server/router";
import { socialRouter } from "@/features/social/server/router";
import { profileRouter } from "@/features/profile/server/router";
import { notificationRouter } from "@/features/notification/server/router";

export const appRouter = router({
  task: taskRouter,
  scoring: scoringRouter,
  ai: aiRouter,
  ranking: rankingRouter,
  analytics: analyticsRouter,
  social: socialRouter,
  profile: profileRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
