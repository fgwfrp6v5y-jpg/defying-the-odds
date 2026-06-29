"use client";

import { useState, useTransition } from "react";
import { ImagePlus, Link2, Save, Type } from "lucide-react";
import { Button } from "@/components/button";
import { Field, TextArea, TextInput } from "@/components/field";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { SiteContent } from "@/types";

export function ContentAdmin({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [imageName, setImageName] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function uploadImage(file: File | null) {
    if (!file) {
      return content.hero_image_url;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const path = `homepage/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, {
      upsert: false
    });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    return data.publicUrl;
  }

  async function save(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      try {
        const heroImageUrl = await uploadImage(formData.get("heroImage") as File | null);
        const payload = {
          brand_name: String(formData.get("brandName") ?? ""),
          eyebrow: String(formData.get("eyebrow") ?? ""),
          headline: String(formData.get("headline") ?? ""),
          intro: String(formData.get("intro") ?? ""),
          about_heading: String(formData.get("aboutHeading") ?? ""),
          bio: String(formData.get("bio") ?? ""),
          application_heading: String(formData.get("applicationHeading") ?? ""),
          application_intro: String(formData.get("applicationIntro") ?? ""),
          hero_image_url: heroImageUrl,
          hero_image_alt: String(formData.get("heroImageAlt") ?? ""),
          social_links: String(formData.get("socialLinks") ?? "")
            .split("\n")
            .map((line) => {
              const [label, ...urlParts] = line.split("|");
              return { label: label?.trim() ?? "", url: urlParts.join("|").trim() };
            })
            .filter((link) => link.label && link.url)
        };

        const response = await fetch("/api/admin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Unable to save content.");
        }

        const { content: savedContent } = (await response.json()) as { content: SiteContent };
        setContent(savedContent);
        setImageName("");
        setMessage("Content saved.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Something went wrong.");
      }
    });
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <form action={save} className="rounded border border-ink/10 bg-white p-5 shadow-soft">
        <Type className="text-moss" size={28} />
        <h1 className="mt-4 text-3xl font-black">Homepage content</h1>
        <p className="mt-2 text-sm leading-6 text-moss">
          Update the public homepage, social links, bio, guest CTA, and podcast artwork.
        </p>
        <div className="mt-6 grid gap-5">
          <Field label="Brand name">
            <TextInput name="brandName" required defaultValue={content.brand_name} />
          </Field>
          <Field label="Eyebrow">
            <TextInput name="eyebrow" required defaultValue={content.eyebrow} />
          </Field>
          <Field label="Headline">
            <TextInput name="headline" required defaultValue={content.headline} />
          </Field>
          <Field label="Intro">
            <TextArea name="intro" required defaultValue={content.intro} />
          </Field>
          <Field label="About heading">
            <TextInput name="aboutHeading" required defaultValue={content.about_heading} />
          </Field>
          <Field label="Bio">
            <TextArea name="bio" required defaultValue={content.bio} />
          </Field>
          <Field label="Social links" hint="One per line using Label | URL, for example Instagram | https://instagram.com/name">
            <TextArea
              name="socialLinks"
              defaultValue={content.social_links.map((link) => `${link.label} | ${link.url}`).join("\n")}
            />
          </Field>
          <Field label="Guest application heading">
            <TextInput name="applicationHeading" required defaultValue={content.application_heading} />
          </Field>
          <Field label="Guest application intro">
            <TextArea name="applicationIntro" required defaultValue={content.application_intro} />
          </Field>
          <Field label="Podcast image alt text">
            <TextInput name="heroImageAlt" defaultValue={content.hero_image_alt ?? ""} />
          </Field>
          <Field label="Podcast image" hint="Square artwork works best, like Spotify cover art.">
            <span className="relative flex min-h-11 items-center gap-3 rounded border border-dashed border-ink/25 bg-sage/20 px-3 py-2 text-sm font-semibold">
              <ImagePlus size={18} />
              <span className="truncate">{imageName || "Upload image"}</span>
              <input
                className="absolute inset-0 cursor-pointer opacity-0"
                name="heroImage"
                type="file"
                accept="image/*"
                onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")}
              />
            </span>
          </Field>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-h-5 text-sm font-semibold text-moss">{message}</p>
          <Button disabled={isPending} type="submit">
            <Save size={18} />
            {isPending ? "Saving" : "Save content"}
          </Button>
        </div>
      </form>
      <aside className="rounded border border-ink/10 bg-white p-5 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-moss">Preview</p>
        {content.hero_image_url ? (
          <img
            alt={content.hero_image_alt ?? content.brand_name}
            className="mt-4 aspect-square w-full rounded object-cover"
            src={content.hero_image_url}
          />
        ) : (
          <div className="mt-4 grid aspect-square place-items-center rounded bg-sage/30 text-sm font-bold text-moss">
            No image yet
          </div>
        )}
        <h2 className="mt-5 text-2xl font-black">{content.headline}</h2>
        <p className="mt-2 text-sm leading-6 text-moss">{content.intro}</p>
        <div className="mt-4 grid gap-2">
          {content.social_links.map((link) => (
            <p className="flex items-center gap-2 text-sm font-bold" key={`${link.label}-${link.url}`}>
              <Link2 size={15} className="text-moss" />
              {link.label}
            </p>
          ))}
        </div>
      </aside>
    </main>
  );
}
