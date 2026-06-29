"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/button";
import { Field, TextInput } from "@/components/field";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function PasswordForm() {
  const [message, setMessage] = useState("");

  async function updatePassword(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setMessage("Authentication is not configured yet.");
      return;
    }

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Password updated.");
  }

  return (
    <form action={updatePassword} className="w-full rounded border border-ink/10 bg-white p-6 shadow-soft">
      <KeyRound className="text-moss" size={30} />
      <h1 className="mt-4 text-3xl font-black">Password</h1>
      <p className="mt-2 text-sm leading-6 text-moss">Set or update the password for this account.</p>
      <div className="mt-5 grid gap-4">
        <Field label="New password">
          <TextInput name="password" type="password" autoComplete="new-password" required />
        </Field>
        <Field label="Confirm password">
          <TextInput name="confirmPassword" type="password" autoComplete="new-password" required />
        </Field>
      </div>
      <Button className="mt-5 w-full" type="submit">
        <KeyRound size={18} />
        Save password
      </Button>
      <p className="mt-4 min-h-5 text-sm font-semibold text-moss">{message}</p>
    </form>
  );
}
