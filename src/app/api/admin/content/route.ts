import { NextResponse } from "next/server";
import { getCurrentUser, isHostRole } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase";
import type { SiteContent } from "@/types";

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isHostRole(currentUser.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<SiteContent>;
  const content = {
    id: "homepage",
    brand_name: String(payload.brand_name ?? "Defying The Odds").trim(),
    eyebrow: String(payload.eyebrow ?? "Guest application").trim(),
    headline: String(payload.headline ?? "").trim(),
    intro: String(payload.intro ?? "").trim(),
    about_heading: String(payload.about_heading ?? "About Abby").trim(),
    bio: String(payload.bio ?? "").trim(),
    application_heading: String(payload.application_heading ?? "Apply to be a guest").trim(),
    application_intro: String(payload.application_intro ?? "").trim(),
    hero_image_url: payload.hero_image_url || null,
    hero_image_alt: payload.hero_image_alt || null,
    social_links: Array.isArray(payload.social_links) ? payload.social_links : []
  };

  if (!content.headline || !content.intro || !content.bio) {
    return NextResponse.json({ error: "Headline, intro, and bio are required" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("site_content")
    .upsert(content)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: data });
}
