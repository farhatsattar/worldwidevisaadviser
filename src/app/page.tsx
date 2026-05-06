import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { AboutSection } from "@/components/landing/about-section";
import { ContactSection } from "@/components/landing/contact-section";
import { HeroSection } from "@/components/landing/hero-section";
import { ProcessSection } from "@/components/landing/process-section";
import { SuccessStoriesStatsSection } from "@/components/landing/success-stories-stats-section";
import { ServicesSection } from "@/components/landing/services-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { TeamProfileGridSection } from "@/components/landing/team-profile-grid-section";
import { COUNTRIES_WITH_FLAGS } from "@/content/landing-data";
import Image from "next/image";

const signupHrefPrimary =
  process.env.NEXT_PUBLIC_PUBLIC_REFERRAL_CODE?.trim()
    ? `/signup?ref=${process.env.NEXT_PUBLIC_PUBLIC_REFERRAL_CODE.trim()}`
    : "/signup";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col wva-page-bg">
      <Navbar
        items={[
          { label: "Home", href: "#hero" },
          { label: "Services", href: "#services" },
          { label: "Referral Program", href: "#leaders" },
          { label: "About", href: "#about" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "#contact" },
          { label: "Login", href: "/login" },
        ]}
        signup={{ label: "Join Us", href: "/signup" }}
        cta={{ label: "Book Appointment", href: signupHrefPrimary }}
      />

      <HeroSection applyHref={signupHrefPrimary} />

      <main className="flex w-full flex-1 flex-col px-5 md:px-8">
        <section id="leaders">
          <TeamProfileGridSection />
        </section>
        <ServicesSection />
        <AboutSection />
        <ProcessSection />
        <SuccessStoriesStatsSection />
        <section id="countries" className="py-14 md:py-16">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3C5D]">
            Countries We Serve
          </p>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 md:text-4xl">
            Make Your Choice for the Preferred Immigration Destination
          </h2>
          <ul className="mx-auto mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {COUNTRIES_WITH_FLAGS.map((c) => (
              <li
                key={c.name}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-4 text-center shadow-sm"
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
        </section>
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
