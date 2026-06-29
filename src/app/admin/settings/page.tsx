import { Settings, ShieldCheck } from "lucide-react";
import { TopNav } from "@/components/top-nav";
import { requireRole } from "@/lib/auth";

export default async function AdminSettingsPage() {
  await requireRole(["owner"]);

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded border border-ink/10 bg-white p-5 shadow-soft">
          <Settings className="text-moss" size={28} />
          <h1 className="mt-4 text-3xl font-black">Security settings</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded border border-ink/10 p-4">
              <ShieldCheck className="text-moss" size={20} />
              <p className="mt-3 font-black">Owner emails</p>
              <p className="mt-1 break-all text-sm font-semibold text-moss">
                {process.env.OWNER_EMAILS ?? process.env.OWNER_EMAIL ?? "svaden101@gmail.com"}
              </p>
            </div>
            <div className="rounded border border-ink/10 p-4">
              <ShieldCheck className="text-moss" size={20} />
              <p className="mt-3 font-black">Protected routes</p>
              <p className="mt-1 text-sm font-semibold text-moss">/admin, /admin/*, /schedule, /api/admin/*, /api/schedule</p>
            </div>
            <div className="rounded border border-ink/10 p-4">
              <ShieldCheck className="text-moss" size={20} />
              <p className="mt-3 font-black">Public routes</p>
              <p className="mt-1 text-sm font-semibold text-moss">Application submission and login only</p>
            </div>
            <div className="rounded border border-ink/10 p-4">
              <ShieldCheck className="text-moss" size={20} />
              <p className="mt-3 font-black">Guest data</p>
              <p className="mt-1 text-sm font-semibold text-moss">Guests can only access their own approved scheduling flow</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
