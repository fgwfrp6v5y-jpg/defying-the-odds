import { UsersAdmin } from "@/components/users-admin";
import { TopNav } from "@/components/top-nav";
import { requireRole } from "@/lib/auth";
import { getProfiles } from "@/lib/data";

export default async function AdminUsersPage() {
  await requireRole(["owner"]);
  const profiles = await getProfiles();

  return (
    <>
      <TopNav />
      <UsersAdmin profiles={profiles} />
    </>
  );
}
