import Image from "next/image";
import type { ProfileGenderAvatarProps } from "@/components/profile-gender-avatar";
import { ProfileGenderAvatar } from "@/components/profile-gender-avatar";
import { resolvePublicProfileImageSrc } from "@/lib/public-profile-image";

type Size = NonNullable<ProfileGenderAvatarProps["size"]>;

const PHOTO_DIM: Record<Size, string> = {
  sm: "h-9 w-9 min-h-9 min-w-9",
  nav: "h-11 w-11 min-h-11 min-w-11",
  card: "h-[5.25rem] w-[5.25rem] min-h-[5.25rem] min-w-[5.25rem] md:h-28 md:w-28 md:min-h-28 md:min-w-28",
  hero: "h-28 w-28 min-h-28 min-w-28 md:h-36 md:w-36 md:min-h-36 md:min-w-36",
};

const IMAGE_SIZES: Record<Size, string> = {
  sm: "36px",
  nav: "44px",
  card: "112px",
  hero: "144px",
};

type Props = {
  displayName: string;
  gender?: string | null;
  size?: Size;
  className?: string;
};

export function PublicProfileAvatar({
  displayName,
  gender,
  size = "nav",
  className = "",
}: Props) {
  const src = resolvePublicProfileImageSrc(displayName);
  const dim = PHOTO_DIM[size];

  if (src) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full shadow-md ring-2 ring-white/90 ${dim} ${className}`}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-center"
          sizes={IMAGE_SIZES[size]}
          unoptimized
        />
      </div>
    );
  }

  return <ProfileGenderAvatar gender={gender} size={size} className={className} />;
}
