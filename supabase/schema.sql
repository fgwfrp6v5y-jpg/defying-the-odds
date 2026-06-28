create type guest_status as enum (
  'Applied',
  'Approved',
  'Scheduled',
  'Recorded',
  'Edited',
  'Published',
  'Rejected'
);

create table public.guest_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  social_links text[] not null default '{}',
  bio text not null,
  topic_idea text not null,
  headshot_url text,
  availability text not null,
  status guest_status not null default 'Applied',
  host_notes text,
  scheduled_slot_id uuid references public.interview_slots(id) on delete set null,
  scheduled_at timestamptz,
  recording_url text,
  published_url text
);

create table public.interview_slots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_blocked boolean not null default false,
  guest_application_id uuid references public.guest_applications(id) on delete set null,
  note text,
  constraint interview_slots_end_after_start check (ends_at > starts_at)
);

create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_application_id uuid references public.guest_applications(id) on delete cascade,
  event_type text not null,
  recipient text not null,
  resend_id text,
  status text not null default 'queued'
);

create index guest_applications_status_idx on public.guest_applications(status);
create index interview_slots_starts_at_idx on public.interview_slots(starts_at);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger guest_applications_updated_at
before update on public.guest_applications
for each row execute function public.set_updated_at();

alter table public.guest_applications enable row level security;
alter table public.interview_slots enable row level security;
alter table public.email_events enable row level security;

create policy "Public can submit applications"
on public.guest_applications for insert
to anon
with check (status = 'Applied');

create policy "Public can view open slots"
on public.interview_slots for select
to anon
using (is_blocked = false and guest_application_id is null and starts_at > now());

create policy "Authenticated hosts manage applications"
on public.guest_applications for all
to authenticated
using (true)
with check (true);

create policy "Authenticated hosts manage slots"
on public.interview_slots for all
to authenticated
using (true)
with check (true);

create policy "Authenticated hosts view email events"
on public.email_events for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('headshots', 'headshots', true)
on conflict (id) do nothing;

create policy "Public can upload headshots"
on storage.objects for insert
to anon
with check (bucket_id = 'headshots');

create policy "Public can read headshots"
on storage.objects for select
to public
using (bucket_id = 'headshots');
