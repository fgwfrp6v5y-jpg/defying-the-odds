import { TopNav } from "@/components/top-nav";
import { PasswordForm } from "@/components/password-form";
import { requireUser } from "@/lib/auth";

export default async function AccountSecurityPage() {
  await requireUser();

  return (
    <>
      <TopNav />
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-md place-items-center px-4 py-8">
        <PasswordForm />
      </main>
    </>
  );
}
