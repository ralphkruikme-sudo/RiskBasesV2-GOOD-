/* ─────────────────────────────────────────────────────
   Email confirmation success page.
   Shown after user clicks the link in their email and
   auth callback succeeds, or as a landing page.
   ────────────────────────────────────────────────────── */

import Link from "next/link";

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg
            className="h-8 w-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          We&apos;ve sent you a confirmation link. Click the link in your email
          to activate your account and get started.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
