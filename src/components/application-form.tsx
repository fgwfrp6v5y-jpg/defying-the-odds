"use client";

import { useState } from "react";
import { Send, Upload } from "lucide-react";
import { Button } from "@/components/button";
import { Field, TextArea, TextInput, inputClass } from "@/components/field";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ApplicationForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [headshotName, setHeadshotName] = useState("");

  async function uploadHeadshot(file: File | null) {
    if (!file) {
      return "";
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return "";
    }

    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
    const { error } = await supabase.storage.from("headshots").upload(path, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("headshots").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit(formData: FormData) {
    setState("submitting");
    setMessage("");

    try {
      const headshotUrl = await uploadHeadshot(formData.get("headshot") as File | null);
      const socialLinks = String(formData.get("socialLinks") ?? "")
        .split(/\n|,/)
        .map((value) => value.trim())
        .filter(Boolean);

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          socialLinks,
          bio: formData.get("bio"),
          topicIdea: formData.get("topicIdea"),
          headshotUrl,
          availability: formData.get("availability")
        })
      });

      if (!response.ok) {
        throw new Error("Application failed");
      }

      setState("success");
      setMessage("Application received. You will get an email confirmation shortly.");
      (document.getElementById("guest-application") as HTMLFormElement | null)?.reset();
      setHeadshotName("");
    } catch {
      setState("error");
      setMessage("Something went wrong. Please check the form and try again.");
    }
  }

  return (
    <form
      id="guest-application"
      action={onSubmit}
      className="rounded border border-ink/10 bg-white p-5 shadow-soft sm:p-7"
    >
      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <TextInput name="name" autoComplete="name" required placeholder="Alex Morgan" />
          </Field>
          <Field label="Email">
            <TextInput name="email" type="email" autoComplete="email" required placeholder="alex@example.com" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone number">
            <TextInput name="phone" type="tel" autoComplete="tel" placeholder="(555) 019-2048" />
          </Field>
          <Field label="Headshot">
            <span className="relative flex min-h-11 items-center gap-3 rounded border border-dashed border-ink/25 bg-sage/20 px-3 py-2 text-sm font-semibold">
              <Upload size={18} />
              <span className="truncate">{headshotName || "Upload image"}</span>
              <input
                className="absolute inset-0 cursor-pointer opacity-0"
                name="headshot"
                type="file"
                accept="image/*"
                onChange={(event) => setHeadshotName(event.target.files?.[0]?.name ?? "")}
              />
            </span>
          </Field>
        </div>
        <Field label="Social media links" hint="Separate multiple links with commas or new lines.">
          <TextArea name="socialLinks" placeholder="https://linkedin.com/in/alex&#10;https://instagram.com/alex" />
        </Field>
        <Field label="Short bio">
          <TextArea name="bio" required placeholder="Tell us who you are and why listeners will care." />
        </Field>
        <Field label="Topic idea">
          <TextArea name="topicIdea" required placeholder="What conversation would you love to have on the show?" />
        </Field>
        <Field label="Availability">
          <textarea
            className={inputClass}
            name="availability"
            required
            rows={3}
            placeholder="Share time zones, preferred days, and any blackout dates."
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-6 text-sm font-semibold text-moss">{message}</p>
        <Button disabled={state === "submitting"} type="submit">
          <Send size={18} />
          {state === "submitting" ? "Submitting" : "Submit application"}
        </Button>
      </div>
    </form>
  );
}
