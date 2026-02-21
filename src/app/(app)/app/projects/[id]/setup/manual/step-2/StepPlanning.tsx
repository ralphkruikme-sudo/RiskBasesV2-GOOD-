"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  projectId: string;
  existingData: Record<string, unknown>;
}

const PLANNING_FIELDS = [
  { key: "planning_start_design", label: "Start ontwerp", type: "date" },
  { key: "planning_end_design", label: "Einde ontwerp", type: "date" },
  { key: "planning_start_preparation", label: "Start voorbereiding", type: "date" },
  { key: "planning_end_preparation", label: "Einde voorbereiding", type: "date" },
  { key: "planning_start_execution", label: "Start uitvoering", type: "date" },
  { key: "planning_end_execution", label: "Einde uitvoering", type: "date" },
  { key: "planning_delivery_date", label: "Opleverdatum", type: "date" },
  { key: "planning_milestones", label: "Belangrijke mijlpalen", type: "textarea" },
  { key: "planning_critical_path", label: "Kritieke pad / aandachtspunten", type: "textarea" },
];

export default function StepPlanning({ projectId, existingData }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(existingData);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setValue(key: string, val: unknown) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const rows = Object.entries(values)
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([key, val]) => ({
          project_id: projectId,
          field_key: key,
          value: val,
        }));

      if (rows.length > 0) {
        const { error: upsertError } = await supabase
          .from("project_intake_values")
          .upsert(rows, { onConflict: "project_id,field_key" });

        if (upsertError) {
          setError("Opslaan mislukt. Probeer het opnieuw.");
          console.error(upsertError);
          return;
        }
      }

      router.push(`/app/projects/${projectId}/setup/manual/step-3`);
    });
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Planning baseline
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Definieer de belangrijkste planningsdata voor het project.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Date pairs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLANNING_FIELDS.filter((f) => f.type === "date").map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {f.label}
              </label>
              <input
                type="date"
                value={(values[f.key] as string) ?? ""}
                onChange={(e) => setValue(f.key, e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-600 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              />
            </div>
          ))}
        </div>

        {/* Text areas */}
        {PLANNING_FIELDS.filter((f) => f.type === "textarea").map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {f.label}
            </label>
            <textarea
              rows={3}
              value={(values[f.key] as string) ?? ""}
              onChange={(e) => setValue(f.key, e.target.value)}
              placeholder={
                f.key === "planning_milestones"
                  ? "Bijv. fundament gereed, wind- en waterdicht, oplevering…"
                  : "Beschrijf kritieke afhankelijkheden…"
              }
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent resize-none"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98] disabled:opacity-50"
        >
          {isPending ? "Opslaan…" : "Opslaan & volgende"}
        </button>
      </div>
    </div>
  );
}
