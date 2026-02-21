import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch summary data for report previews
  const [riskRes, actionRes, stakeholderRes, permitRes] = await Promise.all([
    supabase.from("risks").select("id, probability, impact, status, financial_impact_eur").eq("project_id", id),
    supabase.from("actions").select("id, status, priority").eq("project_id", id),
    supabase.from("stakeholders").select("id, influence_level, sentiment").eq("project_id", id),
    supabase.from("permits").select("id, status").eq("project_id", id),
  ]);

  const risks = riskRes.data ?? [];
  const actions = actionRes.data ?? [];
  const stakeholders = stakeholderRes.data ?? [];
  const permits = permitRes.data ?? [];

  const totalExposure = risks.reduce((sum, r) => sum + (r.financial_impact_eur ?? 0), 0);
  const highRisks = risks.filter((r) => (r.probability ?? 0) * (r.impact ?? 0) >= 15).length;

  const reportTypes = [
    {
      title: "Risico-overzicht",
      description: "Compleet overzicht van alle risico's, scores, trends en categorieën.",
      icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
      stats: `${risks.length} risico's · ${highRisks} hoog`,
      available: risks.length > 0,
    },
    {
      title: "Actierapport",
      description: "Status van alle beheersmaatregelen, deadlines en verantwoordelijken.",
      icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      stats: `${actions.length} acties · ${actions.filter((a) => a.status === "completed").length} afgerond`,
      available: actions.length > 0,
    },
    {
      title: "Stakeholder-analyse",
      description: "Overzicht van betrokkenen, invloedsniveaus en sentimentanalyse.",
      icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
      stats: `${stakeholders.length} stakeholders`,
      available: stakeholders.length > 0,
    },
    {
      title: "Financieel overzicht",
      description: "Totale financiële blootstelling, impact per risico en kostentrends.",
      icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
      stats: totalExposure > 0 ? `€${(totalExposure / 1000).toFixed(0)}k exposure` : "Geen bedragen",
      available: totalExposure > 0,
    },
    {
      title: "Vergunningenrapport",
      description: "Status van alle vergunningen, verwachte data en goedkeuringen.",
      icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
      stats: `${permits.length} vergunningen`,
      available: permits.length > 0,
    },
    {
      title: "Executive Summary",
      description: "Management-samenvatting met KPI's, aanbevelingen en projectstatus.",
      icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
      stats: `${risks.length + actions.length + stakeholders.length} items`,
      available: true,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Genereer rapporten en exporteer projectdata voor stakeholders.
        </p>
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <div
            key={report.title}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg bg-slate-100 p-2.5 group-hover:bg-accent/10 transition-colors">
                <svg className="h-5 w-5 text-slate-600 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={report.icon} />
                </svg>
              </div>
              {!report.available && (
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                  Geen data
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-900">{report.title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{report.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{report.stats}</span>
              <button
                disabled={!report.available}
                className="text-xs font-semibold text-accent hover:underline disabled:text-slate-300 disabled:no-underline disabled:cursor-not-allowed"
              >
                Genereren →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export section */}
      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-slate-100 p-3">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Export projectdata</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download alle projectgegevens als CSV of PDF. Export is beschikbaar voor Premium en Enterprise accounts.
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              disabled
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              CSV
            </button>
            <button
              disabled
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
