import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDashboardPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, status, setup_status, start_date, end_date")
    .eq("id", id)
    .single();

  if (!project) redirect("/app");

  // If setup not completed, redirect back
  if (project.setup_status !== "completed") {
    redirect(`/app/projects/${id}/setup/manual/step-1`);
  }

  // Gather stats
  const [riskRes, actionRes, stakeholderRes] = await Promise.all([
    supabase.from("risks").select("id, probability, impact, status").eq("project_id", id),
    supabase.from("actions").select("id, status").eq("project_id", id),
    supabase.from("stakeholders").select("id").eq("project_id", id),
  ]);

  const risks = riskRes.data ?? [];
  const actions = actionRes.data ?? [];
  const stakeholders = stakeholderRes.data ?? [];

  const openRisks = risks.filter((r) => r.status === "open").length;
  const highRisks = risks.filter((r) => {
    const score = (r.probability ?? 0) * (r.impact ?? 0);
    return score >= 15;
  }).length;
  const openActions = actions.filter((a) => a.status === "open" || a.status === "in_progress").length;

  const stats = [
    { label: "Risico's", value: risks.length, sub: `${openRisks} open`, color: "text-blue-600 bg-blue-50" },
    { label: "Hoog risico", value: highRisks, sub: "score ≥ 15", color: "text-red-600 bg-red-50" },
    { label: "Acties", value: actions.length, sub: `${openActions} actief`, color: "text-orange-600 bg-orange-50" },
    { label: "Stakeholders", value: stakeholders.length, sub: "geregistreerd", color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            All projects
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {project.start_date && project.end_date && (
              <span className="text-xs text-slate-400">
                {project.start_date} — {project.end_date}
              </span>
            )}
            <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Actief
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color.split(" ")[0]}`}>
              {s.value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Risk summary table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Risicoregister
          </h2>
          <span className="text-xs text-slate-400">
            Top risico&apos;s op score
          </span>
        </div>
        {risks.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Nog geen risico&apos;s geregistreerd.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-2.5 px-4 font-medium text-slate-600">Risico</th>
                  <th className="text-center py-2.5 px-4 font-medium text-slate-600">Score</th>
                  <th className="text-left py-2.5 px-4 font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {risks
                  .map((r) => ({ ...r, _score: (r.probability ?? 0) * (r.impact ?? 0) }))
                  .sort((a, b) => b._score - a._score)
                  .slice(0, 10)
                  .map((r) => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-2.5 px-4 text-slate-900">Risico</td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            r._score >= 15
                              ? "bg-red-100 text-red-700"
                              : r._score >= 10
                              ? "bg-orange-100 text-orange-700"
                              : r._score >= 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {r._score}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 capitalize">{r.status}</td>
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
