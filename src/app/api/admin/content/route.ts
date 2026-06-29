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
    hero_image_url: payload.hero_image_url || null,
    hero_image_alt: payload.hero_image_alt || null
  };

  if (!content.headline || !content.intro) {
    return NextResponse.json({ error: "Headline and intro are required" }, { status: 400 });
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
