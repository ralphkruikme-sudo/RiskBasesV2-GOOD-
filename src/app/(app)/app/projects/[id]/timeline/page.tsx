import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TimelinePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, start_date, end_date")
    .eq("id", id)
    .single();

  const [riskRes, actionRes, permitRes] = await Promise.all([
    supabase.from("risks").select("id, title, status, created_at").eq("project_id", id).order("created_at"),
    supabase.from("actions").select("id, title, status, due_date, created_at").eq("project_id", id).order("due_date"),
    supabase.from("permits").select("id, permit_type, status, expected_date, actual_date").eq("project_id", id).order("expected_date"),
  ]);

  const risks = riskRes.data ?? [];
  const actions = actionRes.data ?? [];
  const permits = permitRes.data ?? [];

  // Build combined timeline events
  const events: { date: string; type: string; label: string; status: string }[] = [];

  if (project?.start_date) events.push({ date: project.start_date, type: "milestone", label: "Projectstart", status: "active" });
  if (project?.end_date) events.push({ date: project.end_date, type: "milestone", label: "Projecteinde", status: "planned" });

  permits.forEach((p) => {
    if (p.expected_date) events.push({ date: p.expected_date, type: "permit", label: `Vergunning: ${p.permit_type}`, status: p.status });
  });

  actions.forEach((a) => {
    if (a.due_date) events.push({ date: a.due_date, type: "action", label: a.title, status: a.status });
  });

  risks.forEach((r) => {
    if (r.created_at) events.push({ date: r.created_at.split("T")[0], type: "risk", label: r.title, status: r.status });
  });

  events.sort((a, b) => a.date.localeCompare(b.date));

  const typeConfig: Record<string, { color: string; icon: string }> = {
    milestone: { color: "bg-accent", icon: "M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" },
    risk: { color: "bg-red-500", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" },
    action: { color: "bg-orange-500", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    permit: { color: "bg-violet-500", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Timeline</h1>
        <p className="text-sm text-slate-500 mt-1">
          Chronologisch overzicht van alle project-events, deadlines en mijlpalen.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Risico's", value: risks.length, color: "text-red-600" },
          { label: "Acties", value: actions.length, color: "text-orange-600" },
          { label: "Vergunningen", value: permits.length, color: "text-violet-600" },
          { label: "Events", value: events.length, color: "text-slate-900" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Geen events gevonden</h3>
            <p className="text-sm text-slate-500 mt-1">Voeg risico&apos;s, acties of vergunningen toe om de timeline te vullen.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />

              <div className="space-y-6">
                {events.map((ev, i) => {
                  const cfg = typeConfig[ev.type] ?? typeConfig.risk;
                  return (
                    <div key={i} className="flex gap-4 relative">
                      {/* Dot */}
                      <div className={`relative z-10 h-10 w-10 rounded-full ${cfg.color} flex items-center justify-center shrink-0`}>
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
                        </svg>
                      </div>
                      <div className="pt-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-400">{ev.date}</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{ev.type}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 mt-0.5 truncate">{ev.label}</p>
                        <span className="text-[10px] text-slate-500 capitalize">{ev.status}</span>
                      </div>
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
