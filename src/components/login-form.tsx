"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/button";
import { Field, TextInput } from "@/components/field";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirectTo") ?? "/schedule";

  async function login(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const intent = String(formData.get("intent") ?? "password");
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setMessage("Authentication is not configured yet.");
      return;
    }

    if (intent === "password") {
      if (!password) {
        setMessage("Enter your password or use the magic-link option.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        return;
      }

      router.replace(redirectTo);
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
          redirectTo
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
        Sign in with your password on this device, or send a magic link as a fallback.
      </p>
      <div className="mt-5 grid gap-4">
        <Field label="Email">
          <TextInput name="email" type="email" autoComplete="email" required placeholder="host@example.com" />
        </Field>
        <Field label="Password">
          <TextInput name="password" type="password" autoComplete="current-password" placeholder="Enter your password" />
        </Field>
      </div>
      <div className="mt-5 grid gap-3">
        <Button className="w-full" name="intent" value="password" type="submit">
          <LogIn size={18} />
          Sign in
        </Button>
        <Button className="w-full" name="intent" value="magic-link" type="submit" variant="secondary">
          <Mail size={18} />
          Send magic link
        </Button>
      </div>
      <p className="mt-4 min-h-5 text-sm font-semibold text-moss">{message}</p>
    </form>
  );
}
