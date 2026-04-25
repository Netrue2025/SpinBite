"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { writePlansCookie } from "@/lib/planner-utils";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { getStoredUsers, saveStoredUsers } from "@/lib/storage";
import type { AppUser, Country } from "@/lib/types";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  isSupabaseReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: (role?: AppUser["role"]) => void;
  updateProfile: (updates: Partial<Pick<AppUser, "name" | "preferredCountry">>) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function makeUser(email: string, name?: string, role: AppUser["role"] = "user", country: Country = "Nigeria"): AppUser {
  return {
    id: role === "admin" ? "demo-admin" : `local-${email.toLowerCase()}`,
    name: name || email.split("@")[0] || "Meal Spinner",
    email,
    role,
    preferredCountry: country,
    createdAt: new Date().toISOString()
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (hasSupabaseConfig && supabase) {
        const { data } = await supabase.auth.getUser();
        const authUser = data.user;

        if (authUser && mounted) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .maybeSingle();

          setUser({
            id: authUser.id,
            name: profile?.name ?? authUser.user_metadata?.name ?? "Meal Spinner",
            email: authUser.email ?? "",
            role: profile?.role ?? "user",
            preferredCountry: profile?.preferred_country ?? "Nigeria",
            createdAt: profile?.created_at ?? new Date().toISOString()
          });
        }
      } else {
        const saved = window.localStorage.getItem("meal-spin-user");
        if (saved && mounted) {
          setUser(JSON.parse(saved) as AppUser);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!hasSupabaseConfig) {
      window.localStorage.setItem("meal-spin-user", JSON.stringify(user));
      getStoredUsers(user);
    }

    try {
      const savedPlans = window.localStorage.getItem("meal-spin-plans");
      if (savedPlans) {
        writePlansCookie(JSON.parse(savedPlans));
      }
    } catch {
      writePlansCookie([]);
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isSupabaseReady: hasSupabaseConfig,
      async signInWithGoogle() {
        if (hasSupabaseConfig && supabase) {
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/dashboard`
            }
          });
          return;
        }

        const demo = makeUser("foodie@mealspin.app", "Demo Foodie");
        setUser(demo);
        router.push("/dashboard");
      },
      async signInWithEmail(email, password) {
        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        if (hasSupabaseConfig && supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });

          if (error) {
            throw error;
          }

          const authUser = data.user;
          if (authUser) {
            const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle();
            setUser({
              id: authUser.id,
              name: profile?.name ?? authUser.user_metadata?.name ?? "Meal Spinner",
              email: authUser.email ?? email,
              role: profile?.role ?? "user",
              preferredCountry: profile?.preferred_country ?? "Nigeria",
              createdAt: profile?.created_at ?? new Date().toISOString()
            });
          }
        } else {
          const localUser = makeUser(email);
          const users = getStoredUsers(localUser);
          saveStoredUsers(users);
          setUser(localUser);
        }

        router.push("/dashboard");
      },
      async signUpWithEmail(name, email, password) {
        if (!name || !email || !password) {
          throw new Error("Name, email, and password are required.");
        }

        if (hasSupabaseConfig && supabase) {
          const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });

          if (error) {
            throw error;
          }

          const authUser = data.user;
          if (authUser) {
            const profile = makeUser(email, name);
            setUser({ ...profile, id: authUser.id });
          }
        } else {
          const localUser = makeUser(email, name);
          const users = getStoredUsers(localUser);
          saveStoredUsers(users);
          setUser(localUser);
        }

        router.push("/dashboard");
      },
      demoLogin(role = "user") {
        const demo =
          role === "admin"
            ? makeUser("admin@mealspin.app", "Meal Admin", "admin", "United Kingdom")
            : makeUser("foodie@mealspin.app", "Demo Foodie");

        setUser(demo);
        router.push(role === "admin" ? "/admin" : "/dashboard");
      },
      updateProfile(updates) {
        setUser((current) => {
          if (!current) {
            return current;
          }

          const next = { ...current, ...updates };
          const users = getStoredUsers(next).map((storedUser) => (storedUser.id === next.id ? next : storedUser));
          saveStoredUsers(users);
          return next;
        });
      },
      async signOut() {
        if (hasSupabaseConfig && supabase) {
          await supabase.auth.signOut();
        } else {
          window.localStorage.removeItem("meal-spin-user");
        }
        setUser(null);
        router.push("/");
      }
    }),
    [loading, router, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
