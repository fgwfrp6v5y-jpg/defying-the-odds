# Defying The Odds

A clean Next.js guest management app for the Defying The Odds podcast, with a public guest application page, host dashboard, scheduling, Supabase database/auth/storage integration points, and Resend email notifications.

## Features

- Public guest application form with name, email, phone, social links, bio, topic idea, headshot upload, and availability.
- Admin dashboard for reviewing applications, approving or rejecting guests, adding notes, scheduling interviews, and moving guests through `Applied`, `Approved`, `Scheduled`, `Recorded`, `Edited`, and `Published`.
- Guest scheduling page where approved guests pick an available interview slot.
- Host calendar page at `/admin/calendar` for creating available slots and blocking unavailable dates.
- Resend email hooks for application received, guest approved, interview scheduled, and 24-hour reminders.
- Demo fallback data when Supabase and Resend environment variables are not configured.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create `.env.local` from `.env.example`.

3. In Supabase, run `supabase/schema.sql`, then add these environment values:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   RESEND_API_KEY=
   EMAIL_FROM=Defying The Odds <noreply@example.com>
   HOST_EMAIL=host@example.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   REMINDER_CRON_SECRET=
   ```

4. Start the app:

   ```bash
   pnpm dev
   ```

## Pages

- `/` public guest application.
- `/admin` host review and production dashboard.
- `/admin/calendar` host slot and blocked-date management.
- `/schedule` approved guest scheduling page.

## Reminder Emails

Call `POST /api/reminders` from a scheduled job. If `REMINDER_CRON_SECRET` is set, send it as:

```bash
Authorization: Bearer your-secret
```
