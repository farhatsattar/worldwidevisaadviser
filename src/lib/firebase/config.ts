/** Client app config from `NEXT_PUBLIC_*` environment variables. */

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

export function getFirebaseClientConfig(): FirebaseClientConfig {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  const missing = [
    !apiKey && "NEXT_PUBLIC_FIREBASE_API_KEY",
    !authDomain && "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    !projectId && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    !storageBucket && "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    !messagingSenderId && "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    !appId && "NEXT_PUBLIC_FIREBASE_APP_ID",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}.`);
  }

  return {
    apiKey: apiKey!,
    authDomain: authDomain!,
    projectId: projectId!,
    storageBucket: storageBucket!,
    messagingSenderId: messagingSenderId!,
    appId: appId!,
    ...(measurementId ? { measurementId } : {}),
  };
}
