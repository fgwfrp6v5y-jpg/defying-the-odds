import { addDays, addHours, startOfDay } from "date-fns";
import type { GuestApplication, InterviewSlot } from "@/types";

export const mockGuests: GuestApplication[] = [
  {
    id: "demo-1",
    created_at: new Date().toISOString(),
    name: "Maya Chen",
    email: "maya@example.com",
    phone: "(555) 014-8291",
    social_links: ["https://linkedin.com/in/mayachen", "https://x.com/mayachen"],
    bio: "Founder of a community media studio helping independent creators build durable audience systems.",
    topic_idea: "How niche podcasts can turn listeners into contributors",
    headshot_url: null,
    availability: "Tuesday or Thursday afternoons, Central time",
    status: "Applied",
    host_notes: "Strong fit for the creator economy series.",
    scheduled_slot_id: null,
    scheduled_at: null
  },
  {
    id: "demo-2",
    created_at: addDays(new Date(), -2).toISOString(),
    name: "Andre Wallace",
    email: "andre@example.com",
    phone: "(555) 010-4432",
    social_links: ["https://andre.example.com"],
    bio: "Product strategist and author focused on ethical automation in small teams.",
    topic_idea: "The practical side of AI adoption without losing human taste",
    headshot_url: null,
    availability: "Weekday mornings",
    status: "Scheduled",
    host_notes: "Prep questions drafted.",
    scheduled_slot_id: "slot-2",
    scheduled_at: addDays(new Date(), 3).toISOString()
  },
  {
    id: "demo-3",
    created_at: addDays(new Date(), -9).toISOString(),
    name: "Lena Ortiz",
    email: "lena@example.com",
    phone: null,
    social_links: ["https://instagram.com/lena.design"],
    bio: "Design director making public-interest digital services easier to understand.",
    topic_idea: "Designing trust into public services",
    headshot_url: null,
    availability: "Flexible next week",
    status: "Edited",
    host_notes: "Episode scheduled for July release.",
    scheduled_slot_id: "slot-1",
    scheduled_at: addDays(new Date(), -4).toISOString()
  }
];

export const mockSlots: InterviewSlot[] = Array.from({ length: 8 }, (_, index) => {
  const starts = addHours(startOfDay(addDays(new Date(), index + 1)), 10 + (index % 4));
  return {
    id: `slot-${index + 1}`,
    starts_at: starts.toISOString(),
    ends_at: addHours(starts, 1).toISOString(),
    is_blocked: index === 5,
    guest_application_id: index === 1 ? "demo-2" : null,
    note: index === 5 ? "Production blackout" : null
  };
});
