"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  workspaceId: string;
  onClose: () => void;
}

const SECTORS = [
  "Bouw",
  "Infra",
  "Energie",
  "Waterbeheer",
  "Industrie",
  "Vastgoed",
  "Overheid",
  "Anders",
];

export default function NewProjectModal({ workspaceId, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError("Projectnaam moet minimaal 2 tekens bevatten.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("projects").insert({
      workspace_id: workspaceId,
      name: name.trim(),
      description: description.trim() || null,
      sector: sector || null,
      reference: reference.trim() || null,
      status: "active",
    });

    if (insertError) {
      setLoading(false);
      setError("Kon project niet aanmaken. Probeer het opnieuw.");
      console.error("Project insert error:", insertError);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Nieuw project</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Projectnaam *
            </label>
            <input
              id="project-name"
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bijv. Renovatie Stadskantoor Utrecht"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
            />
          </div>

          <div>
            <label htmlFor="project-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
              Beschrijving
            </label>
            <textarea
              id="project-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Korte omschrijving van het project…"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="project-sector" className="block text-sm font-medium text-slate-700 mb-1.5">
                Sector
              </label>
              <select
                id="project-sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-600 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              >
                <option value="">Kies sector…</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="project-ref" className="block text-sm font-medium text-slate-700 mb-1.5">
                Referentie
              </label>
              <input
                id="project-ref"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="PRJ-001"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent font-mono"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Aanmaken…
                </span>
              ) : (
                "Project aanmaken"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
