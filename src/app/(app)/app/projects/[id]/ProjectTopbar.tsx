"use client";

import Link from "next/link";

interface Props {
  projectName: string;
  userInitials: string;
  userEmail: string;
  moduleId: string | null;
}

const MODULE_LABELS: Record<string, string> = {
  construction: "Bouw",
  infrastructure: "Infrastructuur",
  energy: "Energie",
  water: "Waterbeheer",
  industry: "Industrie",
  government: "Overheid",
};

export default function ProjectTopbar({ projectName, userInitials, userEmail, moduleId }: Props) {
  const moduleLabel = moduleId ? MODULE_LABELS[moduleId] ?? moduleId : null;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left — Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile back */}
        <Link
          href="/app"
          className="lg:hidden shrink-0 rounded-md p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
          <Link href="/app" className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            Workspace
          </Link>
          <svg className="h-3.5 w-3.5 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="font-semibold text-slate-900 truncate">{projectName}</span>
          {moduleLabel && (
            <span className="ml-2 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 shrink-0">
              {moduleLabel}
            </span>
          )}
        </nav>

        {/* Mobile title */}
        <h1 className="sm:hidden text-sm font-semibold text-slate-900 truncate">
          {projectName}
        </h1>
      </div>

      {/* Right — Notifications + Avatar */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Notificaties"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-white" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2" title={userEmail}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}
