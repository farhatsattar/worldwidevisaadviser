/** Points awarded up the sponsor chain on each verified signup event (depth 0 = direct). */
export const REFERRAL_POINTS_BY_DEPTH = [5, 2, 1, 1] as const;

/** Reward tiers — points never reset for verified users; progress uses effective points. */
export const REWARD_MILESTONES = [
  { points: 20, label: "Domestic Tour" },
  { points: 52, label: "International Tour" },
  { points: 116, label: "Business Tour" },
  { points: 200, label: "Business Opportunity" },
] as const;

export const MAX_REWARD_POINTS =
  REWARD_MILESTONES[REWARD_MILESTONES.length - 1].points;

export type RankId = "classic" | "gold" | "platinum" | "super_platinum";

/** Rank ladder — exact names for UI copy */
export const RANK_SYSTEM_NAMES =
  "Classic, Gold, Platinum, Super Platinum." as const;

export const RANKS: {
  id: RankId;
  label: string;
  minEffectivePoints: number;
  minDirectReferrals: number;
}[] = [
  { id: "classic", label: "Classic", minEffectivePoints: 0, minDirectReferrals: 0 },
  { id: "gold", label: "Gold", minEffectivePoints: 40, minDirectReferrals: 5 },
  { id: "platinum", label: "Platinum", minEffectivePoints: 120, minDirectReferrals: 15 },
  {
    id: "super_platinum",
    label: "Super Platinum",
    minEffectivePoints: 220,
    minDirectReferrals: 35,
  },
];

/** Days until unverified users lose referral credit toward rewards/ranks */
export const UNVERIFIED_POINTS_EXPIRY_DAYS = 10;

/** Four unlock levels — UI + gamification (structure-based). */
export const LEVEL_TIERS = [
  {
    level: 1,
    title: "Classic",
    unlockDirectRefs: 0,
    unlockPoints: 0,
  },
  {
    level: 2,
    title: "Gold",
    unlockDirectRefs: 3,
    unlockPoints: 30,
  },
  {
    level: 3,
    title: "Platinum",
    unlockDirectRefs: 10,
    unlockPoints: 90,
  },
  {
    level: 4,
    title: "Super Platinum",
    unlockDirectRefs: 25,
    unlockPoints: 180,
  },
] as const;
