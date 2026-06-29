create type public.app_role as enum ('owner', 'admin', 'guest');

create type public.guest_status as enum (
  'Applied',
  'Approved',
  'Scheduled',
  'Recorded',
  'Edited',
  'Published',
  'Rejected'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null unique,
  role public.app_role not null default 'guest',
  display_name text
);

create table public.interview_slots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_blocked boolean not null default false,
  guest_application_id uuid,
  note text,
  constraint interview_slots_end_after_start check (ends_at > starts_at)
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
  status public.guest_status not null default 'Applied',
  host_notes text,
  scheduled_slot_id uuid references public.interview_slots(id) on delete set null,
  scheduled_at timestamptz,
  recording_url text,
  published_url text
);

alter table public.interview_slots
add constraint interview_slots_guest_application_id_fkey
foreign key (guest_application_id) references public.guest_applications(id) on delete set null;

create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_application_id uuid references public.guest_applications(id) on delete cascade,
  event_type text not null,
  recipient text not null,
  resend_id text,
  status text not null default 'queued'
);

create table public.site_content (
  id text primary key default 'homepage',
  updated_at timestamptz not null default now(),
  brand_name text not null default 'Defying The Odds',
  eyebrow text not null default 'Guest application',
  headline text not null default 'Bring your best story to the mic.',
  intro text not null default 'Share your background, topic idea, headshot, and interview availability. The host will review your pitch and send scheduling details if it is a fit.',
  about_heading text not null default 'About Abby',
  bio text not null default 'Abby Vaden hosts Defying The Odds to create space for people with real stories, hard-won perspective, and hope that still has a pulse.',
  application_heading text not null default 'Apply to be a guest',
  application_intro text not null default 'Have a story or topic that fits Defying The Odds? Share your background, idea, headshot, and availability below.',
  hero_image_url text,
  hero_image_alt text,
  social_links jsonb not null default '[]'::jsonb
);

create index guest_applications_status_idx on public.guest_applications(status);
create index guest_applications_email_idx on public.guest_applications(lower(email));
create index interview_slots_starts_at_idx on public.interview_slots(starts_at);
create index profiles_role_idx on public.profiles(role);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger guest_applications_updated_at
before update on public.guest_applications
for each row execute function public.set_updated_at();

create trigger site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'guest'
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'guest'::public.app_role
  );
$$;

create or replace function public.is_host()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in ('owner'::public.app_role, 'admin'::public.app_role);
$$;

alter table public.profiles enable row level security;
alter table public.guest_applications enable row level security;
alter table public.interview_slots enable row level security;
alter table public.email_events enable row level security;
alter table public.site_content enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Admins can read profiles"
on public.profiles for select
to authenticated
using (public.is_host());

create policy "Owners manage profiles"
on public.profiles for all
to authenticated
using (public.current_app_role() = 'owner')
with check (public.current_app_role() = 'owner');

create policy "Public can submit applications"
on public.guest_applications for insert
to anon
with check (status = 'Applied');

create policy "Guests read only their own approved application"
on public.guest_applications for select
to authenticated
using (
  public.is_host()
  or (
    lower(email) = lower((select email from auth.users where id = auth.uid()))
    and status in ('Approved', 'Scheduled')
  )
);

create policy "Hosts manage applications"
on public.guest_applications for update
to authenticated
using (public.is_host())
with check (public.is_host());

create policy "Hosts delete applications"
on public.guest_applications for delete
to authenticated
using (public.is_host());

create policy "Authenticated guests can view open slots"
on public.interview_slots for select
to authenticated
using (
  public.is_host()
  or (is_blocked = false and guest_application_id is null and starts_at > now())
);

create policy "Hosts manage slots"
on public.interview_slots for all
to authenticated
using (public.is_host())
with check (public.is_host());

create policy "Hosts view email events"
on public.email_events for select
to authenticated
using (public.is_host());

create policy "Hosts manage email events"
on public.email_events for all
to authenticated
using (public.is_host())
with check (public.is_host());

create policy "Public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

create policy "Hosts manage site content"
on public.site_content for all
to authenticated
using (public.is_host())
with check (public.is_host());

insert into public.site_content (id)
values ('homepage')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('headshots', 'headshots', false)
on conflict (id) do update set public = false;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

create policy "Public can upload headshots"
on storage.objects for insert
to anon
with check (bucket_id = 'headshots');

create policy "Hosts can read headshots"
on storage.objects for select
to authenticated
using (bucket_id = 'headshots' and public.is_host());

create policy "Hosts can manage headshots"
on storage.objects for all
to authenticated
using (bucket_id = 'headshots' and public.is_host())
with check (bucket_id = 'headshots' and public.is_host());

create policy "Public can read site assets"
on storage.objects for select
to public
using (bucket_id = 'site-assets');

create policy "Hosts can upload site assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-assets' and public.is_host());

create policy "Hosts can update site assets"
on storage.objects for update
to authenticated
using (bucket_id = 'site-assets' and public.is_host())
with check (bucket_id = 'site-assets' and public.is_host());

create policy "Hosts can delete site assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-assets' and public.is_host());
