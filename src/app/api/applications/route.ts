import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { sendGuestEmail } from "@/lib/email";
import type { ApplicationPayload, GuestApplication } from "@/types";

function cleanPayload(payload: ApplicationPayload) {
  return {
    name: String(payload.name ?? "").trim(),
    email: String(payload.email ?? "").trim().toLowerCase(),
    phone: payload.phone ? String(payload.phone).trim() : null,
    social_links: payload.socialLinks ?? [],
    bio: String(payload.bio ?? "").trim(),
    topic_idea: String(payload.topicIdea ?? "").trim(),
    headshot_url: payload.headshotUrl || null,
    availability: String(payload.availability ?? "").trim(),
    status: "Applied"
  };
}

export async function POST(request: Request) {
  const payload = cleanPayload((await request.json()) as ApplicationPayload);

  if (!payload.name || !payload.email || !payload.bio || !payload.topic_idea || !payload.availability) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    const demoGuest = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...payload,
      social_links: payload.social_links,
      host_notes: null,
      scheduled_slot_id: null,
      scheduled_at: null
    } as GuestApplication;
    return NextResponse.json({ guest: demoGuest, demo: true }, { status: 201 });
  }

  const { data, error } = await supabase.from("guest_applications").insert(payload).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sendGuestEmail("application_received", data as GuestApplication);
  return NextResponse.json({ guest: data }, { status: 201 });
}
