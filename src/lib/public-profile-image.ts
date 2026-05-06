/**
 * Maps member display names to files under `public/images/` when filenames match known people.
 * Longer phrases first so partial names don't steal the wrong image.
 */
const NAME_TO_IMAGE: { match: string; src: string }[] = [
  { match: "zain malik", src: "/images/zain1.jfif" },
  { match: "abdul ghaffar", src: "/images/ghaffar.jpg" },
  { match: "muhammad shahid", src: "/images/image1.jfif" },
  { match: "hamza", src: "/images/hamza.jfif" },
  { match: "nadeem", src: "/images/nadeem.jfif" },
  { match: "zain", src: "/images/zain1.jfif" },
  { match: "ghaffar", src: "/images/ghaffar.jpg" },
  { match: "shahid", src: "/images/image1.jfif" },
];

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Returns `/images/...` path if `displayName` matches a known public image, else `null`. */
export function resolvePublicProfileImageSrc(displayName: string): string | null {
  const n = normalizeName(displayName);
  if (!n) return null;
  const sorted = [...NAME_TO_IMAGE].sort((a, b) => b.match.length - a.match.length);
  for (const { match, src } of sorted) {
    if (n.includes(match)) return src;
  }
  return null;
}
