import { NextResponse } from "next/server";
import { addHours } from "date-fns";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { sendGuestEmail } from "@/lib/email";
import type { GuestApplication } from "@/types";

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (process.env.REMINDER_CRON_SECRET && token !== process.env.REMINDER_CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ sent: 0, demo: true });
  }

  const now = new Date();
  const windowEnd = addHours(now, 24);
  const { data, error } = await supabase
    .from("guest_applications")
    .select("*")
    .eq("status", "Scheduled")
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", windowEnd.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await Promise.all((data as GuestApplication[]).map((guest) => sendGuestEmail("interview_reminder", guest)));
  return NextResponse.json({ sent: data.length });
}
