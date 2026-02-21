"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Projects", href: "/app", exact: true },
  { label: "Team", href: "/app/team" },
  { label: "Billing", href: "/app/billing" },
  { label: "Settings", href: "/app/settings" },
];

interface Props {
  displayName: string;
  initials: string;
  email: string;
}

export default function WorkspaceTopbar({ displayName, initials, email }: Props) {
  const pathname = usePathname();

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if ((item as any).exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white pl-0 pr-3 sm:pr-4">
      <div className="flex items-center gap-8">
        <Link href="/app" className="flex items-center gap-2">
          <img src="/logo.svg" alt="RiskBases" className="h-8" />
          <span className="text-lg font-bold text-navy">RiskBases</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(item)
                  ? "bg-accent/10 text-accent"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-700 leading-tight">{displayName}</p>
          <p className="text-xs text-slate-400 leading-tight">{email}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="rounded-lg px-2 py-1.5 text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}
