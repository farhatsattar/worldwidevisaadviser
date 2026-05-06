"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PublicProfileAvatar } from "@/components/public-profile-avatar";
import { fetchPublicLeaders, type PublicLeaderEntry } from "@/lib/firebase/referrals";
import { Reveal } from "./reveal";

/** Each leader uses a rotating yellow/red/blue circular halo. */
const avatarHalos = [
  "bg-[#F9A826]",
  "bg-red-500",
  "bg-blue-600",
] as const;

export function TeamProfileGridSection() {
  const [members, setMembers] = useState<PublicLeaderEntry[] | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const rows = await fetchPublicLeaders(10);
        if (mountedRef.current) setMembers(rows);
      } catch {
        if (mountedRef.current) setMembers([]);
      }
    })();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const displayMembers = members ?? [];

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
        {members === null
          ? Array.from({ length: 5 }).map((_, idx) => (
              <li key={`skeleton-${idx}`} className="w-full">
                <article className="flex h-full w-full flex-col items-center rounded-2xl bg-white px-6 py-6 text-center shadow-md shadow-slate-200/90 ring-1 ring-slate-100">
                  <div className="h-[104px] w-[104px] animate-pulse rounded-full bg-slate-200 sm:h-[118px] sm:w-[118px]" />
                  <div className="mt-4 h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
                </article>
              </li>
            ))
          : displayMembers.map((member, idx) => (
              <li key={member.referralCode || `${member.displayName}-${idx}`} className="w-full">
                <Reveal delay={idx * 0.06} className="w-full">
                  <Link
                    href={`/dashboard/${encodeURIComponent(member.referralCode)}`}
                    className="block h-full w-full rounded-2xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`Open dashboard for ${member.displayName}`}
                  >
                  <article className="flex h-full w-full flex-col items-center rounded-2xl bg-white px-6 py-6 text-center shadow-md shadow-slate-200/90 ring-1 ring-slate-100 transition duration-300 ease-out will-change-transform hover:scale-[1.04] hover:shadow-xl hover:shadow-slate-300/80 hover:ring-slate-200/90 md:px-7">
                    <div
                      className={`relative shrink-0 rounded-full p-[6px] shadow-md shadow-slate-400/35 sm:p-[7px] ${avatarHalos[idx % avatarHalos.length]}`}
                    >
                      <PublicProfileAvatar
                        displayName={member.displayName}
                        gender={member.gender}
                        size="card"
                        className="!ring-4 !ring-white"
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">
                      {member.displayName}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-orange-500 sm:text-sm">
                      {idx === 0 ? "Top Leader" : "Member"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {member.pointsTotal} Points
                    </p>
                  </article>
                  </Link>
                </Reveal>
              </li>
            ))}
      </ul>
    </section>
  );
}
