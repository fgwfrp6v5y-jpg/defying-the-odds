import { AdminDashboard } from "@/components/admin-dashboard";
import { TopNav } from "@/components/top-nav";
import { requireRole } from "@/lib/auth";
import { getGuests, getSlots } from "@/lib/data";

export default async function AdminPage() {
  await requireRole(["owner", "admin"]);
  const [guests, slots] = await Promise.all([getGuests(), getSlots()]);

  return (
    <>
      <TopNav />
      <AdminDashboard initialGuests={guests} slots={slots} />
    </>
  );
}
