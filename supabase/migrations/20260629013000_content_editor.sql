create table if not exists public.site_content (
  id text primary key default 'homepage',
  updated_at timestamptz not null default now(),
  brand_name text not null default 'Defying The Odds',
  eyebrow text not null default 'Guest application',
  headline text not null default 'Bring your best story to the mic.',
  intro text not null default 'Share your background, topic idea, headshot, and interview availability. The host will review your pitch and send scheduling details if it is a fit.',
  hero_image_url text,
  hero_image_alt text
);

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "Hosts manage site content" on public.site_content;
create policy "Hosts manage site content"
on public.site_content for all
to authenticated
using (public.is_host())
with check (public.is_host());

insert into public.site_content (id)
values ('homepage')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read site assets" on storage.objects;
create policy "Public can read site assets"
on storage.objects for select
to public
using (bucket_id = 'site-assets');

drop policy if exists "Hosts can upload site assets" on storage.objects;
create policy "Hosts can upload site assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-assets' and public.is_host());

drop policy if exists "Hosts can update site assets" on storage.objects;
create policy "Hosts can update site assets"
on storage.objects for update
to authenticated
using (bucket_id = 'site-assets' and public.is_host())
with check (bucket_id = 'site-assets' and public.is_host());

drop policy if exists "Hosts can delete site assets" on storage.objects;
create policy "Hosts can delete site assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-assets' and public.is_host());
