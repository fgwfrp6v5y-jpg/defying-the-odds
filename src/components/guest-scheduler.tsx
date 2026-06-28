"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarCheck, Clock3 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/button";
import { Field, TextInput } from "@/components/field";
import type { GuestApplication, InterviewSlot } from "@/types";

export function GuestScheduler({ guests, slots }: { guests: GuestApplication[]; slots: InterviewSlot[] }) {
  const [email, setEmail] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const guest = useMemo(
    () => guests.find((item) => item.email.toLowerCase() === email.trim().toLowerCase()),
    [email, guests]
  );

  function schedule() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: guest?.id, slotId: selectedSlot })
      });

      setMessage(response.ok ? "Interview scheduled. A confirmation email is on its way." : "Unable to schedule that slot.");
    });
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <section className="rounded border border-ink/10 bg-white p-5 shadow-soft">
        <CalendarCheck className="text-moss" size={28} />
        <h1 className="mt-4 text-3xl font-black">Pick an interview time</h1>
        <p className="mt-3 text-sm leading-6 text-moss">
          Enter the email used on your approved application, then choose one of the host&apos;s available slots.
        </p>
        <div className="mt-5">
          <Field label="Application email">
            <TextInput value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </Field>
        </div>
      </section>
      <section className="rounded border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">Available slots</h2>
            <p className="text-sm font-semibold text-moss">{guest ? `Scheduling for ${guest.name}` : "Verify your email to continue"}</p>
          </div>
          <Clock3 className="text-moss" size={24} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              disabled={!guest}
              className={`rounded border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                selectedSlot === slot.id ? "border-ink bg-sage/40" : "border-ink/10 hover:bg-sage/20"
              }`}
              onClick={() => setSelectedSlot(slot.id)}
            >
              <p className="font-black">{format(new Date(slot.starts_at), "EEEE, MMM d")}</p>
              <p className="mt-1 text-sm font-semibold text-moss">{format(new Date(slot.starts_at), "h:mm a")} - {format(new Date(slot.ends_at), "h:mm a")}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-h-5 text-sm font-semibold text-moss">{message}</p>
          <Button disabled={!guest || !selectedSlot || isPending} onClick={schedule}>
            <CalendarCheck size={18} />
            {isPending ? "Scheduling" : "Confirm time"}
          </Button>
        </div>
      </section>
    </main>
  );
}
