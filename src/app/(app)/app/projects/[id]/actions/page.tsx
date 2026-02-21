import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

const PRIORITY_STYLES: Record<string, { label: string; style: string }> = {
  critical: { label: "Kritiek", style: "bg-red-100 text-red-700" },
  high: { label: "Hoog", style: "bg-orange-100 text-orange-700" },
  medium: { label: "Midden", style: "bg-yellow-100 text-yellow-700" },
  low: { label: "Laag", style: "bg-slate-100 text-slate-600" },
};

const STATUS_STYLES: Record<string, { label: string; style: string }> = {
  open: { label: "Open", style: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In uitvoering", style: "bg-violet-100 text-violet-700" },
  completed: { label: "Afgerond", style: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Geannuleerd", style: "bg-slate-100 text-slate-500" },
};

export default async function ActionsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [actionRes, riskRes] = await Promise.all([
    supabase
      .from("actions")
      .select("id, title, description, status, priority, due_date, risk_id, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("risks")
      .select("id, title")
      .eq("project_id", id),
  ]);

  const actions = actionRes.data ?? [];
  const riskMap = new Map((riskRes.data ?? []).map((r) => [r.id, r.title]));

  const openCount = actions.filter((a) => a.status === "open" || a.status === "in_progress").length;
  const completedCount = actions.filter((a) => a.status === "completed").length;
  const overdueCount = actions.filter((a) => {
    if (!a.due_date || a.status === "completed" || a.status === "cancelled") return false;
    return new Date(a.due_date) < new Date();
  }).length;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Acties</h1>
          <p className="text-sm text-slate-500 mt-1">
            Beheersmaatregelen en mitigerende acties voor dit project.
          </p>
        </div>
        <Link
          href={`/app/projects/${id}/setup/manual/step-7`}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-all active:scale-[.98]"
        >
          + Actie toevoegen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Totaal", value: actions.length, color: "text-slate-900" },
          { label: "Actief", value: openCount, color: "text-blue-600" },
          { label: "Afgerond", value: completedCount, color: "text-emerald-600" },
          { label: "Verlopen", value: overdueCount, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {actions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Geen acties gevonden</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Er zijn nog geen beheersmaatregelen gedefinieerd. Voeg acties toe om risico&apos;s actief te beheren.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Actie</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Gekoppeld risico</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Prioriteit</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Deadline</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((a) => {
                  const pr = PRIORITY_STYLES[a.priority] ?? PRIORITY_STYLES.medium;
                  const st = STATUS_STYLES[a.status] ?? STATUS_STYLES.open;
                  const overdue = a.due_date && a.status !== "completed" && a.status !== "cancelled" && new Date(a.due_date) < new Date();
                  return (
                    <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900 truncate max-w-[240px]">{a.title}</p>
                        {a.description && (
                          <p className="text-xs text-slate-400 truncate max-w-[240px] mt-0.5">{a.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 max-w-[180px] truncate">
                        {a.risk_id ? riskMap.get(a.risk_id) ?? "—" : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${pr.style}`}>
                          {pr.label}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-xs ${overdue ? "text-red-600 font-semibold" : "text-slate-600"}`}>
                        {a.due_date ?? "—"}
                        {overdue && <span className="ml-1">⚠</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.style}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
