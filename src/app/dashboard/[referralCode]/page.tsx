"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { PublicProfileAvatar } from "@/components/public-profile-avatar";
import {
  fetchPublicMemberDashboard,
  type ProfileDoc,
  type PublicReferralHighlight,
} from "@/lib/firebase/referrals";
import { getStoredActiveProfileCode } from "@/lib/referral-store";
import { MAX_REWARD_POINTS } from "@/lib/referrals/system-config";

function IconCopy({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      <path d="M16.5 8.25h1.125c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H9.75" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3 3 0 0 1 0 5.75" />
    </svg>
  );
}

export default function PublicMemberDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const rawCode = typeof params?.referralCode === "string" ? params.referralCode : "";
  const code = rawCode.trim().toUpperCase();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileDoc | null>(null);
  const [effectivePoints, setEffectivePoints] = useState(0);
  const [rankTitle, setRankTitle] = useState("");
  const [referrals, setReferrals] = useState<PublicReferralHighlight[]>([]);
  const [copiedReferralCode, setCopiedReferralCode] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = getStoredActiveProfileCode();
    if (stored && code && stored.toUpperCase() === code) {
      router.replace("/dashboard");
    }
  }, [code, router]);

  useEffect(() => {
    let mounted = true;
    if (!code) {
      setLoading(false);
      setNotFound(true);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await fetchPublicMemberDashboard(code);
        if (!mounted) return;
        if (!data) {
          setProfile(null);
          setNotFound(true);
          return;
        }
        setProfile(data.profile);
        setEffectivePoints(data.effectivePoints);
        setRankTitle(data.rankTitle);
        setReferrals(data.referrals);
      } catch {
        if (mounted) {
          setProfile(null);
          setNotFound(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [code]);

  const rankingTowardCap = Math.min(effectivePoints, MAX_REWARD_POINTS);
  const rankingBarPct = Math.min(
    100,
    Math.max(0, (rankingTowardCap / MAX_REWARD_POINTS) * 100),
  );

  const displayedReferralCode = profile?.referralCode ?? code;

  const copyReferralCode = useCallback(async () => {
    const c = displayedReferralCode;
    if (!c || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(c);
      setCopiedReferralCode(true);
      window.setTimeout(() => setCopiedReferralCode(false), 2000);
    } catch {
      /* ignore */
    }
  }, [displayedReferralCode]);

  const openWhatsAppInvite = useCallback(() => {
    if (!displayedReferralCode || typeof window === "undefined") return;
    const inviteUrl = `${window.location.origin}/signup?ref=${encodeURIComponent(displayedReferralCode)}`;
    const msg = `Join Worldwide Visa Adviser with my referral link:\n${inviteUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [displayedReferralCode]);

  const signupWithRef = useMemo(
    () => `/signup?ref=${encodeURIComponent(displayedReferralCode)}`,
    [displayedReferralCode],
  );

  return (
    <div className="min-h-screen wva-page-bg">
      <Navbar
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Referral Program", href: "/#leaders" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
        ]}
        signup={{ label: "Join with this code", href: signupWithRef }}
        cta={{ label: "Log in", href: "/login" }}
      />

      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-12">
        {notFound && !loading ? (
          <Card className="p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">Member not found</p>
            <p className="mt-2 text-sm text-slate-600">
              This referral code is invalid or the profile is unavailable.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to home
            </Link>
          </Card>
        ) : null}

        {!notFound || loading ? (
          <section
            className="rounded-3xl bg-[#f5f7fb] p-4 shadow-sm md:p-6"
            style={{ fontFamily: "Inter, Poppins, system-ui, sans-serif" }}
          >
            <Card className="border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-[0_16px_38px_rgba(37,99,235,0.28)] md:p-8">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative shrink-0">
                    {loading ? (
                      <div className="h-36 w-36 animate-pulse rounded-full bg-white/30" />
                    ) : profile ? (
                      <PublicProfileAvatar
                        displayName={profile.displayName}
                        gender={profile.gender}
                        size="hero"
                        className="!shadow-xl !ring-4 !ring-white/70"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                      Member dashboard
                    </p>
                    <h1 className="text-2xl font-bold md:text-3xl">
                      {loading ? "…" : profile?.displayName ?? "Member"}
                    </h1>
                    <p className="mt-1 text-sm text-blue-100">
                      @{profile?.username ?? "—"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                        {profile?.verified ? "Verified" : "Pending"}
                      </span>
                      <span className="rounded-full bg-indigo-900/45 px-3 py-1 text-xs font-semibold">
                        Top rated
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-blue-100">Referral code:</span>
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 font-mono text-xs font-semibold text-white ring-1 ring-white/30">
                        {loading ? "…" : displayedReferralCode || "—"}
                        <button
                          type="button"
                          onClick={() => void copyReferralCode()}
                          disabled={!displayedReferralCode || loading}
                          className="rounded p-1 text-white/90 transition hover:bg-white/20 hover:text-white disabled:opacity-40"
                          aria-label={
                            copiedReferralCode ? "Copied referral code" : "Copy referral code"
                          }
                          title={copiedReferralCode ? "Copied!" : "Copy referral code"}
                        >
                          <IconCopy className="h-3.5 w-3.5" />
                        </button>
                      </span>
                      {copiedReferralCode ? (
                        <span className="text-xs font-semibold text-emerald-200">Copied!</span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm text-blue-100">
                      Want to join using this member&apos;s referral?
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={signupWithRef}
                        className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 shadow-md transition hover:bg-blue-50"
                      >
                        Join with this code
                      </Link>
                      <button
                        type="button"
                        onClick={openWhatsAppInvite}
                        disabled={!displayedReferralCode || loading}
                        className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 disabled:opacity-50"
                      >
                        Share on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/15 px-6 py-5 text-left backdrop-blur-sm lg:text-right">
                  <p className="text-4xl font-extrabold leading-none md:text-5xl">
                    {loading ? "…" : rankingTowardCap}{" "}
                    <span className="text-2xl font-semibold text-blue-100">
                      / {MAX_REWARD_POINTS}
                    </span>
                  </p>
                  <p className="mt-2 text-sm font-medium text-blue-100">
                    {loading ? "…" : `${Math.round(rankingBarPct)}% of maximum reached`}
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-7">
              <Card className="rounded-2xl bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col items-center">
                  <div
                    className="grid h-24 w-24 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(#2563eb 0deg, #2563eb ${Math.max(3, rankingBarPct * 3.6).toFixed(1)}deg, #e2e8f0 ${Math.max(3, rankingBarPct * 3.6).toFixed(1)}deg 360deg)`,
                    }}
                  >
                    <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-white text-lg font-bold text-slate-800">
                      {loading ? "…" : `${Math.round(rankingBarPct)}%`}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Total Points: {loading ? "…" : rankingTowardCap}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                    {loading ? "…" : rankTitle}
                  </span>

                  <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        title: "Domestic Tour",
                        current: Math.min(rankingTowardCap, 20),
                        total: 20,
                        bar: "bg-blue-500",
                      },
                      {
                        title: "International Tour",
                        current: Math.min(rankingTowardCap, 52),
                        total: 52,
                        bar: "bg-blue-400",
                      },
                      {
                        title: "Business Tour",
                        current: Math.min(rankingTowardCap, 116),
                        total: 116,
                        bar: "bg-blue-300",
                      },
                      {
                        title: "Business Opportunity",
                        current: Math.min(rankingTowardCap, 200),
                        total: 200,
                        bar: "bg-blue-200",
                      },
                    ].map((item) => {
                      const pct = Math.max(0, Math.min(100, (item.current / item.total) * 100));
                      return (
                        <div
                          key={item.title}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-semibold text-slate-700">
                              {item.title}
                            </p>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {item.current}/{item.total}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <div className="mt-6">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <IconUsers className="h-5 w-5 text-slate-500" />
                  <h2 className="text-lg font-bold text-slate-900">Referrals Made</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <Card
                        key={`pub-ref-sk-${idx}`}
                        className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-center shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                      >
                        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-slate-200" />
                      </Card>
                    ))
                  ) : referrals.length === 0 ? (
                    <Card className="col-span-full rounded-2xl border border-slate-100 bg-white px-4 py-6 text-center shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                      <p className="text-sm text-slate-500">No public referrals listed yet.</p>
                    </Card>
                  ) : (
                    referrals.slice(0, 6).map((item) => (
                      <Card
                        key={item.id}
                        className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-center shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                      >
                        <div className="mx-auto w-fit">
                          <PublicProfileAvatar
                            displayName={item.inviteeName || ""}
                            gender={item.inviteeGender}
                            size="nav"
                            className="!ring-2 !ring-slate-100"
                          />
                        </div>
                        <p className="mt-3 text-xs font-semibold text-emerald-600">
                          {item.verified ? "Active" : "Pending"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {item.inviteeName || "Member"}
                        </p>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              This is a public profile view.{" "}
              <Link href="/login" className="font-semibold text-blue-600 underline">
                Log in
              </Link>{" "}
              to manage your own dashboard.
            </p>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
