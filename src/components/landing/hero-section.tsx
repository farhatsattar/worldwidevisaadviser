"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  applyHref: string;
};

export function HeroSection({ applyHref }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative mt-8 w-full overflow-hidden shadow-[0_24px_60px_rgba(11,60,93,0.14)]"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/image3.jfif"
          alt="Professional visa consultancy"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-slate-100/25" />
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-slate-100/92 via-slate-100/72 to-transparent md:w-[62%]" />

      <div className="relative min-h-[540px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="px-6 py-14 text-left md:max-w-[52%] md:px-14"
        >
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-black md:text-6xl">
            Worldwide Visa Consulting
          </h1>
          <p className="mt-4 max-w-3xl text-xl font-semibold text-black md:text-2xl">
            Smart Guidance for a Successful Visa Journey
          </p>
          <ul className="mt-6 space-y-2 text-base font-medium text-black md:text-lg">
            {[
              "Expert Legal Support",
              "Meeting Your Unique Visa Needs",
              "Tailored Immigration Solutions",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap justify-start gap-3">
            <Button
              href={applyHref}
              className="bg-none bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Apply Now
            </Button>
            <Button
              href="#contact"
              variant="secondary"
              className="border-slate-300 bg-white text-black hover:bg-slate-50"
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
