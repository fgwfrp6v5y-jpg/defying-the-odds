# Defying The Odds

A clean Next.js guest management app for the Defying The Odds podcast, with a public guest application page, host dashboard, scheduling, Supabase database/auth/storage integration points, and Resend email notifications.

## Features

- Public guest application form with name, email, phone, social links, bio, topic idea, headshot upload, and availability.
- Authenticated role-based access for Owner, Admin, and Guest users.
- Owner-only user role management and security settings pages.
- Owner/admin homepage hub editor with bio, social links, guest CTA, and public podcast artwork upload.
- Admin dashboard for reviewing applications, approving or rejecting guests, adding notes, scheduling interviews, and moving guests through `Applied`, `Approved`, `Scheduled`, `Recorded`, `Edited`, and `Published`.
- Guest scheduling page where approved, logged-in guests pick an available interview slot for their own application.
- Host calendar page at `/admin/calendar` for creating available slots and blocking unavailable dates.
- Resend email hooks for application received, guest approved, interview scheduled, and 24-hour reminders.

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
   OWNER_EMAILS=svaden101@gmail.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   REMINDER_CRON_SECRET=
   ```

4. After the owner signs in once, set your owner profile in Supabase:

   ```sql
   update public.profiles
   set role = 'owner'
   where lower(email) = 'svaden101@gmail.com';
   ```

   Set your wife to `admin` after she signs in:

   ```sql
   update public.profiles
   set role = 'admin'
   where lower(email) = 'her-email@example.com';
   ```

5. Start the app:

   ```bash
   pnpm dev
   ```

## Pages

- `/` public guest application.
- `/admin` owner/admin-only review and production dashboard.
- `/admin/calendar` owner/admin-only slot and blocked-date management.
- `/admin/content` owner/admin homepage copy and podcast artwork editor.
- `/admin/users` owner-only user and role management.
- `/admin/settings` owner-only security settings.
- `/account/security` authenticated password management.
- `/schedule` authenticated guest scheduling page for approved guests only.

## Reminder Emails

Call `POST /api/reminders` from a scheduled job. If `REMINDER_CRON_SECRET` is set, send it as:

```bash
Authorization: Bearer your-secret
```
