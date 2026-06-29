import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { AppRole } from "@/types";

function ownerEmails() {
  return new Set(
    (process.env.OWNER_EMAILS ?? process.env.OWNER_EMAIL ?? "svaden101@gmail.com")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.searchParams.set("redirectTo", `${url.pathname}${url.search}`);
  return NextResponse.redirect(redirectUrl);
}

async function getRole(request: NextRequest, response: NextResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user?.email) {
    return null;
  }

  if (ownerEmails().has(user.email.toLowerCase())) {
    return "owner" as AppRole;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return ((profile?.role as AppRole | undefined) ?? "guest") as AppRole;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminPath = path.startsWith("/admin") || path.startsWith("/api/admin");
  const isSchedulePath = path === "/schedule" || path.startsWith("/api/schedule");
  const isAccountPath = path.startsWith("/account");

  if (!isAdminPath && !isSchedulePath && !isAccountPath) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const role = await getRole(request, response);

  if (!role) {
    return redirectToLogin(request);
  }

  if (isAdminPath && role !== "owner" && role !== "admin") {
    return redirectToLogin(request);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/schedule", "/account/:path*", "/api/admin/:path*", "/api/schedule"]
};
