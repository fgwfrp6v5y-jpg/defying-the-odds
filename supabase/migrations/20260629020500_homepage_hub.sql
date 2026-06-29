alter table public.site_content
add column if not exists about_heading text not null default 'About Abby',
add column if not exists bio text not null default 'Abby Vaden hosts Defying The Odds to create space for people with real stories, hard-won perspective, and hope that still has a pulse.',
add column if not exists application_heading text not null default 'Apply to be a guest',
add column if not exists application_intro text not null default 'Have a story or topic that fits Defying The Odds? Share your background, idea, headshot, and availability below.',
add column if not exists social_links jsonb not null default '[]'::jsonb;

update public.site_content
set
  eyebrow = case when eyebrow = 'Guest application' then 'Stories that refuse the easy ending' else eyebrow end,
  headline = case when headline = 'Bring your best story to the mic.' then 'Defying The Odds' else headline end,
  intro = case
    when intro = 'Share your background, topic idea, headshot, and interview availability. The host will review your pitch and send scheduling details if it is a fit.'
    then 'A podcast and creator hub for honest conversations about resilience, rebuilding, faith, family, and the moments that change everything.'
    else intro
  end
where id = 'homepage';
