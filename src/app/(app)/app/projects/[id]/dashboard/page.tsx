import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

/* ── Colour helpers ────────────────────────────────────── */
function scoreBadge(score: number) {
  if (score >= 15) return "bg-red-100 text-red-700";
  if (score >= 10) return "bg-orange-100 text-orange-700";
  if (score >= 5) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In uitvoering",
  completed: "Afgerond",
  mitigated: "Gemitigeerd",
  accepted: "Geaccepteerd",
  closed: "Gesloten",
  cancelled: "Geannuleerd",
};

export default async function ProjectDashboardPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, status, setup_status, module_id, start_date, end_date, currency")
    .eq("id", id)
    .single();

  if (!project) redirect("/app");

  // If setup not completed, redirect to setup
  if (project.setup_status !== "completed") {
    redirect(`/app/projects/${id}/setup/manual/step-1`);
  }

  // Gather all stats in parallel
  const [riskRes, actionRes, stakeholderRes, permitRes] = await Promise.all([
    supabase
      .from("risks")
      .select("id, title, category_key, probability, impact, financial_impact_eur, status, created_at")
      .eq("project_id", id),
    supabase.from("actions").select("id, title, status, priority, due_date").eq("project_id", id),
    supabase.from("stakeholders").select("id, name, influence_level, sentiment").eq("project_id", id),
    supabase.from("permits").select("id, permit_type, status").eq("project_id", id),
  ]);

  const risks = riskRes.data ?? [];
  const actions = actionRes.data ?? [];
  const stakeholders = stakeholderRes.data ?? [];
  const permits = permitRes.data ?? [];

  const openRisks = risks.filter((r) => r.status === "open").length;
  const highRisks = risks.filter((r) => (r.probability ?? 0) * (r.impact ?? 0) >= 15).length;
  const mitigatedRisks = risks.filter((r) => r.status === "mitigated" || r.status === "closed").length;
  const openActions = actions.filter((a) => a.status === "open" || a.status === "in_progress").length;
  const overdueActions = actions.filter((a) => {
    if (!a.due_date || a.status === "completed" || a.status === "cancelled") return false;
    return new Date(a.due_date) < new Date();
  }).length;
  const totalExposure = risks.reduce((sum, r) => sum + (r.financial_impact_eur ?? 0), 0);

  // Top risks by score
  const topRisks = risks
    .map((r) => ({ ...r, _score: (r.probability ?? 0) * (r.impact ?? 0) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 8);

  // Recent actions
  const recentActions = actions.slice(0, 5);

  const stats = [
    {
      label: "Totaal risico's",
      value: risks.length,
      sub: `${openRisks} open · ${mitigatedRisks} gemitigeerd`,
      icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Hoog risico",
      value: highRisks,
      sub: "score ≥ 15",
      icon: "M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
      accent: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Acties",
      value: actions.length,
      sub: `${openActions} actief${overdueActions > 0 ? ` · ${overdueActions} verlopen` : ""}`,
      icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      accent: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Stakeholders",
      value: stakeholders.length,
      sub: "geregistreerd",
      icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Vergunningen",
      value: permits.length,
      sub: `${permits.filter((p) => p.status === "approved").length} goedgekeurd`,
      icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
      accent: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Financiële blootstelling",
      value: totalExposure > 0 ? `€${(totalExposure / 1000).toFixed(0)}k` : "€0",
      sub: "totaal risico-exposure",
      icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
      accent: "text-slate-600",
      bg: "bg-slate-100",
    },
  ];

  return (
    <>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Project Overview</h1>
        <div className="flex items-center gap-3 mt-1.5">
          {project.start_date && project.end_date && (
            <span className="text-sm text-slate-500">
              {project.start_date} — {project.end_date}
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.accent}`}>{s.value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
              <div className={`rounded-lg ${s.bg} p-2.5`}>
                <svg className={`h-5 w-5 ${s.accent}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Risk matrix placeholder */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Risicomatrix</h2>
            <Link href={`/app/projects/${id}/risks`} className="text-xs text-accent hover:underline">
              Bekijk alle →
            </Link>
          </div>
          <div className="p-5">
            {/* 5×5 heatmap grid */}
            <div className="grid grid-cols-6 gap-0.5 text-[10px]">
              {/* Y-axis label */}
              <div />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`h-${i}`} className="text-center font-medium text-slate-400 pb-1">{i}</div>
              ))}
              {[5, 4, 3, 2, 1].map((impact) => (
                <>
                  <div key={`y-${impact}`} className="flex items-center justify-center font-medium text-slate-400">
                    {impact}
                  </div>
                  {[1, 2, 3, 4, 5].map((prob) => {
                    const score = prob * impact;
                    const count = risks.filter(
                      (r) => r.probability === prob && r.impact === impact && r.status === "open"
                    ).length;
                    const bg =
                      score >= 15 ? "bg-red-500" : score >= 10 ? "bg-orange-400" : score >= 5 ? "bg-yellow-300" : "bg-green-300";
                    return (
                      <div
                        key={`${prob}-${impact}`}
                        className={`flex items-center justify-center h-10 rounded-sm ${bg} ${
                          count > 0 ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {count > 0 && (
                          <span className="font-bold text-white text-xs drop-shadow-sm">{count}</span>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>← Impact</span>
              <span>Kans →</span>
            </div>
          </div>
        </div>

        {/* Top risks table */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Top risico&apos;s</h2>
            <span className="text-[11px] text-slate-400">Gesorteerd op score</span>
          </div>
          {topRisks.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Nog geen risico&apos;s geregistreerd.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-2.5 px-4 font-medium text-slate-500 text-xs">Risico</th>
                    <th className="text-left py-2.5 px-4 font-medium text-slate-500 text-xs">Categorie</th>
                    <th className="text-center py-2.5 px-4 font-medium text-slate-500 text-xs">Score</th>
                    <th className="text-left py-2.5 px-4 font-medium text-slate-500 text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topRisks.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-900 max-w-[200px] truncate">{r.title}</td>
                      <td className="py-2.5 px-4 text-slate-500 text-xs capitalize">{r.category_key ?? "—"}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreBadge(r._score)}`}>
                          {r._score}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-slate-500">{STATUS_LABEL[r.status] ?? r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent actions */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Recente acties</h2>
            <Link href={`/app/projects/${id}/actions`} className="text-xs text-accent hover:underline">
              Alle acties →
            </Link>
          </div>
          {recentActions.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">Geen acties</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentActions.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                    {a.due_date && (
                      <p className="text-[11px] text-slate-400 mt-0.5">Deadline: {a.due_date}</p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 ml-3 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      a.priority === "critical"
                        ? "bg-red-100 text-red-700"
                        : a.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : a.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stakeholder overview */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Stakeholders</h2>
            <Link href={`/app/projects/${id}/stakeholders`} className="text-xs text-accent hover:underline">
              Overzicht →
            </Link>
          </div>
          {stakeholders.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">Geen stakeholders</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stakeholders.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {s.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-900 truncate">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.sentiment && (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          s.sentiment === "positive" ? "bg-emerald-400" : s.sentiment === "negative" ? "bg-red-400" : "bg-slate-300"
                        }`}
                      />
                    )}
                    {s.influence_level && (
                      <span className="text-[10px] text-slate-400 capitalize">{s.influence_level}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
