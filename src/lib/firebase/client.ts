"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseClientConfig } from "./config";

let app: FirebaseApp | undefined;

/**
 * Browser-only Firebase app. Use from client components inside useEffect / handlers,
 * not during the first SSR render (window is undefined there).
 */
export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error(
      "Firebase client must run in the browser. Call getFirebaseApp() from useEffect or event callbacks.",
    );
  }

  if (!app) {
    const config = getFirebaseClientConfig();
    app = getApps().length > 0 ? getApp() : initializeApp(config);
  }

  return app;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
