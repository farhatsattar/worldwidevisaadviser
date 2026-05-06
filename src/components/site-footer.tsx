import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-4 md:px-8">
        <div>
          <h3 className="text-base font-semibold text-white">Contact Us</h3>
          <p className="mt-3 text-sm text-slate-300">+92 3020462372</p>
          <p className="mt-1 text-sm text-slate-300">
            info@worldwidevisaadviser.com
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Explore Link</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Visa Details</li>
            <li>Terms &amp; Conditions</li>
            <li>Services</li>
            <li>Cookies Policy</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Refund &amp; Cancellation</li>
            <li>Referral Program</li>
            <li>Privacy Policy</li>
            <li>About us</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Help</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>FAQs</li>
            <li>Disclaimer</li>
            <li>Countries We Serve</li>
            <li>Blog</li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/"
              aria-label="Facebook"
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              FB
            </Link>
            <Link
              href="/"
              aria-label="Instagram"
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              IG
            </Link>
            <Link
              href="/"
              aria-label="LinkedIn"
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              IN
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-5 py-4 text-center text-xs text-slate-400 md:px-8">
        © 2026 Worldwide Visa Adviser All rights reserved. powered by Stars Studio
      </div>
      <div className="px-5 pb-6 text-center text-xs text-slate-500 md:px-8">
        <Link href="/" className="underline">
          Cookie Preferences
        </Link>
      </div>
    </footer>
  );
}
