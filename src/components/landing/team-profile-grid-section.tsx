"use client";

import Image from "next/image";
import { teamProfileMembers } from "@/content/team-profile-grid-data";
import { Reveal } from "./reveal";

/** Har leader — yellow / red / blue circular background (rotate). */
const avatarHalos = [
  "bg-[#F9A826]",
  "bg-red-500",
  "bg-blue-600",
] as const;

export function TeamProfileGridSection() {
  return (
    <section
      id="team"
      className="rounded-3xl border border-slate-100 bg-white px-5 py-12 shadow-sm md:px-8 md:py-14"
    >
      <Reveal className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
          Top Leaders
        </h2>
      </Reveal>

      <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-7">
        {teamProfileMembers.map((member, idx) => (
          <li key={member.name} className="w-full">
            <Reveal delay={idx * 0.06} className="w-full">
              <article className="flex h-full w-full flex-col items-center rounded-2xl bg-white px-6 py-6 text-center shadow-md shadow-slate-200/90 ring-1 ring-slate-100 transition duration-300 ease-out will-change-transform hover:scale-[1.04] hover:shadow-xl hover:shadow-slate-300/80 hover:ring-slate-200/90 md:px-7">
                <div
                  className={`relative shrink-0 rounded-full p-[6px] shadow-md shadow-slate-400/35 sm:p-[7px] ${avatarHalos[idx % avatarHalos.length]}`}
                >
                  <div className="relative h-[104px] w-[104px] overflow-hidden rounded-full shadow-inner ring-[3px] ring-white sm:h-[118px] sm:w-[118px] sm:ring-4">
                    <Image
                      src={member.imageSrc}
                      alt={`${member.name} profile`}
                      width={118}
                      height={118}
                      className="h-full w-full object-cover object-center"
                      sizes="120px"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-orange-500 sm:text-sm">
                  {member.level}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {member.points} Points
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
