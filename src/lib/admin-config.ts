/** Authorized admin email for `/admin`; override with `NEXT_PUBLIC_ADMIN_EMAIL`. */

const DEFAULT_ADMIN_EMAIL = "worldwidevisaadviser.com@gmail.com";

export function getAdminEmail(): string {
  const raw =
    typeof process.env.NEXT_PUBLIC_ADMIN_EMAIL === "string"
      ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.trim()
      : "";
  return (raw || DEFAULT_ADMIN_EMAIL).toLowerCase();
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  return email.trim().toLowerCase() === getAdminEmail();
}
