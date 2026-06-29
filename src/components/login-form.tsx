"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/button";
import { Field, TextInput } from "@/components/field";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();

  async function login(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setMessage("Supabase is not configured, so admin demo mode is open.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
          searchParams.get("redirectTo") ?? "/schedule"
        )}`
      }
    });

    setMessage(error ? error.message : "Check your email for a magic sign-in link.");
  }

  return (
    <form action={login} className="w-full rounded border border-ink/10 bg-white p-6 shadow-soft">
      <KeyRound className="text-moss" size={30} />
      <h1 className="mt-4 text-3xl font-black">Host login</h1>
      <p className="mt-2 text-sm leading-6 text-moss">
        Use a secure magic link to access approved scheduling or host tools.
      </p>
      <div className="mt-5">
        <Field label="Email">
          <TextInput name="email" type="email" autoComplete="email" required placeholder="host@example.com" />
        </Field>
      </div>
      <Button className="mt-5 w-full" type="submit">
        <Mail size={18} />
        Send magic link
      </Button>
      <p className="mt-4 min-h-5 text-sm font-semibold text-moss">{message}</p>
    </form>
  );
}
