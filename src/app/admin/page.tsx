"use client";

import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { isAdminEmail } from "@/lib/admin-config";
import {
  firebaseAuthErrorMessage,
  normalizeAuthEmail,
} from "@/lib/firebase/auth-flow";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  adminAdjustPoints,
  adminDeleteApplication,
  adminListApplications,
  adminListProfiles,
  adminSetVerified,
} from "@/lib/firebase/referrals";

type Row = Awaited<ReturnType<typeof adminListProfiles>>[number];
type AppRow = Awaited<ReturnType<typeof adminListApplications>>[number];

const APPLICATION_FIELD_ORDER: string[] = [
  "email",
  "fullName",
  "country",
  "visaType",
  "referralCode",
  "username",
  "createdAt",
  "nameFatherName",
  "dateOfBirth",
  "placeOfBirth",
  "nationality",
  "fullAddress",
  "cityCountry",
  "gender",
  "whatsAppNumber",
  "phoneNumber",
  "maritalStatus",
  "numberOfChildren",
  "education",
  "profession",
  "ownerEmployer",
  "experience",
  "visaDestinationCountry",
  "travelCountryName",
  "refusalCountryName",
  "visaNotUsedCountryName",
];

function humanizeApplicationField(key: string): string {
  const labels: Record<string, string> = {
    email: "Email",
    fullName: "Full name",
    visaType: "Visa type",
    referralCode: "Referral code (link)",
    nameFatherName: "Name / father name",
    dateOfBirth: "Date of birth",
    placeOfBirth: "Place of birth",
    cityCountry: "City / country",
    whatsAppNumber: "WhatsApp",
    phoneNumber: "Phone",
    maritalStatus: "Marital status",
    numberOfChildren: "Number of children",
    visaDestinationCountry: "Visa destination",
    ownerEmployer: "Owner / employer",
    travelCountryName: "Travel country",
    refusalCountryName: "Refusal country",
    visaNotUsedCountryName: "Visa not used (country)",
    createdAt: "Submitted at",
  };
  return (
    labels[key] ??
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim()
  );
}

function formatApplicationValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    try {
      return (value as { toDate: () => Date }).toDate().toLocaleString();
    } catch {
      return String(value);
    }
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function sortedApplicationKeys(data: Record<string, unknown>): string[] {
  const keys = Object.keys(data);
  const ordered = APPLICATION_FIELD_ORDER.filter((k) => keys.includes(k));
  const rest = keys
    .filter((k) => !APPLICATION_FIELD_ORDER.includes(k))
    .sort();
  return [...ordered, ...rest];
}

export default function AdminPage() {
  const [authReady, setAuthReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<{
    email: string | null;
  } | null>(null);
  const [allowed, setAllowed] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [rows, setRows] = useState<Row[]>([]);
  const [appRows, setAppRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyAppId, setBusyAppId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user ? { email: user.email } : null);
      setAllowed(Boolean(user?.email && isAdminEmail(user.email)));
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, apps] = await Promise.all([
        adminListProfiles(),
        adminListApplications(),
      ]);
      setRows(list);
      setAppRows(apps);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not load data. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady || !allowed) return;
    void load();
  }, [authReady, allowed, load]);

  async function handleAdminLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    const auth = getFirebaseAuth();
    const em = normalizeAuthEmail(loginEmail);
    if (!em || !loginPassword) {
      setLoginError("Enter both email and password.");
      return;
    }
    setLoginBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, em, loginPassword);
      if (!isAdminEmail(cred.user.email)) {
        await signOut(auth);
        setLoginError("This panel is only for the authorized admin account.");
        return;
      }
      setLoginPassword("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setLoginError(firebaseAuthErrorMessage(e.code));
      } else {
        setLoginError(e instanceof Error ? e.message : "Login failed.");
      }
    } finally {
      setLoginBusy(false);
    }
  }

  async function adminLogout() {
    try {
      await signOut(getFirebaseAuth());
    } catch {
      /* ignore */
    }
  }

  async function toggleVerified(code: string, next: boolean) {
    setBusyId(code);
    try {
      await adminSetVerified(code, next);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function bumpPoints(code: string, delta: number) {
    setBusyId(code);
    try {
      await adminAdjustPoints(code, delta);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Points update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteApplication(docId: string) {
    if (
      !window.confirm(
        "Permanently delete this registration submission? This cannot be undone.",
      )
    ) {
      return;
    }
    setBusyAppId(docId);
    try {
      await adminDeleteApplication(docId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyAppId(null);
    }
  }

  const deniedOtherUser =
    authReady &&
    firebaseUser?.email &&
    !isAdminEmail(firebaseUser.email);

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
        ]}
      />

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
            <p className="mt-1 text-sm text-slate-600">
              Only the designated admin account can open this panel.
            </p>
          </div>
          {allowed ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => load()}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => void adminLogout()}
                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
              >
                Admin logout
              </button>
            </div>
          ) : null}
        </div>

        {!authReady ? (
          <p className="text-sm text-slate-500">Checking session…</p>
        ) : null}

        {authReady && deniedOtherUser ? (
          <Card className="border-amber-200 bg-amber-50 p-6">
            <p className="font-semibold text-amber-900">Access denied</p>
            <p className="mt-2 text-sm text-amber-900/90">
              The signed-in account is not authorized as admin.{" "}
              <button
                type="button"
                onClick={() => void adminLogout()}
                className="font-semibold underline"
              >
                Sign out
              </button>{" "}
              and sign in with the admin email.
            </p>
          </Card>
        ) : null}

        {authReady && !firebaseUser?.email ? (
          <Card className="mx-auto max-w-md p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900">Admin sign-in</h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in with the authorized admin email and password.
            </p>
            {loginError ? (
              <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {loginError}
              </p>
            ) : null}
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => void handleAdminLogin(e)}
            >
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
                type="email"
                placeholder="Admin email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username"
                required
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="submit"
                disabled={loginBusy}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {loginBusy ? "Signing in…" : "Sign in as admin"}
              </button>
            </form>
          </Card>
        ) : null}

        {allowed ? (
          <>
            {error ? (
              <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {error}
              </p>
            ) : null}

            <Card className="overflow-x-auto bg-white p-0">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Code</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Username</th>
                    <th className="px-4 py-3 font-semibold">Points</th>
                    <th className="px-4 py-3 font-semibold">Direct</th>
                    <th className="px-4 py-3 font-semibold">Verified</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-slate-500">
                        Loading profiles…
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-slate-500">
                        No profiles yet. Complete{" "}
                        <Link href="/signup" className="text-blue-600 underline">
                          signup
                        </Link>{" "}
                        or open the{" "}
                        <Link href="/dashboard" className="text-blue-600 underline">
                          dashboard
                        </Link>
                        .
                      </td>
                    </tr>
                  ) : (
                    rows.map(({ id, data }) => {
                      const code = data.referralCode ?? id;
                      const busy = busyId === code;
                      return (
                        <tr key={id} className="border-b border-slate-100">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-800">
                            {code}
                          </td>
                          <td className="px-4 py-3 text-slate-800">
                            {data.displayName}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            @{data.username}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {data.pointsTotal ?? 0}
                          </td>
                          <td className="px-4 py-3">
                            {data.directReferralsCount ?? 0}
                          </td>
                          <td className="px-4 py-3">
                            {data.verified ? (
                              <span className="text-emerald-600">Yes</span>
                            ) : (
                              <span className="text-amber-600">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  toggleVerified(code, !data.verified)
                                }
                                className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
                              >
                                {data.verified ? "Unverify" : "Verify"}
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => bumpPoints(code, 5)}
                                className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800 disabled:opacity-50"
                              >
                                +5 pts
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </Card>

            <section className="mt-10">
              <h2 className="text-lg font-bold text-slate-900">
                Registration submissions
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Full signup form data saved when users register. Deleting only removes
                this audit copy — it does not delete the member profile or auth account.
              </p>

              <div className="mt-4 flex flex-col gap-4">
                {loading ? (
                  <p className="text-sm text-slate-500">Loading submissions…</p>
                ) : appRows.length === 0 ? (
                  <Card className="border-dashed border-slate-200 bg-slate-50/80 p-8 text-center text-sm text-slate-600">
                    No registration submissions yet.
                  </Card>
                ) : (
                  appRows.map(({ id, data }) => {
                    const record = data as Record<string, unknown>;
                    const busyDel = busyAppId === id;
                    const summaryEmail = formatApplicationValue(record.email);
                    const summaryName = formatApplicationValue(record.fullName);
                    return (
                      <Card
                        key={id}
                        className="overflow-hidden border border-slate-200 bg-white"
                      >
                        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {summaryName}
                            </p>
                            <p className="truncate text-sm text-slate-600">
                              {summaryEmail}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-slate-400">
                              Doc ID: {id}
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={busyDel || Boolean(busyId)}
                            onClick={() => void deleteApplication(id)}
                            className="shrink-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                          >
                            {busyDel ? "Deleting…" : "Delete submission"}
                          </button>
                        </div>
                        <dl className="grid gap-x-6 gap-y-2 px-4 py-4 text-sm sm:grid-cols-2">
                          {sortedApplicationKeys(record).map((key) => (
                            <div
                              key={key}
                              className="flex flex-col gap-0.5 border-b border-slate-50 pb-2 sm:border-0 sm:pb-0"
                            >
                              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                {humanizeApplicationField(key)}
                              </dt>
                              <dd className="text-slate-800 break-words">
                                {formatApplicationValue(record[key])}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </Card>
                    );
                  })
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
