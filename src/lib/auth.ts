import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseEnv } from "@/lib/supabase";
import type { AppRole } from "@/types";

export type CurrentUser = {
  user: User;
  role: AppRole;
};

function ownerEmails() {
  return new Set(
    (process.env.OWNER_EMAILS ?? process.env.OWNER_EMAIL ?? "svaden101@gmail.com")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function createServerSupabaseClient() {
  if (!hasSupabaseEnv) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components cannot always set cookies; middleware and route handlers refresh them.
          }
        }
      }
    }
  );
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user?.email) {
    return null;
  }

  const email = user.email.toLowerCase();
  if (ownerEmails().has(email)) {
    return { user, role: "owner" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { user, role: (profile?.role as AppRole | undefined) ?? "guest" };
}

export async function requireUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return currentUser;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const currentUser = await requireUser();

  if (!allowedRoles.includes(currentUser.role)) {
    redirect("/login?error=forbidden");
  }

  return currentUser;
}

export function isHostRole(role: AppRole) {
  return role === "owner" || role === "admin";
}
