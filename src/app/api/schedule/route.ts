import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { sendGuestEmail } from "@/lib/email";
import type { GuestApplication, InterviewSlot } from "@/types";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guestId, slotId } = (await request.json()) as { guestId?: string; slotId?: string };

  if (!guestId || !slotId) {
    return NextResponse.json({ error: "Missing guest or slot" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const { data: existingGuest, error: existingGuestError } = await supabase
    .from("guest_applications")
    .select("*")
    .eq("id", guestId)
    .eq("email", currentUser.user.email.toLowerCase())
    .in("status", ["Approved", "Scheduled"])
    .single();

  if (existingGuestError || !existingGuest) {
    return NextResponse.json({ error: "Approved application not found" }, { status: 403 });
  }

  const { data: slot, error: slotError } = await supabase
    .from("interview_slots")
    .update({ guest_application_id: guestId })
    .eq("id", slotId)
    .eq("is_blocked", false)
    .is("guest_application_id", null)
    .select("*")
    .single();

  if (slotError) {
    return NextResponse.json({ error: slotError.message }, { status: 500 });
  }

  const { data: guest, error: guestError } = await supabase
    .from("guest_applications")
    .update({ status: "Scheduled", scheduled_slot_id: slotId, scheduled_at: slot.starts_at })
    .eq("id", guestId)
    .select("*")
    .single();

  if (guestError) {
    return NextResponse.json({ error: guestError.message }, { status: 500 });
  }

  await sendGuestEmail("interview_scheduled", guest as GuestApplication, slot as InterviewSlot);
  return NextResponse.json({ guest, slot });
}
