import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logAuthEvent } from "./logger";
import { DELETION_GRACE_PERIOD_DAYS } from "./types";
import type { AppUser, DeletionRequest } from "./types";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    logAuthEvent("auth.signin.failure", "warn", undefined, {
      error: error.message,
    });
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "OAuth URL not returned" };
}

export async function signOut() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.auth.signOut();

  if (error) {
    logAuthEvent("auth.signout", "warn", user?.id, {
      error: error.message,
    });
    return { error: error.message };
  }

  logAuthEvent("auth.signout", "info", user?.id);
  redirect("/auth/signin");
}

export async function getAppUser(): Promise<AppUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    lastSignInAt: data.last_sign_in_at,
  };
}

export async function requestAccountDeletion(): Promise<{
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const scheduledDeletionAt = new Date();
  scheduledDeletionAt.setDate(
    scheduledDeletionAt.getDate() + DELETION_GRACE_PERIOD_DAYS
  );

  const { error: insertError } = await supabase
    .from("account_deletion_requests")
    .insert({
      user_id: user.id,
      scheduled_deletion_at: scheduledDeletionAt.toISOString(),
    });

  if (insertError) {
    logAuthEvent("auth.deletion.request", "error", user.id, {
      error: insertError.message,
    });
    return { error: insertError.message };
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ status: "PENDING_DELETION" as const })
    .eq("id", user.id);

  if (updateError) {
    logAuthEvent("auth.deletion.request", "error", user.id, {
      error: updateError.message,
    });
    return { error: updateError.message };
  }

  logAuthEvent("auth.deletion.request", "info", user.id, {
    scheduledDeletionAt: scheduledDeletionAt.toISOString(),
  });

  await supabase.auth.signOut();
  redirect("/auth/signin");
}

export async function cancelAccountDeletion(): Promise<{
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error: updateRequestError } = await supabase
    .from("account_deletion_requests")
    .update({
      status: "CANCELLED" as const,
      cancelled_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("status", "PENDING" as const);

  if (updateRequestError) {
    logAuthEvent("auth.deletion.cancel", "error", user.id, {
      error: updateRequestError.message,
    });
    return { error: updateRequestError.message };
  }

  const { error: updateUserError } = await supabase
    .from("users")
    .update({ status: "ACTIVE" as const })
    .eq("id", user.id);

  if (updateUserError) {
    logAuthEvent("auth.deletion.cancel", "error", user.id, {
      error: updateUserError.message,
    });
    return { error: updateUserError.message };
  }

  logAuthEvent("auth.deletion.cancel", "info", user.id);
  return {};
}

export async function getPendingDeletionRequest(): Promise<DeletionRequest | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("account_deletion_requests")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "PENDING" as const)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    requestedAt: data.requested_at,
    scheduledDeletionAt: data.scheduled_deletion_at,
    status: data.status,
    cancelledAt: data.cancelled_at,
  };
}
