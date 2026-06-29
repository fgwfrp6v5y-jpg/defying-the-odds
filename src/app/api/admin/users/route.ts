import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase";
import type { AppRole } from "@/types";

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, role } = (await request.json()) as { id?: string; role?: AppRole };

  if (!id || !role || !["owner", "admin", "guest"].includes(role)) {
    return NextResponse.json({ error: "Invalid role update" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
