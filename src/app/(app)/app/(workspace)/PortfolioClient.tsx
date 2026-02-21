"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Types ─── */

interface Project {
  id: string;
  name: string;
  status: string;
  module_id: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

interface Workspace {
  id: string;
  name: string;
}

interface Props {
  workspace: Workspace;
  plan: string;
  trialEndsAt: string | null;
  projects: Project[];
  fetchError: string | null;
  userRole: string;
}

/* ─── Plan badge config ─── */

const PLAN_CONFIG: Record<string, { label: string; color: string }> = {
  trial: { label: "Trial", color: "bg-amber-100 text-amber-700 border-amber-200" },
  standard: { label: "Standard", color: "bg-slate-100 text-slate-700 border-slate-200" },
  premium: { label: "Premium", color: "bg-accent/10 text-accent border-accent/20" },
  enterprise: { label: "Enterprise", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "Alle statussen" },
  { value: "active", label: "Actief" },
  { value: "draft", label: "Concept" },
  { value: "completed", label: "Afgerond" },
  { value: "archived", label: "Gearchiveerd" },
];

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  archived: "bg-slate-100 text-slate-400 border-slate-200",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Actief",
  draft: "Concept",
  completed: "Afgerond",
  archived: "Gearchiveerd",
};

/* ─── Component ─── */

export default function PortfolioClient({
  workspace,
  plan,
  trialEndsAt,
  projects: initialProjects,
  fetchError,
  userRole,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const planInfo = PLAN_CONFIG[plan] ?? PLAN_CONFIG.trial;

  // Trial days remaining
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86_400_000))
    : null;

  // Filter projects
  const filtered = initialProjects.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.module_id && p.module_id.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${planInfo.color}`}
            >
              {planInfo.label}
              {plan === "trial" && trialDaysLeft !== null && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {trialDaysLeft}d left
                </span>
              )}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {workspace.name} &middot; {initialProjects.length} project{initialProjects.length !== 1 ? "en" : ""}
          </p>
        </div>

        <Link
          href="/app/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover active:scale-[.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New project
        </Link>
      </div>

      {/* Fetch error */}
      {fetchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or module…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            {initialProjects.length === 0 ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">No projects yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Create your first project to get started.
                </p>
                <Link
                  href="/app/projects/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New project
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500">No results found.</p>
                <button
                  onClick={() => { setSearch(""); setStatusFilter("all"); }}
                  className="mt-2 text-sm font-medium text-accent hover:underline"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Project
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                    Module
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">
                    Created
                  </th>
                  <th className="py-3 px-4 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => window.location.href = project.status === 'draft' ? `/app/projects/${project.id}/setup/manual/step-1` : `/app/projects/${project.id}/dashboard`}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium text-slate-900">{project.name}</p>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="text-sm text-slate-500">
                        {project.module_id || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                          STATUS_BADGE[project.status] ?? STATUS_BADGE.draft
                        }`}
                      >
                        {STATUS_LABEL[project.status] ?? project.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-slate-400 hidden lg:table-cell">
                      {new Date(project.created_at).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
