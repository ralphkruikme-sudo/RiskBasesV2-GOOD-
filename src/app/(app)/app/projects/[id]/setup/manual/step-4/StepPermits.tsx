"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Permit {
  id: string;
  name: string;
  type: string | null;
  status: string;
  authority: string | null;
  submitted_at: string | null;
  expected_at: string | null;
  approved_at: string | null;
  notes: string | null;
}

interface Props {
  projectId: string;
  initialPermits: Permit[];
}

const STATUSES = [
  { value: "pending", label: "In afwachting", color: "bg-slate-100 text-slate-700" },
  { value: "submitted", label: "Ingediend", color: "bg-blue-100 text-blue-700" },
  { value: "approved", label: "Goedgekeurd", color: "bg-green-100 text-green-700" },
  { value: "rejected", label: "Afgewezen", color: "bg-red-100 text-red-700" },
  { value: "expired", label: "Verlopen", color: "bg-orange-100 text-orange-700" },
];

const PERMIT_TYPES = [
  "Omgevingsvergunning",
  "Bouwvergunning",
  "Sloopvergunning",
  "Watervergunning",
  "Natuurvergunning",
  "Kapvergunning",
  "Evenementenvergunning",
  "Anders",
];

const EMPTY: Omit<Permit, "id"> = {
  name: "",
  type: "",
  status: "pending",
  authority: "",
  submitted_at: null,
  expected_at: null,
  approved_at: null,
  notes: "",
};

export default function StepPermits({ projectId, initialPermits }: Props) {
  const router = useRouter();
  const [permits, setPermits] = useState<Permit[]>(initialPermits);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Permit, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditingId(null);
    setForm(EMPTY);
    setShowForm(true);
    setError(null);
  }

  function openEdit(p: Permit) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      type: p.type ?? "",
      status: p.status,
      authority: p.authority ?? "",
      submitted_at: p.submitted_at,
      expected_at: p.expected_at,
      approved_at: p.approved_at,
      notes: p.notes ?? "",
    });
    setShowForm(true);
    setError(null);
  }

  function handleSave() {
    if (!form.name.trim()) {
      setError("Naam is verplicht.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const payload = {
        project_id: projectId,
        name: form.name.trim(),
        type: form.type || null,
        status: form.status,
        authority: form.authority || null,
        submitted_at: form.submitted_at || null,
        expected_at: form.expected_at || null,
        approved_at: form.approved_at || null,
        notes: form.notes || null,
      };

      if (editingId) {
        const { data, error: err } = await supabase
          .from("permits")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single();
        if (err) { setError("Bijwerken mislukt."); return; }
        setPermits((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      } else {
        const { data, error: err } = await supabase
          .from("permits")
          .insert(payload)
          .select()
          .single();
        if (err) { setError("Toevoegen mislukt."); return; }
        setPermits((prev) => [...prev, data]);
      }
      setShowForm(false);
    });
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("permits").delete().eq("id", id);
    setPermits((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Vergunningen</h2>
          <p className="text-sm text-slate-500">
            Registreer de benodigde vergunningen en hun status.
          </p>
        </div>
        <button type="button" onClick={openNew} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98]">
          + Vergunning
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            {editingId ? "Vergunning bewerken" : "Nieuwe vergunning"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Naam *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
              <select value={form.type ?? ""} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent">
                <option value="">Selecteer…</option>
                {PERMIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Bevoegd gezag</label>
              <input type="text" value={form.authority ?? ""} onChange={(e) => setForm((f) => ({ ...f, authority: e.target.value }))} placeholder="Bijv. Gemeente Amsterdam" className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ingediend op</label>
              <input type="date" value={form.submitted_at ?? ""} onChange={(e) => setForm((f) => ({ ...f, submitted_at: e.target.value || null }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Verwachte afgifte</label>
              <input type="date" value={form.expected_at ?? ""} onChange={(e) => setForm((f) => ({ ...f, expected_at: e.target.value || null }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Opmerkingen</label>
              <textarea rows={2} value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-0 focus:outline-accent resize-none" />
            </div>
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuleren</button>
            <button type="button" onClick={handleSave} disabled={isPending} className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50">
              {isPending ? "Bezig…" : editingId ? "Bijwerken" : "Toevoegen"}
            </button>
          </div>
        </div>
      )}

      {permits.length === 0 && !showForm ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">Nog geen vergunningen toegevoegd.</p>
          <button type="button" onClick={openNew} className="mt-2 text-sm text-accent hover:underline">Voeg de eerste toe →</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-medium text-slate-600">Naam</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Type</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Status</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Bevoegd gezag</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Verwacht</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {permits.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{p.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{p.type ?? "—"}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUSES.find((s) => s.value === p.status)?.color ?? ""}`}>
                      {STATUSES.find((s) => s.value === p.status)?.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{p.authority ?? "—"}</td>
                  <td className="py-2.5 px-3 text-slate-600">{p.expected_at ?? "—"}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-1 justify-end">
                      <button type="button" onClick={() => openEdit(p)} className="rounded p-1 text-slate-400 hover:text-accent hover:bg-slate-100">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                      </button>
                      <button type="button" onClick={() => handleDelete(p.id)} className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={() => router.push(`/app/projects/${projectId}/setup/manual/step-5`)} className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98]">
          Volgende stap →
        </button>
      </div>
    </div>
  );
}
