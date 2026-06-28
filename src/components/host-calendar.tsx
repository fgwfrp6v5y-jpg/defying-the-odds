"use client";

import { useState, useTransition } from "react";
import { Ban, CalendarPlus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/button";
import { Field, TextInput } from "@/components/field";
import type { InterviewSlot } from "@/types";

export function HostCalendar({ initialSlots }: { initialSlots: InterviewSlot[] }) {
  const [slots, setSlots] = useState(initialSlots);
  const [isPending, startTransition] = useTransition();

  function createSlot(formData: FormData) {
    const startsAt = String(formData.get("startsAt"));
    const duration = Number(formData.get("duration") || 60);
    const isBlocked = formData.get("isBlocked") === "on";
    const note = String(formData.get("note") || "");
    const starts = new Date(startsAt);
    const ends = new Date(starts.getTime() + duration * 60_000);

    const optimistic: InterviewSlot = {
      id: crypto.randomUUID(),
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      is_blocked: isBlocked,
      guest_application_id: null,
      note
    };

    setSlots((current) => [...current, optimistic].sort((a, b) => a.starts_at.localeCompare(b.starts_at)));
    startTransition(async () => {
      await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimistic)
      });
    });
  }

  function removeSlot(id: string) {
    setSlots((current) => current.filter((slot) => slot.id !== id));
    startTransition(async () => {
      await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" });
    });
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
      <form action={createSlot} className="rounded border border-ink/10 bg-white p-5 shadow-soft">
        <CalendarPlus className="text-moss" size={28} />
        <h1 className="mt-4 text-3xl font-black">Host calendar</h1>
        <div className="mt-5 grid gap-4">
          <Field label="Start time">
            <TextInput name="startsAt" type="datetime-local" required />
          </Field>
          <Field label="Duration minutes">
            <TextInput name="duration" type="number" min={15} step={15} defaultValue={60} required />
          </Field>
          <Field label="Note">
            <TextInput name="note" placeholder="Optional context" />
          </Field>
          <label className="flex items-center gap-3 rounded border border-ink/10 p-3 text-sm font-bold">
            <input name="isBlocked" type="checkbox" className="h-4 w-4 accent-ink" />
            Block unavailable time
          </label>
          <Button disabled={isPending} type="submit">
            <CalendarPlus size={18} />
            Add to calendar
          </Button>
        </div>
      </form>
      <section className="rounded border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Slots and blocked dates</h2>
          <p className="text-sm font-semibold text-moss">{slots.length} entries</p>
        </div>
        <div className="mt-5 grid gap-3">
          {slots.map((slot) => (
            <div key={slot.id} className="flex flex-col gap-3 rounded border border-ink/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className={`mt-1 rounded p-2 ${slot.is_blocked ? "bg-coral/15 text-coral" : "bg-sage text-ink"}`}>
                  {slot.is_blocked ? <Ban size={18} /> : <CalendarPlus size={18} />}
                </span>
                <div>
                  <p className="font-black">{format(new Date(slot.starts_at), "EEE, MMM d, yyyy")}</p>
                  <p className="text-sm font-semibold text-moss">
                    {format(new Date(slot.starts_at), "h:mm a")} - {format(new Date(slot.ends_at), "h:mm a")}
                  </p>
                  {slot.note ? <p className="mt-1 text-sm text-moss">{slot.note}</p> : null}
                </div>
              </div>
              <Button variant="ghost" onClick={() => removeSlot(slot.id)} aria-label="Delete slot">
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
