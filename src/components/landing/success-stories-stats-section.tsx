"use client";

import { animate, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ClipboardList, FileText, Star, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type StatCard = {
  icon: LucideIcon;
  iconWrapClass: string;
  iconClass: string;
  countTarget: number;
  countMode: "plus" | "kPlus";
  label: string;
};

const stats: StatCard[] = [
  {
    icon: FileText,
    iconWrapClass: "bg-[#FFE8DC] shadow-inner shadow-orange-100/50",
    iconClass: "text-[#C2410C]",
    countTarget: 20,
    countMode: "plus",
    label: "Visa Categories",
  },
  {
    icon: ClipboardList,
    iconWrapClass: "bg-[#E0F2FE] shadow-inner shadow-sky-100/60",
    iconClass: "text-[#0369A1]",
    countTarget: 30,
    countMode: "kPlus",
    label: "Visa Process",
  },
  {
    icon: Star,
    iconWrapClass: "bg-[#FEF3C7] shadow-inner shadow-amber-100/60",
    iconClass: "text-[#B45309]",
    countTarget: 100,
    countMode: "kPlus",
    label: "Successful Project",
  },
  {
    icon: Users,
    iconWrapClass: "bg-[#EDE9FE] shadow-inner shadow-violet-100/60",
    iconClass: "text-[#6D28D9]",
    countTarget: 180,
    countMode: "kPlus",
    label: "Pro Consultants",
  },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function AnimatedStatValue({
  target,
  mode,
  staggerDelay,
  prefersReducedMotion,
}: {
  target: number;
  mode: "plus" | "kPlus";
  staggerDelay: number;
  prefersReducedMotion: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35, margin: "-40px 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const controls = animate(0, target, {
      duration: 2.25,
      delay: staggerDelay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, target, staggerDelay, prefersReducedMotion]);

  const formatted = mode === "plus" ? `${value}+` : `${value}K+`;

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
    </span>
  );
}

export function SuccessStoriesStatsSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background — left anchor, zyada transparent veil */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/image8.jfif"
          alt=""
          fill
          className="object-cover object-[14%_72%] md:object-[10%_68%] lg:object-[8%_65%]"
          sizes="100vw"
          quality={95}
          unoptimized
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/38 via-white/26 to-slate-50/32" />
      </div>

      <div className="relative z-[1] mx-auto max-w-6xl px-5 md:px-8">
        <header className="max-w-4xl">
          <h2 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0B3C5D] md:text-4xl lg:text-[2.35rem] lg:leading-snug">
            Our Success Stories Behind Our Trusted Visa &amp; Immigration Services
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-8">
            Helping families reunite by successfully securing spouse visas through trusted immigration experts.
          </p>
        </header>

        <div className="mt-14 md:mt-16">
          {/* Alag cards — join / gap-px grid nahi */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:gap-7">
            {stats.map(
              (
                { icon: Icon, iconWrapClass, iconClass, countTarget, countMode, label },
                index,
              ) => (
              <article
                key={label}
                className="flex flex-col items-center rounded-2xl border border-slate-200/75 bg-white/92 px-6 py-10 text-center shadow-[0_12px_36px_rgba(15,23,42,0.07)] backdrop-blur-[1px] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)] sm:px-8 sm:py-12 md:items-start md:px-10 md:py-14 md:text-left"
              >
                <div
                  className={`flex size-[4.5rem] shrink-0 items-center justify-center rounded-full md:size-[5rem] ${iconWrapClass}`}
                >
                  <Icon className={`size-8 md:size-9 ${iconClass}`} strokeWidth={1.75} aria-hidden />
                </div>
                <p className="mt-8 text-5xl font-black tracking-tight text-[#0B3C5D] md:mt-10 md:text-6xl">
                  <AnimatedStatValue
                    target={countTarget}
                    mode={countMode}
                    staggerDelay={index * 0.12}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 md:text-xs">
                  {label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
