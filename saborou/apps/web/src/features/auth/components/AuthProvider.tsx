"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { AppUser } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  appUser: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  isPendingDeletion: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;

    // Get initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (data) {
            setAppUser({
              id: data.id,
              email: data.email,
              displayName: data.display_name,
              avatarUrl: data.avatar_url,
              status: data.status,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              lastSignInAt: data.last_sign_in_at,
            });
          }
        } catch {
          // User not found in public.users - first login
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        setAppUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabaseRef.current.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabaseRef.current.auth.signOut();
    setUser(null);
    setAppUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        session,
        isLoading,
        isPendingDeletion: appUser?.status === "PENDING_DELETION",
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
