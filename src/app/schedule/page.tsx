import { GuestScheduler } from "@/components/guest-scheduler";
import { TopNav } from "@/components/top-nav";
import { getGuests, getSlots } from "@/lib/data";

export default async function SchedulePage() {
  const [guests, slots] = await Promise.all([getGuests(), getSlots()]);
  const approvedGuests = guests.filter((guest) => guest.status === "Approved" || guest.status === "Scheduled");
  const openSlots = slots.filter((slot) => !slot.is_blocked && !slot.guest_application_id && new Date(slot.starts_at) > new Date());

  return (
    <>
      <TopNav />
      <GuestScheduler guests={approvedGuests} slots={openSlots} />
    </>
  );
}
