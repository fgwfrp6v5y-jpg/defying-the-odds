import { GuestScheduler } from "@/components/guest-scheduler";
import { TopNav } from "@/components/top-nav";
import { requireUser } from "@/lib/auth";
import { getApprovedGuestsForEmail, getOpenSlots } from "@/lib/data";

export default async function SchedulePage() {
  const { user } = await requireUser();
  const email = user.email ?? "";
  const [approvedGuests, openSlots] = await Promise.all([getApprovedGuestsForEmail(email), getOpenSlots()]);

  return (
    <>
      <TopNav />
      <GuestScheduler guests={approvedGuests} slots={openSlots} currentEmail={email} />
    </>
  );
}
