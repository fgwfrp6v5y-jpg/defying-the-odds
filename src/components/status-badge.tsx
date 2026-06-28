import clsx from "clsx";
import type { GuestStatus } from "@/types";

const styles: Record<GuestStatus, string> = {
  Applied: "bg-skyglass text-ink",
  Approved: "bg-sage text-ink",
  Scheduled: "bg-pollen/30 text-ink",
  Recorded: "bg-coral/15 text-ink",
  Edited: "bg-moss/15 text-ink",
  Published: "bg-ink text-white",
  Rejected: "bg-zinc-200 text-zinc-700"
};

export function StatusBadge({ status }: { status: GuestStatus }) {
  return (
    <span className={clsx("inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold", styles[status])}>
      {status}
    </span>
  );
}
