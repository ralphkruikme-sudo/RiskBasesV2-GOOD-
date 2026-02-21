"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Risk {
  id: string;
  category: string | null;
  title: string;
  description: string | null;
  probability: number | null;
  impact: number | null;
  risk_score: number | null;
  status: string;
}

interface Template {
  id: string;
  category: string;
  title: string;
  description: string | null;
  default_probability: number | null;
  default_impact: number | null;
}

interface Props {
  projectId: string;
  initialRisks: Risk[];
  templates: Template[];
}

const SCORE_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

function scoreLevel(score: number | null): string {
  if (!score) return "low";
  if (score <= 5) return "low";
  if (score <= 10) return "medium";
  if (score <= 15) return "high";
  return "critical";
}

function scoreLabelNL(level: string): string {
  const map: Record<string, string> = {
    low: "Laag",
    medium: "Midden",
    high: "Hoog",
    critical: "Kritiek",
  };
  return map[level] ?? level;
}

export default function StepRisks({ projectId, initialRisks, templates }: Props) {
  const router = useRouter();
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    probability: 3,
    impact: 3,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [importing, setImporting] = useState(false);

  function handleImportTemplates() {
    setImporting(true);
    startTransition(async () => {
      const supabase = createClient();
      const rows = templates.map((t) => ({
        project_id: projectId,
        category: t.category,
        title: t.title,
        description: t.description,
        probability: t.default_probability,
        impact: t.default_impact,
        status: "open",
      }));

      const { data, error: err } = await supabase
        .from("risks")
        .insert(rows)
        .select();

      if (err) {
        setError("Importeren mislukt.");
        setImporting(false);
        return;
      }
      setRisks((prev) => [...prev, ...(data ?? [])]);
      setImporting(false);
    });
  }

  function handleAdd() {
    if (!form.title.trim()) {
      setError("Titel is verplicht.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("risks")
        .insert({
          project_id: projectId,
          category: form.category || null,
          title: form.title.trim(),
          description: form.description || null,
          probability: form.probability,
          impact: form.impact,
          status: "open",
        })
        .select()
        .single();

      if (err) {
        setError("Toevoegen mislukt.");
        return;
      }
      setRisks((prev) => [...prev, data]);
      setForm({ category: "", title: "", description: "", probability: 3, impact: 3 });
      setShowForm(false);
    });
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("risks").delete().eq("id", id);
    setRisks((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Risico&apos;s</h2>
          <p className="text-sm text-slate-500">
            Importeer standaardrisico&apos;s of voeg handmatig risico&apos;s toe.
          </p>
        </div>
        <div className="flex gap-2">
          {templates.length > 0 && (
            <button
              type="button"
              onClick={handleImportTemplates}
              disabled={importing}
              className="rounded-lg border border-accent bg-accent/5 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/10 transition-all disabled:opacity-50"
            >
              {importing ? "Importeren…" : `⬇ Standaardrisico's (${templates.length})`}
            </button>
          )}
          <button
            type="button"
            onClick={() => { setShowForm(true); setError(null); }}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98]"
          >
            + Risico
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Nieuw risico</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Categorie</label>
              <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Bijv. Planning, Kosten, Veiligheid" className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Titel *</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Beschrijving</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kans (1-5)</label>
              <input type="range" min={1} max={5} value={form.probability} onChange={(e) => setForm((f) => ({ ...f, probability: Number(e.target.value) }))} className="w-full accent-accent" />
              <div className="flex justify-between text-xs text-slate-400"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Impact (1-5)</label>
              <input type="range" min={1} max={5} value={form.impact} onChange={(e) => setForm((f) => ({ ...f, impact: Number(e.target.value) }))} className="w-full accent-accent" />
              <div className="flex justify-between text-xs text-slate-400"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
            </div>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Risicoscore: <span className="font-semibold">{form.probability * form.impact}</span> ({scoreLabelNL(scoreLevel(form.probability * form.impact))})
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuleren</button>
            <button type="button" onClick={handleAdd} disabled={isPending} className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50">
              {isPending ? "Bezig…" : "Toevoegen"}
            </button>
          </div>
        </div>
      )}

      {risks.length === 0 && !showForm ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">Nog geen risico&apos;s. Importeer standaardrisico&apos;s of voeg er handmatig toe.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-medium text-slate-600">Categorie</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Titel</th>
                <th className="text-center py-2 px-3 font-medium text-slate-600">K</th>
                <th className="text-center py-2 px-3 font-medium text-slate-600">I</th>
                <th className="text-center py-2 px-3 font-medium text-slate-600">Score</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r) => {
                const level = scoreLevel(r.risk_score);
                return (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500">{r.category ?? "—"}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{r.title}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{r.probability ?? "—"}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{r.impact ?? "—"}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${SCORE_COLOR[level]}`}>
                        {r.risk_score ?? "—"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button type="button" onClick={() => handleDelete(r.id)} className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={() => router.push(`/app/projects/${projectId}/setup/manual/step-7`)} className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98]">
          Volgende stap →
        </button>
      </div>
    </div>
  );
}
