import { createServiceSupabaseClient } from "@/lib/supabase";
import { mockGuests, mockSlots } from "@/lib/mock-data";
import type { GuestApplication, InterviewSlot } from "@/types";

export async function getGuests(): Promise<GuestApplication[]> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return mockGuests;
  }

  const { data, error } = await supabase
    .from("guest_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return mockGuests;
  }

  return data as GuestApplication[];
}

export async function getSlots(): Promise<InterviewSlot[]> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return mockSlots;
  }

  const { data, error } = await supabase
    .from("interview_slots")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    console.error(error);
    return mockSlots;
  }

  return data as InterviewSlot[];
}
