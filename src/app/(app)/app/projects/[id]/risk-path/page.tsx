import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RiskPathPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: risks } = await supabase
    .from("risks")
    .select("id, title, category_key, probability, impact, status, created_at")
    .eq("project_id", id)
    .order("created_at");

  const rows = (risks ?? []).map((r) => ({
    ...r,
    _score: (r.probability ?? 0) * (r.impact ?? 0),
  }));

  const openRisks = rows.filter((r) => r.status === "open");
  const categories = [...new Set(rows.map((r) => r.category_key).filter(Boolean))] as string[];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Risk Path</h1>
        <p className="text-sm text-slate-500 mt-1">
          Visueel overzicht van het risicoprofiel en de trend over tijd.
        </p>
      </div>

      {/* Risk path summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Open risico&apos;s</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{openRisks.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Categorieën</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{categories.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gem. score</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {rows.length > 0 ? (rows.reduce((s, r) => s + r._score, 0) / rows.length).toFixed(1) : "—"}
          </p>
        </div>
      </div>

      {/* Heatmap placeholder */}
      <div className="rounded-xl border border-slate-200 bg-white mb-6">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Risicotrend per categorie</h2>
        </div>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Nog geen data beschikbaar</h3>
            <p className="text-sm text-slate-500 mt-1">Voeg risico&apos;s toe om de risicotrend te bekijken.</p>
          </div>
        ) : (
          <div className="p-5">
            {/* Category bars */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const catRisks = openRisks.filter((r) => r.category_key === cat);
                const avgScore = catRisks.length > 0
                  ? catRisks.reduce((s, r) => s + r._score, 0) / catRisks.length
                  : 0;
                const pct = Math.min(100, (avgScore / 25) * 100);
                const color = avgScore >= 15 ? "bg-red-500" : avgScore >= 10 ? "bg-orange-400" : avgScore >= 5 ? "bg-yellow-400" : "bg-green-400";

                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 capitalize">{cat}</span>
                      <span className="text-slate-500">{catRisks.length} risico&apos;s · gem. {avgScore.toFixed(1)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score distribution */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Score verdeling</h3>
              <div className="flex items-end gap-1 h-32">
                {[
                  { range: "1-5", label: "Laag", color: "bg-green-400" },
                  { range: "6-10", label: "Midden", color: "bg-yellow-400" },
                  { range: "11-15", label: "Hoog", color: "bg-orange-400" },
                  { range: "16-25", label: "Kritiek", color: "bg-red-500" },
                ].map((bucket) => {
                  const [lo, hi] = bucket.range.split("-").map(Number);
                  const count = rows.filter((r) => r._score >= lo && r._score <= hi).length;
                  const pct = rows.length > 0 ? (count / rows.length) * 100 : 0;
                  return (
                    <div key={bucket.range} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-semibold text-slate-600">{count}</span>
                      <div className="w-full rounded-t-md overflow-hidden bg-slate-100" style={{ height: "100%" }}>
                        <div
                          className={`w-full ${bucket.color} rounded-t-md transition-all duration-500`}
                          style={{ height: `${Math.max(pct, 4)}%`, marginTop: "auto" }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">{bucket.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
