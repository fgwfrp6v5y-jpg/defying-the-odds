"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, UserCog } from "lucide-react";
import type { AppRole, UserProfile } from "@/types";

export function UsersAdmin({ profiles }: { profiles: UserProfile[] }) {
  const [users, setUsers] = useState(profiles);
  const [isPending, startTransition] = useTransition();

  function updateRole(id: string, role: AppRole) {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, role } : user)));
    startTransition(async () => {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role })
      });
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded border border-ink/10 bg-white p-5 shadow-soft">
        <ShieldCheck className="text-moss" size={28} />
        <h1 className="mt-4 text-3xl font-black">Users and roles</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-moss">
          Owner-only controls for assigning access. Admins can manage podcast operations. Guests can only apply and schedule approved interviews.
        </p>
      </section>
      <section className="mt-6 overflow-hidden rounded border border-ink/10 bg-white shadow-soft">
        {users.map((user) => (
          <div key={user.id} className="grid gap-4 border-b border-ink/10 p-4 last:border-b-0 sm:grid-cols-[1fr_220px] sm:items-center">
            <div className="flex items-start gap-3">
              <span className="rounded bg-sage/40 p-2 text-ink">
                <UserCog size={18} />
              </span>
              <div>
                <p className="font-black">{user.display_name || user.email}</p>
                <p className="break-all text-sm font-semibold text-moss">{user.email}</p>
              </div>
            </div>
            <select
              className="focus-ring min-h-11 w-full rounded border border-ink/15 bg-white px-3 py-2 text-sm font-bold shadow-sm"
              value={user.role}
              onChange={(event) => updateRole(user.id, event.currentTarget.value as AppRole)}
            >
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="guest">Guest</option>
            </select>
          </div>
        ))}
      </section>
      <p className="mt-4 min-h-5 text-sm font-semibold text-moss">{isPending ? "Saving role changes..." : ""}</p>
    </main>
  );
}
