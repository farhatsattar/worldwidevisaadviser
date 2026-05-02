"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "./client";
import {
  computeRank,
  computeUnlockedLevels,
  getEffectiveRewardPoints,
  nextRewardProgress,
  rankLabel,
  type ProfileLike,
} from "@/lib/referrals/compute";
import { REFERRAL_POINTS_BY_DEPTH } from "@/lib/referrals/system-config";
import type { RegistrationApplicationValues } from "@/lib/registration-application-fields";

function applicationExtrasForFirestore(app: RegistrationApplicationValues) {
  return {
    nameFatherName: app.nameFatherName.trim(),
    dateOfBirth: app.dateOfBirth,
    placeOfBirth: app.placeOfBirth.trim(),
    nationality: app.nationality.trim(),
    fullAddress: app.fullAddress.trim(),
    cityCountry: app.cityCountry.trim(),
    gender: app.gender,
    whatsAppNumber: app.whatsAppNumber.trim(),
    phoneNumber: app.phoneNumber.trim(),
    maritalStatus: app.maritalStatus,
    numberOfChildren: Number(app.numberOfChildren),
    education: app.education.trim(),
    profession: app.profession.trim(),
    ownerEmployer: app.ownerEmployer.trim(),
    experience: app.experience.trim(),
    visaDestinationCountry: app.visaDestinationCountry.trim(),
    travelCountryName: app.travelCountryName.trim(),
    refusalCountryName: app.refusalCountryName.trim(),
    visaNotUsedCountryName: app.visaNotUsedCountryName.trim(),
  };
}

export type ProfileDoc = {
  referralCode: string;
  username: string;
  displayName: string;
  parentReferralCode: string | null;
  pointsTotal: number;
  verified: boolean;
  rank: string;
  directReferralsCount: number;
  /** From registration: male | female | other */
  gender?: string;
  createdAt?: Timestamp | null;
};

function toDate(ts: Timestamp | undefined | null): Date | null {
  return ts?.toDate?.() ?? null;
}

function randomReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export async function submitRegistrationWithReferral(params: {
  email: string;
  username?: string;
  referralCode: string | null;
  application: RegistrationApplicationValues;
}): Promise<{
  inviteeReferralCode: string;
  directReferrerPointsAfter: number;
}> {
  const db = getFirebaseDb();
  const { email, referralCode, application } = params;
  const fullName = application.nameFatherName.trim();
  const country = application.cityCountry.trim();
  const visaType = application.visaType.trim();
  const username =
    (params.username?.trim() || email.split("@")[0] || "user")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24) || `user_${Date.now()}`;

  await addDoc(collection(db, "applications"), {
    email: email.toLowerCase().trim(),
    fullName,
    country,
    visaType,
    referralCode,
    username,
    createdAt: serverTimestamp(),
    ...applicationExtrasForFirestore(application),
  });

  let newCode = "";
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = randomReferralCode();
    const taken = await getDoc(doc(db, "profiles", candidate));
    if (!taken.exists()) {
      newCode = candidate;
      break;
    }
  }
  if (!newCode) {
    throw new Error("Could not allocate referral code — retry.");
  }

  if (!referralCode?.trim()) {
    await setDoc(doc(db, "profiles", newCode), {
      referralCode: newCode,
      username,
      displayName: fullName.trim(),
      parentReferralCode: null,
      pointsTotal: 0,
      verified: false,
      rank: "classic",
      directReferralsCount: 0,
      gender: application.gender.trim().toLowerCase(),
      createdAt: serverTimestamp(),
    });
    return { inviteeReferralCode: newCode, directReferrerPointsAfter: 0 };
  }

  const rootCode = referralCode.toUpperCase().trim();

  await runTransaction(db, async (transaction) => {
    const ancestorRefs: { code: string; docRef: ReturnType<typeof doc> }[] =
      [];
    let cur: string | null = rootCode;

    for (let depth = 0; depth < REFERRAL_POINTS_BY_DEPTH.length && cur; depth++) {
      const pref = doc(db, "profiles", cur);
      const snap = await transaction.get(pref);
      if (!snap.exists()) {
        throw new Error("Referral code invalid or profile missing.");
      }
      ancestorRefs.push({ code: cur, docRef: pref });
      const parent = snap.data() as DocumentData;
      cur = (parent.parentReferralCode as string | null) ?? null;
    }

    ancestorRefs.forEach((node, depth) => {
      const delta = REFERRAL_POINTS_BY_DEPTH[depth];
      const updates: Record<string, unknown> = {
        pointsTotal: increment(delta),
      };
      if (depth === 0) {
        updates.directReferralsCount = increment(1);
      }
      transaction.update(node.docRef, updates);
    });

    transaction.set(doc(db, "profiles", newCode), {
      referralCode: newCode,
      username,
      displayName: fullName.trim(),
      parentReferralCode: rootCode,
      pointsTotal: 0,
      verified: false,
      rank: "classic",
      directReferralsCount: 0,
      gender: application.gender.trim().toLowerCase(),
      createdAt: serverTimestamp(),
    });
  });

  const rootSnapAfter = await getDoc(doc(db, "profiles", rootCode));
  const directReferrerPointsAfter =
    (rootSnapAfter.data()?.pointsTotal as number) ?? 0;

  await addDoc(
    collection(db, "profiles", rootCode, "receivedReferrals"),
    {
      inviteeEmail: email.toLowerCase().trim(),
      inviteeName: fullName.trim(),
      inviteeReferralCode: newCode,
      inviteeGender: application.gender.trim().toLowerCase(),
      verified: false,
      createdAt: serverTimestamp(),
    },
  );

  /** Explicit tree edge: sponsor → direct invitee (query/render subtree). */
  await setDoc(doc(db, "profiles", rootCode, "downline", newCode), {
    childReferralCode: newCode,
    displayName: fullName.trim(),
    inviteeEmail: email.toLowerCase().trim(),
    createdAt: serverTimestamp(),
  });

  return {
    inviteeReferralCode: newCode,
    directReferrerPointsAfter,
  };
}

export async function getReferralPointsForCode(code: string): Promise<number> {
  const snap = await getProfileSnapshot(code);
  if (!snap) return 0;
  return snap.pointsTotal;
}

async function getProfileSnapshot(code: string): Promise<ProfileDoc | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, "profiles", code.toUpperCase().trim()));
  if (!snap.exists()) return null;
  return snap.data() as ProfileDoc;
}

export type ReceivedReferralRow = {
  id: string;
  inviteeEmail: string;
  inviteeName: string;
  inviteeReferralCode: string;
  inviteeGender?: string;
  verified: boolean;
  createdAt: string | null;
};

export type ReferralTreeNode = {
  code: string;
  displayName: string;
  /** From profile doc — drives avatar on dashboard tree */
  gender?: string;
  children: ReferralTreeNode[];
};

export async function fetchReferralSubtree(
  profileReferralCode: string,
  maxDepth: number,
): Promise<ReferralTreeNode | null> {
  const upper = profileReferralCode.toUpperCase().trim();
  const profile = await getProfileSnapshot(upper);
  if (!profile) return null;

  const node: ReferralTreeNode = {
    code: upper,
    displayName: profile.displayName ?? upper,
    gender:
      typeof profile.gender === "string" ? profile.gender : undefined,
    children: [],
  };

  if (maxDepth <= 0) return node;

  const db = getFirebaseDb();
  const downSnap = await getDocs(
    collection(db, "profiles", upper, "downline"),
  );

  for (const edge of downSnap.docs) {
    const childCode = edge.id;
    const sub = await fetchReferralSubtree(childCode, maxDepth - 1);
    if (sub) node.children.push(sub);
  }

  return node;
}

export async function fetchDashboardSnapshot(
  profileReferralCode: string,
): Promise<{
  profile: ProfileDoc | null;
  effectivePoints: number;
  rankId: ReturnType<typeof computeRank>;
  rankTitle: string;
  levelsUnlocked: boolean[];
  rewardProgress: ReturnType<typeof nextRewardProgress>;
  referrals: ReceivedReferralRow[];
  verifiedReferralsCount: number;
  unverifiedReferralsCount: number;
}> {
  const upper = profileReferralCode.toUpperCase().trim();

  const raw = await getProfileSnapshot(upper);
  const db = getFirebaseDb();
  const qRef = query(
    collection(db, "profiles", upper, "receivedReferrals"),
    orderBy("createdAt", "desc"),
    limit(50),
  );
  const received = await getDocs(qRef);

  const referrals: ReceivedReferralRow[] = received.docs.map((d) => {
    const x = d.data();
    const ts = x.createdAt as Timestamp | undefined;
    return {
      id: d.id,
      inviteeEmail: String(x.inviteeEmail ?? ""),
      inviteeName: String(x.inviteeName ?? ""),
      inviteeReferralCode: String(x.inviteeReferralCode ?? ""),
      inviteeGender:
        typeof x.inviteeGender === "string" ? x.inviteeGender : undefined,
      verified: Boolean(x.verified),
      createdAt: ts?.toDate?.()?.toISOString() ?? null,
    };
  });

  let verifiedReferralsCount = 0;
  let unverifiedReferralsCount = 0;
  referrals.forEach((r) => {
    if (r.verified) verifiedReferralsCount += 1;
    else unverifiedReferralsCount += 1;
  });

  if (!raw) {
    return {
      profile: null,
      effectivePoints: 0,
      rankId: "classic",
      rankTitle: rankLabel("classic"),
      levelsUnlocked: [true, false, false, false],
      rewardProgress: nextRewardProgress(0),
      referrals: [],
      verifiedReferralsCount: 0,
      unverifiedReferralsCount: 0,
    };
  }

  const profileLike: ProfileLike = {
    pointsTotal: raw.pointsTotal ?? 0,
    verified: raw.verified ?? false,
    createdAt: toDate(raw.createdAt as Timestamp | undefined),
    directReferralsCount: raw.directReferralsCount ?? 0,
  };

  const effectivePoints = getEffectiveRewardPoints(profileLike);
  const rankId = computeRank(profileLike);

  return {
    profile: raw,
    effectivePoints,
    rankId,
    rankTitle: rankLabel(rankId),
    levelsUnlocked: computeUnlockedLevels(profileLike),
    rewardProgress: nextRewardProgress(effectivePoints),
    referrals,
    verifiedReferralsCount,
    unverifiedReferralsCount,
  };
}

export type VerifiedLeaderboardEntry = {
  referralCode: string;
  displayName: string;
  pointsTotal: number;
  gender?: string;
};

/** Public leaderboard: verified profiles only, sorted by lifetime points (desc). */
export async function fetchVerifiedLeaderboard(
  maxEntries = 10,
): Promise<VerifiedLeaderboardEntry[]> {
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, "profiles"));
  return snap.docs
    .map((d) => d.data() as ProfileDoc)
    .filter((p) => p.verified === true)
    .sort((a, b) => (b.pointsTotal ?? 0) - (a.pointsTotal ?? 0))
    .slice(0, maxEntries)
    .map((p) => ({
      referralCode: String(p.referralCode ?? ""),
      displayName: String(
        (p.displayName || p.username || p.referralCode || "Member").trim(),
      ),
      pointsTotal: Math.max(0, Number(p.pointsTotal) || 0),
      gender: typeof p.gender === "string" ? p.gender : undefined,
    }));
}

/** Admin: list all profiles (used by `/admin`). */
export async function adminListProfiles(): Promise<
  { id: string; data: ProfileDoc & { id: string } }[]
> {
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, "profiles"));
  return snap.docs.map((d) => ({
    id: d.id,
    data: { ...(d.data() as ProfileDoc), id: d.id },
  }));
}

export async function adminSetVerified(
  profileReferralCode: string,
  verified: boolean,
): Promise<void> {
  const db = getFirebaseDb();
  const upper = profileReferralCode.toUpperCase().trim();
  await updateDoc(doc(db, "profiles", upper), {
    verified,
    verifiedAt: verified ? serverTimestamp() : null,
  });
}

export async function adminAdjustPoints(
  profileReferralCode: string,
  delta: number,
): Promise<void> {
  const db = getFirebaseDb();
  const upper = profileReferralCode.toUpperCase().trim();
  await updateDoc(doc(db, "profiles", upper), {
    pointsTotal: increment(delta),
  });
}

/** Admin: signup submission audit rows (`applications` collection). */
export async function adminListApplications(): Promise<
  { id: string; data: DocumentData }[]
> {
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, "applications"));
  const rows = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
  rows.sort((a, b) => {
    const ta =
      (a.data.createdAt as Timestamp | undefined)?.toMillis?.() ?? 0;
    const tb =
      (b.data.createdAt as Timestamp | undefined)?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return rows;
}

export async function adminDeleteApplication(
  applicationDocId: string,
): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "applications", applicationDocId.trim()));
}
