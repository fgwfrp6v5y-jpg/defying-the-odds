import { LoginForm } from "@/components/login-form";
import { TopNav } from "@/components/top-nav";

export default function LoginPage() {
  return (
    <>
      <TopNav />
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-md place-items-center px-4 py-8">
        <LoginForm />
      </main>
    </>
  );
}
