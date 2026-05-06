"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        router.replace(`/signin?error=${encodeURIComponent(error.message)}`);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      // Check user status
      const { data: appUser } = await supabase
        .from("users")
        .select("status")
        .eq("id", user.id)
        .single();

      if (!appUser) {
        // New user - redirect to onboarding
        router.replace("/dashboard");
        return;
      }

      // Redirect to dashboard (PENDING_DELETION dialog handled by AuthProvider)
      router.replace("/dashboard");
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center" data-testid="auth-callback-loading">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4" />
        <p className="text-gray-500">認証処理中...</p>
      </div>
    </div>
  );
}
