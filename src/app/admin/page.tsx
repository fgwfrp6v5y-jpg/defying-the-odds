import { AdminDashboard } from "@/components/admin-dashboard";
import { AuthGate } from "@/components/auth-gate";
import { TopNav } from "@/components/top-nav";
import { getGuests, getSlots } from "@/lib/data";

export default async function AdminPage() {
  const [guests, slots] = await Promise.all([getGuests(), getSlots()]);

  return (
    <>
      <TopNav />
      <AuthGate>
        <AdminDashboard initialGuests={guests} slots={slots} />
      </AuthGate>
    </>
  );
}
