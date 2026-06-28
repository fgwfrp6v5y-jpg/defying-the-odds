"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarClock, Check, CircleDot, FileText, Mic, Pencil, Search, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/button";
import { Field, TextArea, TextInput } from "@/components/field";
import { StatusBadge } from "@/components/status-badge";
import { STATUSES, type GuestApplication, type GuestStatus, type InterviewSlot } from "@/types";

type Props = {
  initialGuests: GuestApplication[];
  slots: InterviewSlot[];
};

const statusIcons = {
  Applied: FileText,
  Approved: Check,
  Scheduled: CalendarClock,
  Recorded: Mic,
  Edited: Pencil,
  Published: CircleDot
};

export function AdminDashboard({ initialGuests, slots }: Props) {
  const [guests, setGuests] = useState(initialGuests);
  const [selectedId, setSelectedId] = useState(initialGuests[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const selected = guests.find((guest) => guest.id === selectedId) ?? guests[0];

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const search = `${guest.name} ${guest.email} ${guest.topic_idea}`.toLowerCase();
      return search.includes(query.toLowerCase());
    });
  }, [guests, query]);

  const counts = useMemo(() => {
    return STATUSES.map((status) => ({
      status,
      count: guests.filter((guest) => guest.status === status).length
    }));
  }, [guests]);

  function updateGuest(id: string, patch: Partial<GuestApplication>) {
    setGuests((current) => current.map((guest) => (guest.id === id ? { ...guest, ...patch } : guest)));
    startTransition(async () => {
      await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch })
      });
    });
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
      <section className="grid gap-4 lg:content-start">
        <div className="rounded border border-ink/10 bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2 rounded border border-ink/10 bg-[#f7f6f1] px-3 py-2">
            <Search size={18} className="text-moss" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-moss"
              placeholder="Search guests"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {counts.map(({ status, count }) => {
            const Icon = statusIcons[status];
            return (
              <div key={status} className="rounded border border-ink/10 bg-white p-3">
                <Icon size={18} className="text-moss" />
                <p className="mt-2 text-2xl font-black">{count}</p>
                <p className="text-xs font-bold text-moss">{status}</p>
              </div>
            );
          })}
        </div>
        <div className="overflow-hidden rounded border border-ink/10 bg-white shadow-soft">
          {filteredGuests.map((guest) => (
            <button
              key={guest.id}
              className={`block w-full border-b border-ink/10 p-4 text-left last:border-b-0 hover:bg-sage/25 ${
                selected?.id === guest.id ? "bg-sage/35" : ""
              }`}
              onClick={() => setSelectedId(guest.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black">{guest.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-moss">{guest.topic_idea}</p>
                </div>
                <StatusBadge status={guest.status} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected ? (
        <section className="grid gap-5">
          <div className="rounded border border-ink/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <StatusBadge status={selected.status} />
                <h1 className="mt-3 text-3xl font-black">{selected.name}</h1>
                <p className="mt-1 text-sm font-semibold text-moss">{selected.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => updateGuest(selected.id, { status: "Approved" })}>
                  <Check size={17} />
                  Approve
                </Button>
                <Button variant="danger" onClick={() => updateGuest(selected.id, { status: "Rejected" })}>
                  <X size={17} />
                  Reject
                </Button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-moss">Bio</p>
                <p className="mt-2 text-sm leading-6">{selected.bio}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-moss">Topic idea</p>
                <p className="mt-2 text-sm leading-6">{selected.topic_idea}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
            <div className="rounded border border-ink/10 bg-white p-5 shadow-soft">
              <h2 className="text-lg font-black">Production status</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {STATUSES.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={selected.status === status ? "primary" : "secondary"}
                    onClick={() => updateGuest(selected.id, { status })}
                  >
                    {status}
                  </Button>
                ))}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Host notes">
                  <TextArea
                    defaultValue={selected.host_notes ?? ""}
                    onBlur={(event) => updateGuest(selected.id, { host_notes: event.currentTarget.value })}
                  />
                </Field>
                <Field label="Schedule interview">
                  <select
                    className="focus-ring min-h-11 w-full rounded border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm"
                    value={selected.scheduled_slot_id ?? ""}
                    onChange={(event) => {
                      const slot = slots.find((item) => item.id === event.target.value);
                      updateGuest(selected.id, {
                        status: "Scheduled",
                        scheduled_slot_id: slot?.id ?? null,
                        scheduled_at: slot?.starts_at ?? null
                      });
                    }}
                  >
                    <option value="">No interview scheduled</option>
                    {slots
                      .filter((slot) => !slot.is_blocked && (!slot.guest_application_id || slot.guest_application_id === selected.id))
                      .map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {format(new Date(slot.starts_at), "MMM d, h:mm a")}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Recording URL">
                  <TextInput
                    defaultValue={selected.recording_url ?? ""}
                    placeholder="https://..."
                    onBlur={(event) => updateGuest(selected.id, { recording_url: event.currentTarget.value })}
                  />
                </Field>
                <Field label="Published URL">
                  <TextInput
                    defaultValue={selected.published_url ?? ""}
                    placeholder="https://..."
                    onBlur={(event) => updateGuest(selected.id, { published_url: event.currentTarget.value })}
                  />
                </Field>
              </div>
              <p className="mt-4 min-h-5 text-sm font-semibold text-moss">
                {isPending ? "Saving changes..." : "Changes save automatically."}
              </p>
            </div>

            <aside className="rounded border border-ink/10 bg-white p-5 shadow-soft">
              <h2 className="text-lg font-black">Guest details</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="font-bold text-moss">Phone</dt>
                  <dd>{selected.phone || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-bold text-moss">Availability</dt>
                  <dd>{selected.availability}</dd>
                </div>
                <div>
                  <dt className="font-bold text-moss">Social links</dt>
                  <dd className="grid gap-1">
                    {selected.social_links.length ? selected.social_links.map((link) => <a className="break-all font-semibold underline" href={link} key={link}>{link}</a>) : "None"}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      ) : null}
    </main>
  );
}
