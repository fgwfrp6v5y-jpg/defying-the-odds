"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  return children;
}

export function AccessDenied() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-lg place-items-center px-4 py-8">
      <section className="rounded border border-ink/10 bg-white p-6 text-center shadow-soft">
        <LockKeyhole className="mx-auto text-moss" size={34} />
        <h1 className="mt-4 text-2xl font-black">Sign in required</h1>
        <p className="mt-2 text-sm leading-6 text-moss">
          Protected podcast tools and guest details are only available to authorized users.
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
