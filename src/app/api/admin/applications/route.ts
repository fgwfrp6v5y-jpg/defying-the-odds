import { NextResponse } from "next/server";
import { getCurrentUser, isHostRole } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { sendGuestEmail } from "@/lib/email";
import type { GuestApplication, GuestStatus } from "@/types";

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isHostRole(currentUser.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...patch } = (await request.json()) as Partial<GuestApplication> & { id?: string };

  if (!id) {
    return NextResponse.json({ error: "Missing application id" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("guest_applications")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if ((patch.status as GuestStatus | undefined) === "Approved") {
    await sendGuestEmail("guest_approved", data as GuestApplication);
  }

  if (patch.scheduled_at) {
    await sendGuestEmail("interview_scheduled", data as GuestApplication);
  }

  return NextResponse.json({ guest: data });
}
