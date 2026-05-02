"use client";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { isAdminEmail } from "@/lib/admin-config";
import { getFirebaseAuth, getFirebaseDb } from "./client";

/** Normalize email (trim + lowercase) for sign-in consistency. */
export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** User-facing messages for Auth / datastore client errors. */
export function firebaseAuthErrorMessage(code: string | undefined): string {
  switch (code) {
    case "permission-denied":
      return "Access denied. Try again later or contact support.";
    case "failed-precondition":
      return "Something is not ready yet. Try again later.";
    case "unavailable":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Email sign-in is not enabled for this application.";
    case "auth/email-already-in-use":
      return "This email is already registered. Use Log in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Wrong email or password, or no account found for this email. Try Forgot password or Sign up.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Something went wrong. Try again.";
  }
}

/** Create auth user and map uid → referralCode; rolls back auth user if mapping write fails. */
export async function registerAuthAndLinkProfile(params: {
  email: string;
  password: string;
  referralCode: string;
}): Promise<void> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  const { email, password, referralCode } = params;

  const cred = await createUserWithEmailAndPassword(
    auth,
    normalizeAuthEmail(email),
    password,
  );

  /* Ensure auth token is attached before the mapping write. */
  await auth.authStateReady();
  await cred.user.getIdToken();

  try {
    await setDoc(doc(db, "authProfiles", cred.user.uid), {
      referralCode: referralCode.toUpperCase().trim(),
    });
  } catch (e) {
    try {
      await deleteUser(cred.user);
    } catch {
      /* ignore */
    }
    throw e;
  }
}

export type SignInAppResult =
  | { kind: "admin" }
  | { kind: "member"; referralCode: string };

/** Sign-in: admins skip referral mapping; members need authProfiles + referralCode after signup. */
export async function signInForApp(params: {
  email: string;
  password: string;
}): Promise<SignInAppResult> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  const cred = await signInWithEmailAndPassword(
    auth,
    normalizeAuthEmail(params.email),
    params.password,
  );

  await auth.authStateReady();
  await cred.user.getIdToken();

  if (isAdminEmail(cred.user.email)) {
    return { kind: "admin" };
  }

  const snap = await getDoc(doc(db, "authProfiles", cred.user.uid));
  if (!snap.exists()) {
    await signOut(auth);
    throw new Error("AUTH_PROFILE_MISSING");
  }

  const code = snap.data()?.referralCode;
  if (typeof code !== "string" || code.trim().length < 4) {
    await signOut(auth);
    throw new Error("AUTH_PROFILE_MISSING");
  }

  return { kind: "member", referralCode: code.toUpperCase().trim() };
}

export async function sendAuthPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, normalizeAuthEmail(email));
}

/** Sign out the current auth session. */
export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) await signOut(auth);
}
