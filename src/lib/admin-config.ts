/** Authorized admin emails for `/admin`; override with `NEXT_PUBLIC_ADMIN_EMAIL` (comma-separated). */

const DEFAULT_ADMIN_EMAIL = "worldwidevisaadviser.com@gmail.com";

function parseAdminEmails(): string[] {
  const raw =
    typeof process.env.NEXT_PUBLIC_ADMIN_EMAIL === "string"
      ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.trim()
      : "";
  if (!raw) return [DEFAULT_ADMIN_EMAIL.toLowerCase()];
  const parts = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return parts.length > 0 ? parts : [DEFAULT_ADMIN_EMAIL.toLowerCase()];
}

/** First admin email (e.g. display); prefer `parseAdminEmails()` or `isAdminEmail` for checks. */
export function getAdminEmail(): string {
  return parseAdminEmails()[0]!;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  const normalized = email.trim().toLowerCase();
  return parseAdminEmails().includes(normalized);
}
