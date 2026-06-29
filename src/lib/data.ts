import { createServiceSupabaseClient } from "@/lib/supabase";
import { mockGuests, mockSlots } from "@/lib/mock-data";
import type { GuestApplication, InterviewSlot, UserProfile } from "@/types";

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

export async function getApprovedGuestsForEmail(email: string): Promise<GuestApplication[]> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("guest_applications")
    .select("*")
    .eq("email", email.toLowerCase())
    .in("status", ["Approved", "Scheduled"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data as GuestApplication[];
}

export async function getOpenSlots(): Promise<InterviewSlot[]> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("interview_slots")
    .select("*")
    .eq("is_blocked", false)
    .is("guest_application_id", null)
    .gt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data as InterviewSlot[];
}

export async function getProfiles(): Promise<UserProfile[]> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data as UserProfile[];
}
