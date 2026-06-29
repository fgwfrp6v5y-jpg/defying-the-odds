import { HostCalendar } from "@/components/host-calendar";
import { TopNav } from "@/components/top-nav";
import { requireRole } from "@/lib/auth";
import { getSlots } from "@/lib/data";

export default async function AdminCalendarPage() {
  await requireRole(["owner", "admin"]);
  const slots = await getSlots();

  return (
    <>
      <TopNav />
      <HostCalendar initialSlots={slots} />
    </>
  );
}
