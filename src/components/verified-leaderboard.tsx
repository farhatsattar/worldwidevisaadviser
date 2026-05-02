"use client";

import { useCallback, useEffect, useState } from "react";
import { ProfileGenderAvatar } from "@/components/profile-gender-avatar";
import {
  fetchVerifiedLeaderboard,
  type VerifiedLeaderboardEntry,
} from "@/lib/firebase/referrals";

export function VerifiedLeaderboard() {
  const [entries, setEntries] = useState<VerifiedLeaderboardEntry[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await fetchVerifiedLeaderboard(10);
      setEntries(rows);
    } catch {
      setEntries([]);
      setError("Unable to load leaderboard right now.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const count = entries?.length ?? 0;

  if (entries === null) {
    return (
      <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex w-36 flex-col items-center text-center"
          >
            <div className="h-[4.5rem] w-[4.5rem] animate-pulse rounded-full bg-slate-200 ring-4 ring-white" />
            <div className="mt-3 h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="mx-auto mt-12 max-w-lg text-center text-sm text-rose-600">
        {error}{" "}
        <button
          type="button"
          onClick={() => void load()}
          className="font-semibold text-blue-600 underline hover:text-blue-800"
        >
          Retry
        </button>
      </p>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
        <p className="text-base font-medium text-slate-800">
          No verified members on the leaderboard yet
        </p>
        <p className="mt-2 text-sm text-slate-500">
          When an account is marked verified in the system, it appears here
          automatically — ranked by referral points. One member or many, only real
          verified profiles are listed.
        </p>
      </div>
    );
  }

  return (
    <ul
      className={`mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-10 gap-y-12 ${
        count <= 3 ? "md:gap-x-16 md:gap-y-14" : ""
      }`}
    >
      {entries.map((row, index) => (
        <li
          key={row.referralCode}
          className={`flex flex-col items-center text-center ${
            count === 1 ? "w-full max-w-[280px]" : "w-[10rem] sm:w-[11rem]"
          }`}
        >
          <div className="relative">
            <span className="absolute -right-1 -top-1 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white shadow-md ring-2 ring-white">
              {index + 1}
            </span>
            <ProfileGenderAvatar gender={row.gender} size="card" />
          </div>
          <p className="mt-4 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
            {row.displayName}
          </p>
          <p className="mt-1 text-xs font-semibold text-blue-600">
            {row.pointsTotal.toLocaleString()} pts
          </p>
        </li>
      ))}
    </ul>
  );
}
