import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

const INFLUENCE_STYLES: Record<string, { label: string; style: string }> = {
  high: { label: "Hoog", style: "bg-red-100 text-red-700" },
  medium: { label: "Midden", style: "bg-yellow-100 text-yellow-700" },
  low: { label: "Laag", style: "bg-green-100 text-green-700" },
};

const SENTIMENT_STYLES: Record<string, { label: string; dot: string }> = {
  positive: { label: "Positief", dot: "bg-emerald-400" },
  neutral: { label: "Neutraal", dot: "bg-slate-300" },
  negative: { label: "Negatief", dot: "bg-red-400" },
  unknown: { label: "Onbekend", dot: "bg-slate-200" },
};

export default async function StakeholdersPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: stakeholders } = await supabase
    .from("stakeholders")
    .select("id, name, stakeholder_type, email, phone, influence_level, sentiment, notes, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const rows = stakeholders ?? [];
  const highInfluence = rows.filter((s) => s.influence_level === "high").length;
  const negSentiment = rows.filter((s) => s.sentiment === "negative").length;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stakeholders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overzicht van alle betrokkenen en hun relatie tot het project.
          </p>
        </div>
        <Link
          href={`/app/projects/${id}/setup/manual/step-3`}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-all active:scale-[.98]"
        >
          + Stakeholder toevoegen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Totaal", value: rows.length, color: "text-slate-900" },
          { label: "Hoge invloed", value: highInfluence, color: "text-red-600" },
          { label: "Negatief sentiment", value: negSentiment, color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Grid / cards */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Geen stakeholders gevonden</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Identificeer de belangrijkste betrokkenen bij het project.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Naam</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">E-mail</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Invloed</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wide">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const inf = s.influence_level ? INFLUENCE_STYLES[s.influence_level] : null;
                  const sent = s.sentiment ? SENTIMENT_STYLES[s.sentiment] : null;
                  return (
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                            {s.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{s.stakeholder_type ?? "—"}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{s.email ?? "—"}</td>
                      <td className="py-3 px-4">
                        {inf ? (
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${inf.style}`}>
                            {inf.label}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="py-3 px-4">
                        {sent ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${sent.dot}`} />
                            <span className="text-xs text-slate-600">{sent.label}</span>
                          </div>
                        ) : "—"}
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
