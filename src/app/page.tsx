import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerifiedLeaderboard } from "@/components/verified-leaderboard";
import {
  BENEFIT_ITEMS,
  COUNTRIES_WITH_FLAGS,
  SERVICE_ITEMS,
} from "@/content/landing-data";

const signupHrefPrimary =
  process.env.NEXT_PUBLIC_PUBLIC_REFERRAL_CODE?.trim()
    ? `/signup?ref=${process.env.NEXT_PUBLIC_PUBLIC_REFERRAL_CODE.trim()}`
    : "/signup";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        items={[
          {
            label: "Leaderboard",
            href: "#leaders",
            icon: "leaderboard",
          },
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: "dashboard",
          },
          { label: "Login", href: "/login" },
        ]}
        signup={{ label: "Sign up", href: "/signup" }}
        cta={{ label: "Get Started", href: "/signup" }}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 md:px-8">
        {/* Hero */}
        <section className="flex flex-col items-center py-16 text-center md:py-24">
          <p className="mb-4 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 md:mb-5 md:gap-2.5 md:text-base md:tracking-[0.16em]">
            <svg
              className="h-4 w-4 shrink-0 text-blue-600 md:h-[1.125rem] md:w-[1.125rem]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
            <span>Premium visa consultancy &amp; immigration services</span>
          </p>
          <h1 className="text-balance max-w-5xl font-extrabold leading-[1.12] tracking-tight md:leading-[1.1]">
            <span className="text-black text-5xl md:text-6xl lg:text-7xl">
              Your Global Journey{" "}
            </span>
            <span className="text-blue-600 text-4xl md:text-5xl lg:text-6xl">
              Starts with Expert Visa Advice
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-sm leading-7 text-slate-500 md:mt-8 md:text-base">
            Get personalized visa guidance, verified referral tracking, and a
            smooth application workflow designed for professionals, students,
            and families moving worldwide.
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-12">
            <Button href={signupHrefPrimary} className="w-full sm:w-auto">
              Start Your Application
            </Button>
            <Button
              href="#services"
              variant="secondary"
              className="w-full sm:w-auto bg-white"
            >
              View Services
            </Button>
          </div>
        </section>

        {/* Verified leaderboard */}
        <section
          id="leaders"
          className="scroll-mt-24 border-t border-slate-100 py-16 md:py-20"
          aria-labelledby="leaders-heading"
        >
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Leaderboard
            </p>
            <h2
              id="leaders-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
            >
              Verified leaderboard
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
              Verified members only — ranked by lifetime referral points. 
              
            </p>
          </div>

          <VerifiedLeaderboard />
        </section>

        {/* About */}
        <section
          id="about"
          className="scroll-mt-24 border-t border-slate-100 py-16 md:py-20"
          aria-labelledby="about-heading"
        >
          <div className="mx-auto max-w-3xl text-center md:max-w-none md:text-left lg:flex lg:gap-16 lg:items-start">
            <div className="lg:w-2/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                About us
              </p>
              <h2
                id="about-heading"
                className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
              >
                Visa consultancy built for clarity and outcomes
              </h2>
            </div>
            <div className="mt-8 space-y-4 text-sm leading-7 text-slate-600 md:text-base lg:mt-0 lg:flex-1">
              <p>
                Worldwide Visa Adviser helps individuals and families navigate
                complex immigration pathways with structured guidance, honest
                timelines, and referral-aware tooling for consultants and
                partners.
              </p>
              <p>
                Whether you are pursuing study, skilled work, business mobility,
                or family reunion, we combine human expertise with a clean digital
                workflow so nothing slips through the cracks.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="scroll-mt-24 border-t border-slate-100 py-16 md:py-20"
          aria-labelledby="services-heading"
        >
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we offer
            </p>
            <h2
              id="services-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
            >
              Services
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
              End-to-end support across strategy, paperwork, and milestone
              tracking.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {SERVICE_ITEMS.map((item) => (
              <Card key={item.title} className="bg-white text-left">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section
          id="benefits"
          className="scroll-mt-24 border-t border-slate-100 py-16 md:py-20"
          aria-labelledby="benefits-heading"
        >
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Why choose us
            </p>
            <h2
              id="benefits-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
            >
              Benefits
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
              Practical advantages you feel from day one — not generic promises.
            </p>
          </div>
          <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
            {BENEFIT_ITEMS.map((text) => (
              <li
                key={text}
                className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left text-sm text-slate-700 md:text-base"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Countries + flags */}
        <section
          id="countries"
          className="scroll-mt-24 mt-auto border-t border-slate-100 py-16 md:py-24"
          aria-labelledby="countries-heading"
        >
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 md:text-xs">
            Destinations
          </p>
          <h2
            id="countries-heading"
            className="mx-auto mt-3 max-w-4xl text-balance text-center text-xl font-extrabold tracking-tight text-slate-900 md:text-3xl lg:text-4xl"
          >
            Countries we provide visa &amp; immigration services for
          </h2>
          <div className="mx-auto mt-5 h-0.5 w-20 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 md:w-28" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-600 md:text-base">
            Popular corridors — we also support additional jurisdictions on
            request.
          </p>

          <ul className="mx-auto mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {COUNTRIES_WITH_FLAGS.map((c) => (
              <li
                key={c.name}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-4 text-center shadow-sm transition hover:border-blue-100 hover:shadow-md"
              >
                <div className="relative h-11 w-[4.5rem] overflow-hidden rounded-md border border-slate-200/80 bg-white shadow-sm md:h-12 md:w-20">
                  <Image
                    src={`https://flagcdn.com/w160/${c.iso2}.png`}
                    alt={`${c.name} flag`}
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </div>
                <span className="mt-2 text-xs font-semibold text-slate-800 md:text-sm">
                  {c.name}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-12 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Worldwide Visa Adviser. All rights reserved.
          </p>
        </section>
      </main>
    </div>
  );
}
