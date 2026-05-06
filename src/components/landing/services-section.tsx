"use client";

import { Briefcase, BriefcaseBusiness, GraduationCap, House, Plane } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./reveal";

type VisaItem = {
  title: string;
  description: string;
  icon: typeof Plane;
  iconBg: string;
  iconColor: string;
};

const visaCards: VisaItem[] = [
  {
    title: "Tourist Visa",
    description:
      "Visit new destinations with guided documentation support and clear eligibility checks from our expert team.",
    icon: Plane,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    title: "Commercial Visa",
    description:
      "Expand your business journey globally with complete file handling, compliance guidance, and smooth processing.",
    icon: BriefcaseBusiness,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    title: "Student Visa",
    description:
      "Start your study abroad journey with proper documentation guidance and eligibility support from our consultants.",
    icon: GraduationCap,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    title: "Residence Visa",
    description:
      "Get long-term settlement support with complete application review, compliance checks, and expert consultation.",
    icon: House,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Working Visa",
    description:
      "Move forward in your career with guided work visa processing, profile assessment, and document handling.",
    icon: Briefcase,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const topLeftCards = visaCards.slice(0, 2);
const bottomRowCards = visaCards.slice(2, 5);

/** All cards use the same size layout: two on top-left and three along the bottom row. */
function VisaSquareCard({ item, delay }: { item: VisaItem; delay: number }) {
  const Icon = item.icon;
  return (
    <Reveal delay={delay}>
      <article className="flex aspect-square w-full min-w-0 flex-col rounded-xl border border-slate-100 bg-white/95 p-2.5 shadow-[0_10px_26px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)] sm:rounded-2xl sm:p-3 md:p-3.5">
        <div
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${item.iconBg}`}
        >
          <Icon className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${item.iconColor}`} />
        </div>
        <h3 className="mt-2 text-[11px] font-bold leading-tight text-slate-900 sm:text-xs md:text-[13px]">
          {item.title}
        </h3>
        <p className="mt-1.5 flex-1 overflow-hidden text-[9px] leading-snug text-slate-600 line-clamp-4 sm:text-[10px] md:text-[11px] md:leading-relaxed md:line-clamp-5">
          {item.description}
        </p>
      </article>
    </Reveal>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-20">
      <div className="relative mt-8 min-h-[480px] w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-[0_24px_60px_rgba(11,60,93,0.14)] md:min-h-[540px] lg:min-h-[580px]">
        <Image
          src="/images/image4.jpg"
          alt=""
          fill
          className="z-0 object-cover object-right"
          sizes="100vw"
          quality={100}
          unoptimized
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/92 via-white/35 to-white/15 lg:bg-gradient-to-r lg:from-white/94 lg:via-white/45 lg:to-transparent" />

        <div className="relative z-[2] flex min-h-[inherit] flex-col p-5 pb-36 md:p-8 md:pb-40 lg:pb-44">
          <Reveal>
            <h2 className="max-w-xl text-3xl font-extrabold capitalize leading-tight text-slate-900 md:text-4xl">
              Visa types and eligibility assessment
            </h2>
          </Reveal>

          {/* Top-left: two side-by-side cards with width close to the bottom row cards */}
          <div className="mt-6 flex flex-row flex-wrap justify-start gap-2 sm:gap-3 md:gap-3 lg:pointer-events-auto">
            {topLeftCards.map((item, idx) => (
              <div key={item.title} className="w-[min(46vw,190px)] shrink-0 sm:w-[200px] md:w-[208px]">
                <VisaSquareCard item={item} delay={idx * 0.06} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row: three cards aligned to the right side */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-white/50 via-white/12 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4 md:px-6 md:pt-12 lg:pointer-events-auto xl:px-8">
          <div className="ml-auto w-full max-w-3xl">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:items-end">
              {bottomRowCards.map((item, idx) => (
                <div
                  key={item.title}
                  className={
                    idx === bottomRowCards.length - 1
                      ? "relative z-[4] min-w-0 lg:translate-x-1 xl:translate-x-2"
                      : "min-w-0"
                  }
                >
                  <VisaSquareCard item={item} delay={(idx + 2) * 0.06} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
