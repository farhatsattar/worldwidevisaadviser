"use client";

import { Card } from "@/components/ui/card";
import { BadgeCheck, ClipboardCheck, FileText, Send } from "lucide-react";
import { processSteps } from "@/content/landing-page-data";
import { Reveal } from "./reveal";

const stepIcons = [Send, FileText, ClipboardCheck, BadgeCheck];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 md:py-20">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3C5D]">
          Process
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
          Dependable and Trustworthy Visa Process
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, idx) => (
          <Reveal key={step.title} delay={idx * 0.08}>
            <Card className="relative h-full border-slate-100">
              {idx < processSteps.length - 1 ? (
                <span className="absolute -right-2 top-10 hidden h-0.5 w-4 bg-[#0B3C5D]/30 lg:block" />
              ) : null}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3C5D] text-sm font-bold text-white">
                {(() => {
                  const StepIcon = stepIcons[idx];
                  return <StepIcon className="h-4 w-4" />;
                })()}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
