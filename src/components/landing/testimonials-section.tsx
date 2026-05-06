"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/content/landing-page-data";

const featuredTestimonials = testimonials.slice(0, 2);

function TrustpilotHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#00B67A]"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Reviewed on
          </span>
          <span className="text-xl font-bold tracking-tight text-[#191919] md:text-[1.35rem]">
            Trustpilot
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-0.5 pl-11 sm:pl-0" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="h-[18px] w-[18px] fill-[#00B67A] md:h-5 md:w-5"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

const cardEase = [0.25, 0.1, 0.25, 1] as const;

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="rounded-[20px] bg-[#F5F7FA] px-6 py-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] md:px-10 md:py-16 lg:px-14 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16 xl:gap-20">
          <div className="order-2 flex flex-col gap-8 overflow-visible md:order-2 md:col-start-2 md:row-start-1">
            {featuredTestimonials.map((item, idx) => (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, x: 72 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.08, margin: "0px -40px -60px -40px" }}
                transition={{
                  duration: 0.85,
                  ease: cardEase,
                  delay: idx * 0.18,
                }}
                className="flex min-h-[280px] flex-col rounded-[20px] border border-slate-100/80 bg-white shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12),0_4px_16px_-4px_rgba(15,23,42,0.06)] md:min-h-[300px]"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{
                    y: { type: "spring", stiffness: 380, damping: 28 },
                  }}
                  className="flex flex-1 flex-col rounded-[20px] p-8 md:p-10 lg:p-11"
                >
                  <TrustpilotHeader />
                  <p className="mt-8 flex-1 text-[17px] leading-[1.75] tracking-[0.01em] text-slate-700 md:text-lg md:leading-[1.8]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-8 text-base font-medium text-slate-900">
                    {item.name}
                    <span className="font-normal text-slate-500">
                      {" "}
                      · {item.role}
                    </span>
                  </p>
                </motion.div>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="order-1 md:order-1 md:col-start-1 md:row-start-1 md:flex md:flex-col md:justify-start md:pt-0 md:text-left"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: cardEase }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3C5D]">
              Testimonials
            </p>
            <h2 className="mt-3 text-pretty text-[2rem] font-bold leading-[1.12] tracking-tight text-[#0a2744] sm:text-[2.25rem] md:mt-2 md:text-[2.75rem] md:leading-[1.1] lg:text-[3.15rem] lg:leading-[1.08]">
              Happy Clients Reflect on Their Successful Visa &amp; Immigration
              Journey with Us
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-lg font-medium leading-relaxed text-slate-700 md:text-xl">
              Explore the World with Confidence
            </p>
            <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-slate-600 md:text-lg">
              20+ Countries, Trusted Visa Guidance
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
