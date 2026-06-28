export const STATUSES = [
  "Applied",
  "Approved",
  "Scheduled",
  "Recorded",
  "Edited",
  "Published"
] as const;

export type GuestStatus = (typeof STATUSES)[number] | "Rejected";

export type GuestApplication = {
  id: string;
  created_at: string;
  updated_at?: string;
  name: string;
  email: string;
  phone: string | null;
  social_links: string[];
  bio: string;
  topic_idea: string;
  headshot_url: string | null;
  availability: string;
  status: GuestStatus;
  host_notes: string | null;
  scheduled_slot_id: string | null;
  scheduled_at: string | null;
  recording_url?: string | null;
  published_url?: string | null;
};

export type InterviewSlot = {
  id: string;
  created_at?: string;
  starts_at: string;
  ends_at: string;
  is_blocked: boolean;
  guest_application_id: string | null;
  note: string | null;
};

export type ApplicationPayload = {
  name: string;
  email: string;
  phone?: string;
  socialLinks: string[];
  bio: string;
  topicIdea: string;
  headshotUrl?: string;
  availability: string;
};
