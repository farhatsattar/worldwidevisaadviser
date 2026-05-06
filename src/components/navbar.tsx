"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileGenderAvatar } from "@/components/profile-gender-avatar";

export type NavItemIcon = "leaderboard" | "dashboard";

export type NavItem = {
  label: string;
  href: string;
  icon?: NavItemIcon;
};

function IconLeaderboard({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M4 14h4v6H4v-6zm6-5h4v11h-4V9zm6-4h4v15h-4V5z" />
    </svg>
  );
}

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 13h6V5H4v8zm0 6h6v-4H4v4zm8 0h8v-8h-8v8zm0-14v6h8V5h-8z" />
    </svg>
  );
}

function NavLinkIcon({ type }: { type: NavItemIcon }) {
  const cls = "h-4 w-4 shrink-0 opacity-80";
  if (type === "leaderboard") return <IconLeaderboard className={cls} />;
  return <IconDashboard className={cls} />;
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconLocation({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

type NavbarProps = {
  items: NavItem[];
  signup?: {
    label: string;
    href: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  session?: {
    initials: string;
    displayName?: string;
    gender?: string | null;
    onLogout: () => void;
  };
};

export function Navbar({ items, session }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
  }

  const desktopLinkClass =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-[#0B3C5D]/10 hover:text-[#0B3C5D]";
  const mobileLinkClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-[#0B3C5D]/10";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="border-b border-slate-300 bg-slate-100 text-black">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] font-medium md:px-8 md:text-xs">
          <span>Help Desk : +92 3020462372</span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-black">
            <span className="inline-flex items-center gap-1.5">
              <IconClock className="h-3.5 w-3.5 text-emerald-400" />
              Monday - Saturday 09:00 am - 06:00 Pm
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconLocation className="h-3.5 w-3.5 text-emerald-400" />
              Sadiq Arcade Beside Amanah Mall Model Town Link Road Lahore
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="flex items-center justify-between gap-3 py-3 md:py-4">
          <Link
            href="/"
            className="flex min-w-0 flex-1 flex-col items-start justify-center md:flex-none"
            onClick={closeMobile}
          >
            <span className="truncate text-base font-extrabold tracking-wide text-black sm:text-xl md:text-2xl">
              Worldwide Visa Adviser
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 sm:text-[11px]">
              VISA ADVISR &amp; BUSINESS PROMOTER
            </span>
          </Link>

          <nav
            className="hidden flex-wrap items-center justify-end gap-1 md:flex lg:gap-1.5"
            aria-label="Main"
          >
            {items.map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} className={desktopLinkClass}>
                {item.icon ? <NavLinkIcon type={item.icon} /> : null}
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#0B3C5D]/10 hover:text-[#0B3C5D]"
              aria-label="Search"
            >
              <IconSearch className="h-4 w-4" />
              Search
            </button>
            {session ? (
              <div className="ml-2 flex shrink-0 items-center gap-2 border-l border-slate-200 pl-3 sm:ml-3 sm:gap-3 sm:pl-4">
                <div
                  className="relative shrink-0 shadow-md"
                  title={session.displayName ?? "Dashboard user"}
                >
                  <ProfileGenderAvatar
                    gender={session.gender}
                    size="nav"
                    className="!ring-2 !ring-white"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1 text-[9px] font-bold uppercase text-white shadow ring-2 ring-white">
                    {session.initials.slice(0, 2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={session.onLogout}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:text-sm"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <IconClose className="h-6 w-6" />
            ) : (
              <IconMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileOpen ? (
          <nav
            id="mobile-nav-menu"
            className="border-t border-slate-100 pb-4 pt-2 md:hidden"
            aria-label="Mobile main"
          >
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <Link
                  key={`m-${item.href}-${item.label}`}
                  href={item.href}
                  className={mobileLinkClass}
                  onClick={closeMobile}
                >
                  {item.icon ? <NavLinkIcon type={item.icon} /> : null}
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                className={mobileLinkClass}
                aria-label="Search"
              >
                <IconSearch className="h-5 w-5" />
                Search
              </button>
            </div>
            {session ? (
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3 px-3">
                  <ProfileGenderAvatar
                    gender={session.gender}
                    size="nav"
                    className="!ring-2 !ring-white"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {session.displayName ?? "Account"}
                    </p>
                    <p className="text-xs text-slate-500">Signed in</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    session.onLogout();
                  }}
                  className="mx-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
