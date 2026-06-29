import { ContentAdmin } from "@/components/content-admin";
import { TopNav } from "@/components/top-nav";
import { requireRole } from "@/lib/auth";
import { getSiteContent } from "@/lib/data";

export default async function AdminContentPage() {
  await requireRole(["owner", "admin"]);
  const content = await getSiteContent();

  return (
    <>
      <TopNav />
      <ContentAdmin initialContent={content} />
    </>
  );
}
