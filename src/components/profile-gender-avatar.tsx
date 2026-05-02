/**
 * Gender-based avatars from `/public`: avatar1 (male), avatar2 (female).
 * Files live in repo so deploy gets them (JFIF often missing from git — SVG committed).
 */

import Image from "next/image";

/** Paths must match files in `public/`. */
const AVATAR_BY_GENDER = {
  male: "/avatar1.svg",
  female: "/avatar2.svg",
} as const;

export type ProfileGenderAvatarProps = {
  gender?: string | null;
  /** Tailwind size tokens — outer ring diameter */
  size?: "sm" | "nav" | "card" | "hero";
  className?: string;
};

const SIZE_CLASSES = {
  sm: "h-9 w-9 min-h-9 min-w-9",
  nav: "h-11 w-11 min-h-11 min-w-11",
  card: "h-[5.25rem] w-[5.25rem] min-h-[5.25rem] min-w-[5.25rem] md:h-28 md:w-28 md:min-h-28 md:min-w-28",
  hero: "h-28 w-28 min-h-28 min-w-28 md:h-36 md:w-36 md:min-h-36 md:min-w-36",
} as const;

const ACCENT_CLASSES = {
  sm: "shadow-md ring-2 ring-white/90",
  nav: "shadow-xl ring-4 ring-white/90",
  card: "shadow-xl ring-4 ring-white/90",
  hero: "shadow-xl ring-4 ring-white/90",
} as const;

function gradientForGender(g: string): string {
  if (g === "female") return "from-fuchsia-400 via-rose-400 to-indigo-600";
  if (g === "male") return "from-sky-300 via-blue-500 to-indigo-800";
  return "from-slate-400 via-slate-500 to-slate-700";
}

function NeutralSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="38" r="22" fill="white" fillOpacity={0.92} />
      <ellipse cx="50" cy="86" rx="30" ry="18" fill="white" fillOpacity={0.92} />
    </svg>
  );
}

export function normalizeGenderKey(gender: string | null | undefined): string {
  const g = (gender ?? "").toLowerCase().trim();
  if (g === "male") return "male";
  if (g === "female") return "female";
  return "other";
}

function imageSizesForAvatarSize(size: keyof typeof SIZE_CLASSES): string {
  if (size === "sm") return "36px";
  if (size === "nav") return "44px";
  if (size === "hero") return "144px";
  return "112px";
}

export function ProfileGenderAvatar({
  gender,
  size = "card",
  className = "",
}: ProfileGenderAvatarProps) {
  const key = normalizeGenderKey(gender);
  const ring = SIZE_CLASSES[size];
  const accent = ACCENT_CLASSES[size];
  const grad = gradientForGender(key);
  const photoSrc =
    key === "male"
      ? AVATAR_BY_GENDER.male
      : key === "female"
        ? AVATAR_BY_GENDER.female
        : null;

  if (photoSrc) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${accent} ${ring} ${className}`}
        aria-hidden
      >
        <Image
          src={photoSrc}
          alt=""
          fill
          className="object-cover"
          sizes={imageSizesForAvatarSize(size)}
          unoptimized
        />
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-black/15 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex ${ring} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${grad} ${accent} ${className}`}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-[10%] flex items-center justify-center">
        <NeutralSilhouette className="h-full w-full scale-105" />
      </div>
      <span className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}
