import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const MODULE_LABELS: Record<string, string> = {
  construction: "Bouw",
  infrastructure: "Infrastructuur",
  energy: "Energie",
  water: "Waterbeheer",
  industry: "Industrie",
  government: "Overheid",
};

export default async function ProjectSettingsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, status, setup_status, module_id, start_date, end_date, currency, created_at")
    .eq("id", id)
    .single();

  if (!project) redirect("/app");

  const moduleLabel = project.module_id ? MODULE_LABELS[project.module_id] ?? project.module_id : "—";

  const fields = [
    { label: "Projectnaam", value: project.name },
    { label: "Module", value: moduleLabel },
    { label: "Status", value: project.status },
    { label: "Setup status", value: project.setup_status },
    { label: "Valuta", value: project.currency ?? "EUR" },
    { label: "Startdatum", value: project.start_date ?? "—" },
    { label: "Einddatum", value: project.end_date ?? "—" },
    { label: "Aangemaakt", value: project.created_at ? new Date(project.created_at).toLocaleDateString("nl-NL") : "—" },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Projectinstellingen</h1>
        <p className="text-sm text-slate-500 mt-1">
          Beheer projectgegevens, toegang en configuratie.
        </p>
      </div>

      {/* Project details */}
      <div className="rounded-xl border border-slate-200 bg-white mb-6">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Projectgegevens</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-slate-500">{f.label}</span>
              <span className="text-sm font-medium text-slate-900 capitalize">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="rounded-xl border border-slate-200 bg-white mb-6">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Projectteam</h2>
          <button disabled className="text-xs font-medium text-accent opacity-50 cursor-not-allowed">
            + Lid toevoegen
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-navy flex items-center justify-center text-sm font-bold text-white">
              {(user.user_metadata?.full_name ?? user.email ?? "U")
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {user.user_metadata?.full_name ?? user.email}
              </p>
              <p className="text-xs text-slate-500">Eigenaar · {user.email}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Teamleden uitnodigen voor projecten is binnenkort beschikbaar.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-slate-200 bg-white mb-6">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Notificaties</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "E-mail bij nieuwe risico's", desc: "Ontvang een e-mail wanneer er risico's worden toegevoegd." },
            { label: "E-mail bij deadline acties", desc: "Herinnering 3 dagen voor een actie-deadline." },
            { label: "Weekelijkse samenvatting", desc: "Wekelijks overzicht van projectstatus." },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{n.label}</p>
                <p className="text-xs text-slate-500">{n.desc}</p>
              </div>
              <div className="relative">
                <div className="h-6 w-11 rounded-full bg-slate-200 cursor-not-allowed">
                  <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
                </div>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-400">Notificatie-instellingen zijn binnenkort beschikbaar.</p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50/30">
        <div className="border-b border-red-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-red-700">Gevarenzone</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Project archiveren</p>
              <p className="text-xs text-slate-500">Verberg het project uit het overzicht. Data wordt bewaard.</p>
            </div>
            <button disabled className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 opacity-50 cursor-not-allowed">
              Archiveren
            </button>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-red-200">
            <div>
              <p className="text-sm font-medium text-slate-900">Project verwijderen</p>
              <p className="text-xs text-slate-500">Permanent verwijderen van het project en alle data.</p>
            </div>
            <button disabled className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed">
              Verwijderen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
