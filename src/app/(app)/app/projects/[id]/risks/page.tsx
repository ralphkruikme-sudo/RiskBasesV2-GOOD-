import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

function scoreBadge(score: number) {
  if (score >= 15) return "bg-red-100 text-red-700";
  if (score >= 10) return "bg-orange-100 text-orange-700";
  if (score >= 5) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  open: { label: "Open", style: "bg-blue-100 text-blue-700" },
  mitigated: { label: "Gemitigeerd", style: "bg-emerald-100 text-emerald-700" },
  accepted: { label: "Geaccepteerd", style: "bg-amber-100 text-amber-700" },
  closed: { label: "Gesloten", style: "bg-slate-100 text-slate-600" },
};

export default async function RisksPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: risks } = await supabase
    .from("risks")
    .select("id, title, description, category_key, subcategory_key, probability, impact, financial_impact_eur, schedule_impact_days, status, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const rows = (risks ?? []).map((r) => ({
    ...r,
    _score: (r.probability ?? 0) * (r.impact ?? 0),
  }));

  const openCount = rows.filter((r) => r.status === "open").length;
  const highCount = rows.filter((r) => r._score >= 15).length;
  const avgScore = rows.length > 0 ? (rows.reduce((s, r) => s + r._score, 0) / rows.length).toFixed(1) : "0";

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Risicoregister</h1>
          <p className="text-sm text-slate-500 mt-1">
            Beheer en monitor alle risico&apos;s van dit project.
          </p>
        </div>
        <Link
          href={`/app/projects/${id}/setup/manual/step-6`}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-all active:scale-[.98]"
        >
          + Risico toevoegen
        </Link>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Totaal", value: rows.length, color: "text-slate-900" },
          { label: "Open", value: openCount, color: "text-blue-600" },
          { label: "Hoog risico", value: highCount, color: "text-red-600" },
          { label: "Gem. score", value: avgScore, color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Geen risico&apos;s gevonden</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Er zijn nog geen risico&apos;s geregistreerd voor dit project. Voeg risico&apos;s toe via de setup of handmatig.
            </p>
            <Link
              href={`/app/projects/${id}/setup/manual/step-6`}
              className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Risico&apos;s toevoegen
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Titel</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Categorie</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">K</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">I</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Impact €</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Dag. vertr.</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .sort((a, b) => b._score - a._score)
                  .map((r) => {
                    const st = STATUS_MAP[r.status] ?? STATUS_MAP.open;
                    return (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900 truncate max-w-[220px]">{r.title}</p>
                          {r.description && (
                            <p className="text-xs text-slate-400 truncate max-w-[220px] mt-0.5">{r.description}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs capitalize">{r.category_key ?? "—"}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{r.probability ?? "—"}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{r.impact ?? "—"}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreBadge(r._score)}`}>
                            {r._score}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          {r.financial_impact_eur ? `€${Number(r.financial_impact_eur).toLocaleString("nl-NL")}` : "—"}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          {r.schedule_impact_days ? `${r.schedule_impact_days}d` : "—"}
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
