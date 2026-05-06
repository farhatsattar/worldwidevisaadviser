"use client";

import { FirebaseError } from "firebase/app";
import Link from "next/link";
import {
  type ChangeEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { FormInput } from "@/components/form";
import { RegistrationApplicationFields } from "@/components/form/registration-application-fields";
import {
  firebaseAuthErrorMessage,
  normalizeAuthEmail,
  registerAuthAndLinkProfile,
} from "@/lib/firebase/auth-flow";
import { submitRegistrationWithReferral } from "@/lib/firebase/referrals";
import {
  getStoredActiveProfileCode,
  setStoredActiveProfileCode,
} from "@/lib/referral-store";
import {
  initialRegistrationApplicationValues,
  validateRegistrationApplication,
  type RegistrationApplicationValues,
} from "@/lib/registration-application-fields";
import { REFERRAL_POINTS_BY_DEPTH } from "@/lib/referrals/system-config";

type SignupStep = "signup" | "registration" | "success";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center wva-page-bg px-5 py-12">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = useMemo(
    () => (searchParams.get("ref") ?? "").trim().toUpperCase(),
    [searchParams],
  );

  const [step, setStep] = useState<SignupStep>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [manualReferral, setManualReferral] = useState("");
  const [application, setApplication] = useState<RegistrationApplicationValues>(
    () => ({ ...initialRegistrationApplicationValues }),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sponsorPointsAfter, setSponsorPointsAfter] = useState<number | null>(
    null,
  );
  const [inviteeReferralCode, setInviteeReferralCode] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const stored = getStoredActiveProfileCode();
    if (stored) router.replace("/dashboard");
  }, [router]);

  const hasReferralFromLink = referralFromUrl.length > 0;

  const effectiveReferralCode = useMemo(() => {
    if (hasReferralFromLink) return referralFromUrl;
    const m = manualReferral.trim().toUpperCase();
    return m.length > 0 ? m : null;
  }, [hasReferralFromLink, referralFromUrl, manualReferral]);

  function continueNewRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (!email.trim()) {
      setErrorMessage("Enter your email.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Choose a password of at least 6 characters.");
      return;
    }
    setStep("registration");
  }

  const handleApplicationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setErrorMessage("");
  };

  const submitRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateRegistrationApplication(application);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const emailNorm = normalizeAuthEmail(email);
      const result = await submitRegistrationWithReferral({
        email: emailNorm,
        username: username.trim() || undefined,
        referralCode: effectiveReferralCode,
        application,
      });
      await registerAuthAndLinkProfile({
        email: emailNorm,
        password,
        referralCode: result.inviteeReferralCode,
      });
      setInviteeReferralCode(result.inviteeReferralCode);
      setSponsorPointsAfter(
        effectiveReferralCode ? result.directReferrerPointsAfter : null,
      );
      setStoredActiveProfileCode(result.inviteeReferralCode);
      setStep("success");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setErrorMessage(firebaseAuthErrorMessage(e.code));
      } else {
        const msg =
          e instanceof Error
            ? e.message
            : "Registration could not be submitted.";
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen wva-page-bg">
      <Navbar
        items={[
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
          { label: "Log in", href: "/login" },
        ]}
      />

      <main className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <Card className="w-full p-6 md:p-10">
          {step === "signup" ? (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                New registration only. Enter email and a password (at least 6
                characters), then continue to the full visa-style registration —
                all sections are required.
              </p>

              {hasReferralFromLink ? (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Referral code from link:{" "}
                  <strong className="font-mono">{referralFromUrl}</strong>
                </div>
              ) : null}

              {errorMessage ? (
                <p className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {errorMessage}
                </p>
              ) : null}

              <form className="mt-6 space-y-4" onSubmit={continueNewRegistration}>
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-60"
                >
                  Continue to registration
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 underline hover:text-blue-800"
                >
                  Log in
                </Link>
              </p>
            </>
          ) : null}

          {step === "registration" ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Visa registration — complete details
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Multi-level points (verified users): direct{" "}
                {REFERRAL_POINTS_BY_DEPTH[0]}, second{" "}
                {REFERRAL_POINTS_BY_DEPTH[1]}, third{" "}
                {REFERRAL_POINTS_BY_DEPTH[2]}, fourth{" "}
                {REFERRAL_POINTS_BY_DEPTH[3]}.
              </p>

              {hasReferralFromLink ? (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  Sponsor referral (link):{" "}
                  <strong className="font-mono">{referralFromUrl}</strong>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <label className="block font-medium text-slate-800">
                    Referral code (optional)
                  </label>
                  <input
                    className="mt-2 w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm uppercase outline-none focus:border-blue-400"
                    placeholder="e.g. ABC12XYZ"
                    value={manualReferral}
                    onChange={(e) =>
                      setManualReferral(e.target.value.toUpperCase())
                    }
                    autoComplete="off"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    If someone invited you, enter their code here; otherwise leave
                    it blank.
                  </p>
                </div>
              )}

              <form className="mt-8 space-y-10" onSubmit={submitRegistration}>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 md:p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">
                    Account
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">
                        Email
                      </span>
                      <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                        {email || "—"}
                      </span>
                    </div>
                    <FormInput
                      id="signupUsername"
                      name="signupUsername"
                      label="Username (optional)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Public handle"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <RegistrationApplicationFields
                  values={application}
                  errors={fieldErrors}
                  onChange={handleApplicationChange}
                />

                {errorMessage ? (
                  <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      setStep("signup");
                      setFieldErrors({});
                      setErrorMessage("");
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting…" : "Submit registration"}
                  </button>
                </div>
              </form>
            </>
          ) : null}

          {step === "success" ? (
            <>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Registration Complete
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Your registration has been submitted.
              </p>
              <div className="mt-4 space-y-3 text-left text-sm">
                <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-800">
                  Your referral code:{" "}
                  <strong className="font-mono">{inviteeReferralCode}</strong>
                  <br />
                  <span className="text-xs text-blue-700">
                    Open the dashboard with this code to track progress and
                    rewards.
                  </span>
                </p>
                {effectiveReferralCode ? (
                  <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-800">
                    Points were credited along{" "}
                    <strong>{effectiveReferralCode}</strong>&apos;s referral chain
                    (direct sponsor plus up to three upline levels). Sponsor
                    updated lifetime balance:{" "}
                    <strong>{sponsorPointsAfter ?? 0}</strong> pts.
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-sky-600"
              >
                Go to Dashboard
              </button>
            </>
          ) : null}
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
