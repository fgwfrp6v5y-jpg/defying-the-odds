import Link from "next/link";
import { CalendarDays, ClipboardList, LogIn, Mic2 } from "lucide-react";

export function TopNav() {
  return (
    <header className="border-b border-ink/10 bg-[#f7f6f1]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-ink text-white">
            <Mic2 size={20} />
          </span>
          Defying The Odds
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link className="rounded px-3 py-2 hover:bg-ink/5" href="/admin">
            <span className="hidden sm:inline">Dashboard</span>
            <ClipboardList className="sm:hidden" size={20} />
          </Link>
          <Link className="rounded px-3 py-2 hover:bg-ink/5" href="/schedule">
            <span className="hidden sm:inline">Schedule</span>
            <CalendarDays className="sm:hidden" size={20} />
          </Link>
          <Link className="rounded px-3 py-2 hover:bg-ink/5" href="/login">
            <span className="hidden sm:inline">Login</span>
            <LogIn className="sm:hidden" size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
