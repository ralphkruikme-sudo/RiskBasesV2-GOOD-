"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface RiskRef {
  id: string;
  title: string;
  category: string | null;
}

interface Action {
  id: string;
  risk_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
}

interface Props {
  projectId: string;
  risks: RiskRef[];
  initialActions: Action[];
}

const PRIORITIES = [
  { value: "low", label: "Laag", color: "bg-slate-100 text-slate-700" },
  { value: "medium", label: "Midden", color: "bg-yellow-100 text-yellow-700" },
  { value: "high", label: "Hoog", color: "bg-orange-100 text-orange-700" },
  { value: "critical", label: "Kritiek", color: "bg-red-100 text-red-700" },
];

export default function StepActions({ projectId, risks, initialActions }: Props) {
  const router = useRouter();
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    risk_id: "",
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!form.title.trim()) {
      setError("Titel is verplicht.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("actions")
        .insert({
          project_id: projectId,
          risk_id: form.risk_id || null,
          title: form.title.trim(),
          description: form.description || null,
          priority: form.priority,
          due_date: form.due_date || null,
          status: "open",
        })
        .select()
        .single();

      if (err) {
        setError("Toevoegen mislukt.");
        return;
      }
      setActions((prev) => [...prev, data]);
      setForm({ risk_id: "", title: "", description: "", priority: "medium", due_date: "" });
      setShowForm(false);
    });
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("actions").delete().eq("id", id);
    setActions((prev) => prev.filter((a) => a.id !== id));
  }

  function riskTitle(riskId: string | null) {
    if (!riskId) return "—";
    return risks.find((r) => r.id === riskId)?.title ?? "Onbekend";
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Acties</h2>
          <p className="text-sm text-slate-500">
            Definieer beheersmaatregelen gekoppeld aan risico&apos;s.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setError(null); }}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98]"
        >
          + Actie
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {risks.length === 0 && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Er zijn nog geen risico&apos;s aangemaakt. Ga terug naar stap 6 om risico&apos;s toe te voegen.
        </div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Nieuwe actie</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Gekoppeld risico</label>
              <select value={form.risk_id} onChange={(e) => setForm((f) => ({ ...f, risk_id: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent">
                <option value="">Geen risico gekoppeld</option>
                {risks.map((r) => (
                  <option key={r.id} value={r.id}>{r.category ? `[${r.category}] ` : ""}{r.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Titel *</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Prioriteit</label>
              <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent">
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Deadline</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Beschrijving</label>
              <input type="text" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuleren</button>
            <button type="button" onClick={handleAdd} disabled={isPending} className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50">
              {isPending ? "Bezig…" : "Toevoegen"}
            </button>
          </div>
        </div>
      )}

      {actions.length === 0 && !showForm ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">Nog geen acties aangemaakt.</p>
          <button type="button" onClick={() => setShowForm(true)} className="mt-2 text-sm text-accent hover:underline">Voeg de eerste toe →</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-medium text-slate-600">Actie</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Risico</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Prioriteit</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Deadline</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {actions.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{a.title}</td>
                  <td className="py-2.5 px-3 text-slate-500 text-xs">{riskTitle(a.risk_id)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITIES.find((p) => p.value === a.priority)?.color ?? ""}`}>
                      {PRIORITIES.find((p) => p.value === a.priority)?.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{a.due_date ?? "—"}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button type="button" onClick={() => handleDelete(a.id)} className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-red-50">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={() => router.push(`/app/projects/${projectId}/setup/manual/step-8`)} className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98]">
          Volgende stap →
        </button>
      </div>
    </div>
  );
}
