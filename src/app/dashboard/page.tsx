"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { ProfileGenderAvatar } from "@/components/profile-gender-avatar";
import { PublicProfileAvatar } from "@/components/public-profile-avatar";
import { Card } from "@/components/ui/card";
import { signOutFirebase } from "@/lib/firebase/auth-flow";
import {
  fetchDashboardSnapshot,
  fetchReferralSubtree,
  type ReferralTreeNode,
} from "@/lib/firebase/referrals";
import {
  clearStoredActiveProfileCode,
  getStoredActiveProfileCode,
} from "@/lib/referral-store";
import { profileAgeDays } from "@/lib/referrals/compute";
import {
  LEVEL_TIERS,
  MAX_REWARD_POINTS,
  RANK_SYSTEM_NAMES,
  REWARD_MILESTONES,
  REFERRAL_POINTS_BY_DEPTH,
  UNVERIFIED_POINTS_EXPIRY_DAYS,
} from "@/lib/referrals/system-config";

function IconUser({ className }: { className?: string }) {
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
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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

function avatarInitials(displayName: string | undefined): string {
  const n = displayName?.trim();
  if (!n) return "U";
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase() || "U";
  }
  return n.slice(0, 2).toUpperCase() || "U";
}

function ReferralTreeBranch({ node }: { node: ReferralTreeNode }) {
  return (
    <li className="py-1">
      <div className="flex items-start gap-2 text-sm">
        <PublicProfileAvatar
          displayName={node.displayName}
          gender={node.gender}
          size="sm"
          className="mt-0.5 shrink-0"
        />
        <div className="min-w-0 pt-0.5">
          <span className="font-mono font-semibold text-slate-700">{node.code}</span>
          <span className="text-slate-600"> — {node.displayName}</span>
        </div>
      </div>
      {node.children.length > 0 ? (
        <ul className="ml-4 mt-2 space-y-1 border-l border-slate-200 pl-4">
          {node.children.map((c) => (
            <ReferralTreeBranch key={c.code} node={c} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [storageChecked, setStorageChecked] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [effectivePoints, setEffectivePoints] = useState(0);
  const [rankTitle, setRankTitle] = useState("Classic");
  const [levelsUnlocked, setLevelsUnlocked] = useState<boolean[]>([
    true,
    false,
    false,
    false,
  ]);
  const [referrals, setReferrals] = useState<
    Awaited<ReturnType<typeof fetchDashboardSnapshot>>["referrals"]
  >([]);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [profile, setProfile] = useState<
    Awaited<ReturnType<typeof fetchDashboardSnapshot>>["profile"]
  >(null);
  const [tree, setTree] = useState<ReferralTreeNode | null>(null);
  const [copiedReferralCode, setCopiedReferralCode] = useState(false);

  const reload = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    setActiveCode(getStoredActiveProfileCode());
    setStorageChecked(true);
  }, []);

  useEffect(() => {
    if (!storageChecked) return;
    if (!activeCode) {
      router.replace("/login");
    }
  }, [storageChecked, activeCode, router]);

  useEffect(() => {
    let mounted = true;
    if (!activeCode) {
      setLoading(false);
      setProfile(null);
      setTree(null);
      setEffectivePoints(0);
      setReferrals([]);
      setVerifiedCount(0);
      setUnverifiedCount(0);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      setLoading(true);
      try {
        const snap = await fetchDashboardSnapshot(activeCode);
        if (!mounted) return;
        setProfile(snap.profile);
        setEffectivePoints(snap.effectivePoints);
        setRankTitle(snap.rankTitle);
        setLevelsUnlocked(snap.levelsUnlocked);
        setReferrals(snap.referrals);
        setVerifiedCount(snap.verifiedReferralsCount);
        setUnverifiedCount(snap.unverifiedReferralsCount);

        const subtree = await fetchReferralSubtree(activeCode, 4);
        if (mounted) setTree(subtree);
      } catch {
        if (mounted) {
          setProfile(null);
          setTree(null);
          setEffectivePoints(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [activeCode, refreshKey]);

  async function logout() {
    clearStoredActiveProfileCode();
    setActiveCode(null);
    setProfile(null);
    setTree(null);
    try {
      await signOutFirebase();
    } catch {
      /* ignore */
    }
    reload();
  }

  const expiryDaysLeft = useMemo(() => {
    if (!profile || profile.verified) return null;
    const created = profile.createdAt?.toDate?.() ?? null;
    const age = profileAgeDays(created);
    return Math.max(0, Math.ceil(UNVERIFIED_POINTS_EXPIRY_DAYS - age));
  }, [profile]);

  const rankingTowardCap = Math.min(effectivePoints, MAX_REWARD_POINTS);
  const rankingBarPct = Math.min(
    100,
    Math.max(0, (rankingTowardCap / MAX_REWARD_POINTS) * 100),
  );

  const initials = avatarInitials(profile?.displayName);

  const displayedReferralCode = profile?.referralCode ?? activeCode ?? "";

  async function copyReferralCode() {
    const code = displayedReferralCode;
    if (!code || typeof navigator === "undefined" || !navigator.clipboard)
      return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedReferralCode(true);
      window.setTimeout(() => setCopiedReferralCode(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const showDashboard = Boolean(storageChecked && activeCode);

  function openWhatsAppInvite() {
    if (!displayedReferralCode || typeof window === "undefined") return;
    const inviteUrl = `${window.location.origin}/signup?ref=${encodeURIComponent(displayedReferralCode)}`;
    const msg = `Join Worldwide Visa Adviser with my referral link:\n${inviteUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="min-h-screen wva-page-bg">
      <Navbar
        items={[
          { label: "Home", href: "/" },
          {
            label: "Leaderboard",
            href: "/#leaders",
            icon: "leaderboard",
          },
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: "dashboard",
          },
          { label: "Admin", href: "/admin" },
        ]}
        signup={
          showDashboard
            ? undefined
            : { label: "Sign up", href: "/signup" }
        }
        cta={
          showDashboard ? undefined : { label: "Log in", href: "/login" }
        }
        session={
          showDashboard
            ? {
                initials,
                displayName: profile?.displayName ?? undefined,
                gender: profile?.gender,
                onLogout: logout,
              }
            : undefined
        }
      />

      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-12">
        {!showDashboard ? (
          <p className="text-center text-sm text-slate-500">Redirecting…</p>
        ) : null}

        {showDashboard && profile && !profile.verified && expiryDaysLeft !== null ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Verification required.</strong> Unverified accounts stop
            earning referral credit toward rewards after{" "}
            {UNVERIFIED_POINTS_EXPIRY_DAYS} days. Approx.{" "}
            <strong>{expiryDaysLeft}</strong> day(s) left before referral points
            expire for rewards unless you are verified.
          </div>
        ) : null}

        {showDashboard ? (
          <>
            <section
              className="rounded-3xl bg-[#f5f7fb] p-4 shadow-sm md:p-6"
              style={{ fontFamily: "Inter, Poppins, system-ui, sans-serif" }}
            >
              <Card className="border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-[0_16px_38px_rgba(37,99,235,0.28)] md:p-8">
                <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative">
                      <ProfileGenderAvatar
                        gender={profile?.gender}
                        size="hero"
                        className="ring-4 ring-white/70"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold md:text-3xl">
                        {loading ? "Nadeem" : (profile?.displayName ?? "Nadeem")}
                      </h2>
                      <p className="mt-1 text-sm text-blue-100">
                        @{profile?.username ?? "nadeem"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                          Active
                        </span>
                        <span className="rounded-full bg-indigo-900/45 px-3 py-1 text-xs font-semibold">
                          Top Leader
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-blue-100">Referral code:</span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 font-mono text-xs font-semibold text-white ring-1 ring-white/30">
                          {displayedReferralCode || "—"}
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
                      <button
                        type="button"
                        onClick={openWhatsAppInvite}
                        className="mt-3 inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
                      >
                        Contact on WhatsApp
                      </button>
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
                      {Math.round(rankingBarPct)}% of maximum reached
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
                        background:
                          `conic-gradient(#2563eb 0deg, #2563eb ${Math.max(3, rankingBarPct * 3.6).toFixed(1)}deg, #e2e8f0 ${Math.max(3, rankingBarPct * 3.6).toFixed(1)}deg 360deg)`,
                      }}
                    >
                      <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-white text-lg font-bold text-slate-800">
                        {Math.round(rankingBarPct)}%
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
                              <p className="truncate text-xs font-semibold text-slate-700">{item.title}</p>
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
                    <h4 className="text-lg font-bold text-slate-900">Referrals Made</h4>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, idx) => (
                        <Card
                          key={`ref-skeleton-${idx}`}
                          className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-center shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                        >
                          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-slate-200" />
                          <div className="mx-auto mt-3 h-3 w-16 animate-pulse rounded bg-slate-100" />
                          <div className="mx-auto mt-2 h-4 w-24 animate-pulse rounded bg-slate-200" />
                          <div className="mx-auto mt-2 h-3 w-14 animate-pulse rounded bg-slate-100" />
                        </Card>
                      ))
                    ) : referrals.length === 0 ? (
                      <Card className="col-span-full rounded-2xl border border-slate-100 bg-white px-4 py-6 text-center shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                        <p className="text-sm text-slate-500">
                          No referrals yet for your referral code.
                        </p>
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
                          <p className="mt-1 text-xs text-slate-500">0 Points</p>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <Card className="bg-white text-left">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Referral tree (your network)
                  </h3>
                  <button
                    type="button"
                    onClick={() => reload()}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Refresh tree
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  When someone joins with your code they appear under{" "}
                  <code className="rounded bg-slate-100 px-1">downline</code>.
                  Multi-level points follow the parent referral chain.
                </p>
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  {loading ? (
                    <p className="text-sm text-slate-500">Loading tree…</p>
                  ) : tree ? (
                    <ul className="list-none space-y-1">
                      <ReferralTreeBranch node={tree} />
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Could not load the tree.
                    </p>
                  )}
                </div>
              </Card>
            </section>

          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
