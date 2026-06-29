import { NextResponse } from "next/server";
import { getCurrentUser, isHostRole } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase";
import type { InterviewSlot } from "@/types";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isHostRole(currentUser.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slot = (await request.json()) as InterviewSlot;
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("interview_slots")
    .insert({
      starts_at: slot.starts_at,
      ends_at: slot.ends_at,
      is_blocked: slot.is_blocked,
      note: slot.note || null
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slot: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isHostRole(currentUser.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing slot id" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const { error } = await supabase.from("interview_slots").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
