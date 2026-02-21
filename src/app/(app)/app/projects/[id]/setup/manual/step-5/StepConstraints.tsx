"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  projectId: string;
  existingData: Record<string, string>;
}

const FIELDS = [
  {
    key: "constraints",
    label: "Randvoorwaarden",
    placeholder: "Bijv. maximale bouwdiepte, geluidsnormen, werktijden…",
    help: "Beperkingen waar het project mee te maken heeft.",
  },
  {
    key: "assumptions",
    label: "Aannames",
    placeholder: "Bijv. grondgesteldheid conform sonderingen, subsidie wordt verleend…",
    help: "Zaken die als waar worden aangenomen maar niet zeker zijn.",
  },
  {
    key: "dependencies",
    label: "Afhankelijkheden",
    placeholder: "Bijv. afhankelijk van verlegging gasleiding, asbestinventarisatie…",
    help: "Externe factoren waarvan het project afhankelijk is.",
  },
];

export default function StepConstraints({ projectId, existingData }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(existingData);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const rows = FIELDS.filter((f) => values[f.key]?.trim())
        .map((f) => ({
          project_id: projectId,
          field_key: f.key,
          value: values[f.key].trim(),
        }));

      if (rows.length > 0) {
        const { error: err } = await supabase
          .from("project_intake_values")
          .upsert(rows, { onConflict: "project_id,field_key" });
        if (err) {
          setError("Opslaan mislukt. Probeer het opnieuw.");
          return;
        }
      }
      router.push(`/app/projects/${projectId}/setup/manual/step-6`);
    });
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Randvoorwaarden & aannames
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Documenteer de randvoorwaarden, aannames en afhankelijkheden van het project.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {f.label}
            </label>
            <p className="text-xs text-slate-400 mb-1.5">{f.help}</p>
            <textarea
              rows={4}
              value={values[f.key] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              placeholder={f.placeholder}
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
