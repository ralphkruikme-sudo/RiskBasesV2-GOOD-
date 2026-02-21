"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface IntakeValue {
  field_key: string;
  value: unknown;
}
interface Stakeholder {
  id: string;
  name: string;
  stakeholder_type: string | null;
  influence_level: string | null;
  sentiment: string | null;
}
interface Permit {
  id: string;
  permit_type: string;
  status: string;
}
interface Risk {
  id: string;
  title: string;
  category_key: string | null;
  probability: number | null;
  impact: number | null;
}
interface Action {
  id: string;
  title: string;
  priority: string;
  status: string;
}

interface Props {
  projectId: string;
  intakeValues: IntakeValue[];
  stakeholders: Stakeholder[];
  permits: Permit[];
  risks: Risk[];
  actions: Action[];
}

function SummaryCard({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count: number;
  icon: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function StepReview({
  projectId,
  intakeValues,
  stakeholders,
  permits,
  risks,
  actions,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleFinish() {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("projects")
        .update({ setup_status: "completed", status: "active" })
        .eq("id", projectId);

      if (error) {
        console.error("Finish setup error:", error);
        return;
      }
      router.push(`/app/projects/${projectId}/dashboard`);
    });
  }

  const highRisks = risks.filter(
    (r) => (r.probability ?? 0) * (r.impact ?? 0) >= 15
  ).length;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Overzicht &amp; afronden
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Controleer de ingevoerde gegevens. Je kunt altijd naar eerdere stappen
        terug om aanpassingen te doen.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Intake */}
        <SummaryCard
          title="Intake velden"
          count={intakeValues.length}
          icon="📋"
        >
          {intakeValues.length > 0 ? (
            <ul className="space-y-1 text-xs text-slate-600">
              {intakeValues.slice(0, 6).map((v) => (
                <li key={v.field_key} className="flex justify-between">
                  <span className="text-slate-500">{v.field_key}</span>
                  <span className="font-medium truncate max-w-[50%] text-right">
                    {String(v.value ?? "—")}
                  </span>
                </li>
              ))}
              {intakeValues.length > 6 && (
                <li className="text-slate-400">
                  + {intakeValues.length - 6} meer…
                </li>
              )}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Geen intake gegevens ingevuld</p>
          )}
        </SummaryCard>

        {/* Stakeholders */}
        <SummaryCard
          title="Stakeholders"
          count={stakeholders.length}
          icon="👥"
        >
          {stakeholders.length > 0 ? (
            <ul className="space-y-1 text-xs text-slate-600">
              {stakeholders.slice(0, 5).map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>{s.name}</span>
                  <span className="text-slate-400">{s.stakeholder_type ?? ""}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Geen stakeholders toegevoegd</p>
          )}
        </SummaryCard>

        {/* Permits */}
        <SummaryCard title="Vergunningen" count={permits.length} icon="📜">
          {permits.length > 0 ? (
            <ul className="space-y-1 text-xs text-slate-600">
              {permits.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.permit_type}</span>
                  <span className="text-slate-400">{p.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Geen vergunningen</p>
          )}
        </SummaryCard>

        {/* Risks */}
        <SummaryCard title="Risico's" count={risks.length} icon="⚠️">
          {risks.length > 0 ? (
            <div>
              <ul className="space-y-1 text-xs text-slate-600">
                {risks.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex justify-between">
                    <span className="truncate max-w-[70%]">{r.title}</span>
                    <span className="font-semibold">{(r.probability ?? 0) * (r.impact ?? 0)}</span>
                  </li>
                ))}
                {risks.length > 5 && (
                  <li className="text-slate-400">+ {risks.length - 5} meer…</li>
                )}
              </ul>
              {highRisks > 0 && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  ⚡ {highRisks} risico&apos;s met hoge score (≥15)
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Geen risico&apos;s</p>
          )}
        </SummaryCard>

        {/* Actions */}
        <SummaryCard title="Acties" count={actions.length} icon="✅">
          {actions.length > 0 ? (
            <ul className="space-y-1 text-xs text-slate-600">
              {actions.slice(0, 5).map((a) => (
                <li key={a.id} className="flex justify-between">
                  <span className="truncate max-w-[70%]">{a.title}</span>
                  <span className="text-slate-400">{a.priority}</span>
                </li>
              ))}
              {actions.length > 5 && (
                <li className="text-slate-400">+ {actions.length - 5} meer…</li>
              )}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Geen acties</p>
          )}
        </SummaryCard>
      </div>

      {/* Finish button */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleFinish}
          disabled={isPending}
          className="rounded-xl bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700 transition-all active:scale-[.98] disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Afronden…
            </span>
          ) : (
            "✓ Setup afronden"
          )}
        </button>
      </div>
    </div>
  );
}
