"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { createBrowserSupabaseClient, hasSupabaseEnv } from "@/lib/supabase";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(!hasSupabaseEnv);
  const [isSignedIn, setIsSignedIn] = useState(!hasSupabaseEnv);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(Boolean(data.session));
      setIsReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!isReady) {
    return <main className="mx-auto max-w-7xl px-4 py-8 text-sm font-semibold text-moss">Checking host session...</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-lg place-items-center px-4 py-8">
        <section className="rounded border border-ink/10 bg-white p-6 text-center shadow-soft">
          <LockKeyhole className="mx-auto text-moss" size={34} />
          <h1 className="mt-4 text-2xl font-black">Host access required</h1>
          <p className="mt-2 text-sm leading-6 text-moss">
            Sign in with Supabase Auth to review applications and manage the calendar.
          </p>
          <Link
            className="focus-ring mt-5 inline-flex min-h-10 items-center justify-center rounded bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-ink/90"
            href="/login"
          >
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  return children;
}
