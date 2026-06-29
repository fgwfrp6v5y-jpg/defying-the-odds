import { ApplicationForm } from "@/components/application-form";
import { TopNav } from "@/components/top-nav";
import { getSiteContent } from "@/lib/data";
import { ArrowDown, CalendarCheck, ExternalLink, MailCheck, MicVocal, UserRoundCheck } from "lucide-react";

const steps = [
  { label: "Apply", icon: MailCheck },
  { label: "Review", icon: UserRoundCheck },
  { label: "Schedule", icon: CalendarCheck },
  { label: "Record", icon: MicVocal }
];

export default async function ApplyPage() {
  const content = await getSiteContent();

  return (
    <>
      <TopNav />
      <main>
        <section className="bg-ink text-white">
          <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl content-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_430px] lg:px-8">
            <div className="flex flex-col justify-center py-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-pollen">{content.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black leading-none sm:text-7xl">
                {content.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">{content.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {content.social_links.map((link) => (
                  <a
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded bg-white px-4 py-2 text-sm font-black text-ink hover:bg-sage"
                    href={link.url}
                    key={`${link.label}-${link.url}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                    <ExternalLink size={16} />
                  </a>
                ))}
                <a
                  className="focus-ring inline-flex min-h-11 items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm font-black text-white hover:bg-white/10"
                  href="#apply"
                >
                  Apply to be a guest
                  <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <div className="flex items-center">
              {content.hero_image_url ? (
                <img
                  alt={content.hero_image_alt ?? content.brand_name}
                  className="aspect-square w-full rounded object-cover shadow-soft"
                  src={content.hero_image_url}
                />
              ) : (
                <div className="grid aspect-square w-full place-items-center rounded border border-white/15 bg-white/7 p-8 text-center">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-pollen">Podcast artwork</p>
                    <p className="mt-3 text-3xl font-black">{content.brand_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">About</p>
            <h2 className="mt-3 text-4xl font-black">{content.about_heading}</h2>
          </div>
          <p className="text-lg leading-8 text-moss">{content.bio}</p>
        </section>

        <section id="apply" className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-between gap-8 rounded bg-white p-6 shadow-soft sm:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Guest application</p>
              <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight">{content.application_heading}</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-moss">{content.application_intro}</p>
            </div>
          {content.hero_image_url ? (
            <div className="hidden overflow-hidden rounded border border-ink/10 bg-sage/20 sm:block">
              <img
                alt={content.hero_image_alt ?? content.brand_name}
                className="aspect-[16/10] w-full object-cover"
                src={content.hero_image_url}
              />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {steps.map((step) => (
              <div key={step.label} className="rounded border border-ink/10 bg-[#f7f6f1] p-3">
                <step.icon className="mb-3 text-coral" size={22} />
                <p className="text-sm font-bold">{step.label}</p>
              </div>
            ))}
          </div>
          </div>
          <ApplicationForm />
        </section>
      </main>
    </>
  );
}
