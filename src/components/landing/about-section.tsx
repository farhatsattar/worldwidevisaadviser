"use client";

import Image from "next/image";
import { Reveal } from "./reveal";

const guidanceSteps = [
  {
    step: 1,
    badgeClass: "bg-orange-500 text-white shadow-orange-500/25",
    title: "Choose your visa type",
    description:
      "Determine the right visa type for your travel purpose with expert visa assistance.",
  },
  {
    step: 2,
    badgeClass: "bg-emerald-600 text-white shadow-emerald-600/25",
    title: "Contact our branches",
    description:
      "Start your transaction by applying at our branches for trusted visa and immigration services.",
  },
  {
    step: 3,
    badgeClass: "bg-blue-600 text-white shadow-blue-600/25",
    title: "Prepare and submit your file",
    description:
      "Gather requirements with checklist support, review accuracy with our team, and submit with confidence.",
  },
] as const;

function GuidanceStepCard({
  step,
  badgeClass,
  title,
  description,
  delay,
}: (typeof guidanceSteps)[number] & { delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-md shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10 md:p-7">
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md ${badgeClass}`}
        >
          {step}
        </span>
        <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </article>
    </Reveal>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Background image — visible + light translucent veil */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/image7.jfif"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={95}
          unoptimized
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/72 via-white/48 to-slate-100/55" />
      </div>

      <div className="relative z-[1] mx-auto w-full max-w-6xl px-5 md:px-8">
        {/* Heading area — left aligned */}
        <Reveal>
          <div className="max-w-3xl text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3C5D]">
              Dependable Guidance
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl lg:text-[2.35rem] lg:leading-snug">
              Dependable and Trustworthy Visa &amp; Immigration Guidance
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-8">
              Our seasoned professionals expertly handle complex immigration laws and visa procedures with
              trusted guidance and support.
            </p>
          </div>
        </Reveal>

        {/* Step cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {guidanceSteps.map((item, idx) => (
            <GuidanceStepCard key={item.step} {...item} delay={0.08 + idx * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}
