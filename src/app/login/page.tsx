"use client";

import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import {
  firebaseAuthErrorMessage,
  normalizeAuthEmail,
  sendAuthPasswordReset,
  signInForApp,
} from "@/lib/firebase/auth-flow";
import {
  getStoredActiveProfileCode,
  setStoredActiveProfileCode,
} from "@/lib/referral-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSentMessage, setResetSentMessage] = useState("");

  useEffect(() => {
    const stored = getStoredActiveProfileCode();
    if (stored) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (!email.trim() || !password) {
      setErrorMessage("Enter email and password.");
      return;
    }
    setResetSentMessage("");
    setIsLoggingIn(true);
    try {
      const result = await signInForApp({ email, password });
      if (result.kind === "admin") {
        router.replace("/admin");
        return;
      }
      setStoredActiveProfileCode(result.referralCode);
      router.replace("/dashboard");
    } catch (e) {
      if (e instanceof Error && e.message === "AUTH_PROFILE_MISSING") {
        setErrorMessage(
          "This member account is not complete yet — finish Sign up. Admins should use the designated admin email.",
        );
      } else if (e instanceof FirebaseError) {
        setErrorMessage(firebaseAuthErrorMessage(e.code));
      } else {
        setErrorMessage(
          e instanceof Error ? e.message : "Sign-in failed. Try again.",
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleForgotPassword() {
    setErrorMessage("");
    setResetSentMessage("");
    const em = normalizeAuthEmail(email);
    if (!em) {
      setErrorMessage("Enter your email above, then tap Forgot password.");
      return;
    }
    setIsSendingReset(true);
    try {
      await sendAuthPasswordReset(em);
      setResetSentMessage(
        "If an account exists for that email, a reset link was sent. Check inbox and spam.",
      );
    } catch (e) {
      if (e instanceof FirebaseError) {
        setErrorMessage(firebaseAuthErrorMessage(e.code));
      } else {
        setErrorMessage("Could not send reset email. Try again.");
      }
    } finally {
      setIsSendingReset(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
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
        ]}
        signup={{ label: "Sign up", href: "/signup" }}
      />

      <main className="mx-auto w-full max-w-lg px-5 py-12 md:px-8 md:py-16">
        <Card className="w-full p-6 md:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Log in
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Use the email and password you set when you completed registration.
            Email is normalized (trimmed and lowercased).
          </p>

          {errorMessage ? (
            <p className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          {resetSentMessage ? (
            <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {resetSentMessage}
            </p>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              disabled={isLoggingIn || isSendingReset}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-sky-600 disabled:opacity-60"
            >
              {isLoggingIn ? "Signing in…" : "Log in"}
            </button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              disabled={isLoggingIn || isSendingReset}
              onClick={() => void handleForgotPassword()}
              className="text-sm font-semibold text-blue-600 underline hover:text-blue-800 disabled:opacity-50"
            >
              {isSendingReset ? "Sending…" : "Forgot password?"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            New user?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 underline hover:text-blue-800"
            >
              Create an account
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
