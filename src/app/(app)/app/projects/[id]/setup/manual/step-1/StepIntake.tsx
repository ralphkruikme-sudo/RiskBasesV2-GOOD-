"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Field {
  id: string;
  field_key: string;
  label: string;
  field_type: string;
  options: string[] | null;
  required: boolean;
}

interface Props {
  projectId: string;
  fields: Field[];
  existingValues: Record<string, unknown>;
}

export default function StepIntake({ projectId, fields, existingValues }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(existingValues);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setValue(key: string, val: unknown) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    // Validate required fields
    for (const f of fields) {
      if (f.required && !values[f.field_key]) {
        setError(`"${f.label}" is verplicht.`);
        return;
      }
    }
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

      router.push(`/app/projects/${projectId}/setup/manual/step-2`);
    });
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Project intake</h2>
      <p className="text-sm text-slate-500 mb-6">
        Vul de specifieke gegevens voor dit projecttype in.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.id}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {f.label}
              {f.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {f.field_type === "text" && (
              <input
                type="text"
                value={(values[f.field_key] as string) ?? ""}
                onChange={(e) => setValue(f.field_key, e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              />
            )}

            {f.field_type === "textarea" && (
              <textarea
                rows={3}
                value={(values[f.field_key] as string) ?? ""}
                onChange={(e) => setValue(f.field_key, e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent resize-none"
              />
            )}

            {f.field_type === "number" && (
              <input
                type="number"
                value={(values[f.field_key] as number) ?? ""}
                onChange={(e) =>
                  setValue(
                    f.field_key,
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              />
            )}

            {f.field_type === "date" && (
              <input
                type="date"
                value={(values[f.field_key] as string) ?? ""}
                onChange={(e) => setValue(f.field_key, e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-600 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              />
            )}

            {f.field_type === "select" && (
              <select
                value={(values[f.field_key] as string) ?? ""}
                onChange={(e) => setValue(f.field_key, e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-600 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              >
                <option value="">Selecteer…</option>
                {(f.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {f.field_type === "boolean" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!values[f.field_key]}
                  onChange={(e) => setValue(f.field_key, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-slate-600">Ja</span>
              </label>
            )}
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
