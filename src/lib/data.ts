import { createServiceSupabaseClient } from "@/lib/supabase";
import { mockGuests, mockSlots } from "@/lib/mock-data";
import type { GuestApplication, InterviewSlot, SiteContent, UserProfile } from "@/types";

export const defaultSiteContent: SiteContent = {
  id: "homepage",
  brand_name: "Defying The Odds",
  eyebrow: "Guest application",
  headline: "Bring your best story to the mic.",
  intro:
    "Share your background, topic idea, headshot, and interview availability. The host will review your pitch and send scheduling details if it is a fit.",
  hero_image_url: null,
  hero_image_alt: "Defying The Odds podcast artwork"
};

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

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return defaultSiteContent;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", "homepage")
    .maybeSingle();

  if (error) {
    console.error(error);
    return defaultSiteContent;
  }

  return (data as SiteContent | null) ?? defaultSiteContent;
}
