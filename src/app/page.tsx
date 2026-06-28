import { ApplicationForm } from "@/components/application-form";
import { TopNav } from "@/components/top-nav";
import { CalendarCheck, MailCheck, MicVocal, UserRoundCheck } from "lucide-react";

const steps = [
  { label: "Apply", icon: MailCheck },
  { label: "Review", icon: UserRoundCheck },
  { label: "Schedule", icon: CalendarCheck },
  { label: "Record", icon: MicVocal }
];

export default function ApplyPage() {
  return (
    <>
      <TopNav />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="flex min-h-[calc(100vh-120px)] flex-col justify-between gap-8 rounded bg-ink p-6 text-white shadow-soft sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pollen">Guest application</p>
            <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
              Bring your best story to the mic.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/78">
              Share your background, topic idea, headshot, and interview availability. The host will review your pitch and send scheduling details if it is a fit.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {steps.map((step) => (
              <div key={step.label} className="rounded border border-white/15 bg-white/7 p-3">
                <step.icon className="mb-3 text-pollen" size={22} />
                <p className="text-sm font-bold">{step.label}</p>
              </div>
            ))}
          </div>
        </section>
        <ApplicationForm />
      </main>
    </>
  );
}
