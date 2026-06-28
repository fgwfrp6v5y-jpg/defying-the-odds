import { Resend } from "resend";
import type { GuestApplication, InterviewSlot } from "@/types";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const from = process.env.EMAIL_FROM ?? "Defying The Odds <noreply@example.com>";
const hostEmail = process.env.HOST_EMAIL ?? "host@example.com";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type EmailKind = "application_received" | "guest_approved" | "interview_scheduled" | "interview_reminder";

function baseTemplate(title: string, body: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#17211d;max-width:620px">
      <h1 style="font-size:24px">${title}</h1>
      ${body}
      <p style="color:#51624f">Defying The Odds</p>
    </div>
  `;
}

export async function sendGuestEmail(kind: EmailKind, guest: GuestApplication, slot?: InterviewSlot) {
  if (!resend) {
    return { skipped: true };
  }

  const scheduleLink = `${siteUrl}/schedule?email=${encodeURIComponent(guest.email)}`;
  const subjects: Record<EmailKind, string> = {
    application_received: "We received your podcast guest application",
    guest_approved: "You are approved for the podcast",
    interview_scheduled: "Your podcast interview is scheduled",
    interview_reminder: "Reminder: your podcast interview is coming up"
  };

  const bodies: Record<EmailKind, string> = {
    application_received: `<p>Thanks, ${guest.name}. Your application is in review and we will be in touch soon.</p>`,
    guest_approved: `<p>Great news, ${guest.name}. Your guest application was approved.</p><p><a href="${scheduleLink}">Pick an interview time</a>.</p>`,
    interview_scheduled: `<p>Your interview is scheduled for <strong>${slot ? new Date(slot.starts_at).toLocaleString() : "the selected time"}</strong>.</p>`,
    interview_reminder: `<p>This is a friendly reminder for your upcoming podcast interview.</p>`
  };

  return resend.emails.send({
    from,
    to: guest.email,
    cc: kind === "application_received" ? hostEmail : undefined,
    subject: subjects[kind],
    html: baseTemplate(subjects[kind], bodies[kind])
  });
}
