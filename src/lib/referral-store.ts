/** Browser storage key — set after registration completes (invitee's referral code). */
export const ACTIVE_PROFILE_STORAGE_KEY = "wva_active_profile_code";

export function getStoredActiveProfileCode(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
  return raw ? raw.toUpperCase().trim() : null;
}

export function setStoredActiveProfileCode(code: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ACTIVE_PROFILE_STORAGE_KEY,
    code.toUpperCase().trim(),
  );
}

export function clearStoredActiveProfileCode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACTIVE_PROFILE_STORAGE_KEY);
}
