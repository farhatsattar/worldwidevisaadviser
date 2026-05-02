import type { RankId } from "./system-config";
import {
  LEVEL_TIERS,
  RANKS,
  REWARD_MILESTONES,
  UNVERIFIED_POINTS_EXPIRY_DAYS,
} from "./system-config";

export type ProfileLike = {
  pointsTotal: number;
  verified: boolean;
  createdAt?: Date | null;
  directReferralsCount?: number;
};

export function profileAgeDays(createdAt: Date | null | undefined): number {
  if (!createdAt || Number.isNaN(createdAt.getTime())) return 0;
  return (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
}

/** Spec: unverified referral credit expires after 10 days (rewards/ranks); totals kept for audit in Firestore. */
export function getEffectiveRewardPoints(profile: ProfileLike): number {
  if (profile.verified) return profile.pointsTotal;
  const age = profileAgeDays(profile.createdAt ?? null);
  if (age <= UNVERIFIED_POINTS_EXPIRY_DAYS) return profile.pointsTotal;
  return 0;
}

export function computeRank(profile: ProfileLike): RankId {
  const pts = getEffectiveRewardPoints(profile);
  const directs = profile.directReferralsCount ?? 0;
  let current: RankId = "classic";
  for (const row of RANKS) {
    if (pts >= row.minEffectivePoints && directs >= row.minDirectReferrals) {
      current = row.id;
    }
  }
  return current;
}

export function computeUnlockedLevels(profile: ProfileLike): boolean[] {
  const pts = getEffectiveRewardPoints(profile);
  const directs = profile.directReferralsCount ?? 0;
  return LEVEL_TIERS.map(
    (t) =>
      directs >= t.unlockDirectRefs || pts >= t.unlockPoints,
  );
}

export function nextRewardProgress(effectivePoints: number): {
  nextLabel: string | null;
  nextTarget: number | null;
  prevThreshold: number;
} {
  let prev = 0;
  for (const m of REWARD_MILESTONES) {
    if (effectivePoints < m.points) {
      return {
        nextLabel: m.label,
        nextTarget: m.points,
        prevThreshold: prev,
      };
    }
    prev = m.points;
  }
  return { nextLabel: null, nextTarget: null, prevThreshold: prev };
}

export function rankLabel(id: RankId): string {
  return RANKS.find((r) => r.id === id)?.label ?? id;
}
