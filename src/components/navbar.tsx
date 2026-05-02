"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileGenderAvatar } from "@/components/profile-gender-avatar";
import { Button } from "@/components/ui/button";

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

export function Navbar({ items, signup, cta, session }: NavbarProps) {
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
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900";
  const mobileLinkClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="flex items-center justify-between gap-3 py-3 md:py-4">
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 md:flex-none md:gap-3"
            onClick={closeMobile}
          >
            <Image
              src="/logo.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 shadow-md drop-shadow-sm"
              priority
            />
            <span className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              Worldwide Visa Adviser
            </span>
          </Link>

          <nav
            className="hidden flex-wrap items-center justify-end gap-1 md:flex lg:gap-2"
            aria-label="Main"
          >
            {items.map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} className={desktopLinkClass}>
                {item.icon ? <NavLinkIcon type={item.icon} /> : null}
                {item.label}
              </Link>
            ))}
            {signup ? (
              <Button
                href={signup.href}
                variant="secondary"
                className="ml-1 shrink-0 bg-white px-4 text-xs sm:px-5 sm:text-sm"
              >
                {signup.label}
              </Button>
            ) : null}
            {cta ? (
              <Button
                href={cta.href}
                className="ml-1 shrink-0 px-4 text-xs sm:ml-2 sm:px-5 sm:text-sm"
              >
                {cta.label}
              </Button>
            ) : null}
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
            </div>
            {signup ? (
              <div className="mt-3 px-1">
                <Button
                  href={signup.href}
                  variant="secondary"
                  className="w-full justify-center px-4 py-3 text-sm"
                >
                  {signup.label}
                </Button>
              </div>
            ) : null}
            {cta ? (
              <div className="mt-2 px-1">
                <Button href={cta.href} className="w-full justify-center px-4 py-3 text-sm">
                  {cta.label}
                </Button>
              </div>
            ) : null}
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
