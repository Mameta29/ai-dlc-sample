import type { UserStatus, DeletionStatus } from "@/types/database.types";

export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastSignInAt: string | null;
}

export interface DeletionRequest {
  id: string;
  userId: string;
  requestedAt: string;
  scheduledDeletionAt: string;
  status: DeletionStatus;
  cancelledAt: string | null;
}

export type AuthEvent =
  | "auth.signin.success"
  | "auth.signin.failure"
  | "auth.signout"
  | "auth.token.refresh"
  | "auth.token.refresh.failure"
  | "auth.deletion.request"
  | "auth.deletion.cancel"
  | "auth.deletion.execute"
  | "auth.deletion.failure";

export interface AuthLogEntry {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  event: AuthEvent;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export const DELETION_GRACE_PERIOD_DAYS = 7;
