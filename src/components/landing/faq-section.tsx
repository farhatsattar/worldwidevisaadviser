"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "What visa and immigration services do you provide?",
    answer:
      "We offer end-to-end support across visitor, student, work, family reunion, and skilled migration pathways—including eligibility reviews, documentation preparation, application filing, interview readiness, and post-decision guidance tailored to your destination country.",
  },
  {
    question: "How does your consultation process work?",
    answer:
      "We begin with a structured consultation to understand your goals, timeline, and background. Our consultants assess program fit, outline clear milestones, and share a transparent roadmap so you always know the next step before any paperwork moves forward.",
  },
  {
    question: "How are your service fees structured?",
    answer:
      "Fees depend on case complexity, destination, and service scope. After the initial review we provide a written breakdown—no surprise charges. You can choose full-service packages or phased support aligned with your budget and comfort level.",
  },
  {
    question: "How do I get started with your team?",
    answer:
      "Book an appointment through our website or contact channel. Share basic profile details and intended destination; we’ll confirm the right consultant, schedule your session, and send a short checklist so your first meeting is productive.",
  },
  {
    question: "What is your typical success rate for visa applications?",
    answer:
      "Outcomes depend on embassy decisions and applicant eligibility—no ethical firm guarantees approvals. We focus on accurate filings, strong documentation, and honest eligibility assessments, which consistently improves clarity and readiness for our clients worldwide.",
  },
  {
    question: "Do you support documentation and compliance throughout the process?",
    answer:
      "Yes. We help organize financial proofs, employment letters, sponsorship evidence, and forms-specific annexes; we also track deadlines and policy updates so your submission stays aligned with current immigration rules.",
  },
];

export function FaqSection() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="rounded-[22px] bg-[#F5F7FA] px-6 py-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] md:px-10 md:py-16 lg:px-14 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <header className="max-w-xl lg:pt-1">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3C5D]">
              FAQs
            </p>
            <h2 className="mt-4 text-pretty text-3xl font-bold leading-[1.12] tracking-tight text-[#0a2744] md:text-4xl lg:text-[2.35rem] lg:leading-[1.1]">
              Common Visa &amp; Immigration Questions Answered by Our Experts
            </h2>
            <p className="mt-6 text-pretty text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Professional visa consulting with clear guidance at every stage—from
              first eligibility check to final submission. We combine immigration
              expertise with meticulous documentation support so you can move
              forward with confidence across borders.
            </p>
            <div className="relative mt-8 aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[20px] border border-slate-200/70 bg-slate-100 shadow-[0_12px_36px_-12px_rgba(15,23,42,0.12)] md:mt-10">
              <Image
                src="/images/image9.jfif"
                alt="Professional visa and immigration consulting support"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 576px"
                unoptimized
              />
            </div>
          </header>

          <div className="flex flex-col gap-4 md:gap-5">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              const panelId = `${baseId}-panel-${index}`;
              const triggerId = `${baseId}-trigger-${index}`;

              return (
                <div
                  key={item.question}
                  className="rounded-[20px] border border-slate-100/90 bg-white px-5 py-5 shadow-[0_8px_28px_-8px_rgba(15,23,42,0.08),0_4px_14px_-6px_rgba(15,23,42,0.05)] transition-shadow duration-300 ease-out hover:shadow-[0_16px_44px_-12px_rgba(15,23,42,0.12),0_6px_18px_-8px_rgba(15,23,42,0.07)] md:px-6 md:py-6"
                >
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0B3C5D]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <span className="min-w-0 pt-0.5 text-base font-semibold leading-snug tracking-tight text-[#0a2744] md:text-[1.05rem] md:leading-snug">
                      {item.question}
                    </span>
                    <span
                      className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-[#0B3C5D] shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-[box-shadow,transform] duration-300 ease-out hover:border-slate-300 hover:shadow-[0_4px_14px_rgba(15,23,42,0.1)] md:size-12"
                      aria-hidden
                    >
                      <Plus
                        strokeWidth={2}
                        className={`absolute size-5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none md:size-[1.35rem] ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
                      />
                      <Minus
                        strokeWidth={2}
                        className={`absolute size-5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none md:size-[1.35rem] ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
                      />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div id={panelId} role="region" aria-labelledby={triggerId} className="overflow-hidden">
                      <p className="border-t border-slate-100 pt-5 text-[15px] leading-[1.75] text-slate-600 md:text-base md:leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
