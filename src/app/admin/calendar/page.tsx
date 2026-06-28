import { AuthGate } from "@/components/auth-gate";
import { HostCalendar } from "@/components/host-calendar";
import { TopNav } from "@/components/top-nav";
import { getSlots } from "@/lib/data";

export default async function AdminCalendarPage() {
  const slots = await getSlots();

  return (
    <>
      <TopNav />
      <AuthGate>
        <HostCalendar initialSlots={slots} />
      </AuthGate>
    </>
  );
}
