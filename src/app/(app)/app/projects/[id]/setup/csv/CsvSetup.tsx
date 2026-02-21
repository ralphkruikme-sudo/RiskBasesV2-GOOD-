"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Props {
  projectId: string;
  projectName: string;
}

interface ParsedRisk {
  title: string;
  category: string;
  description: string;
  probability: number;
  impact: number;
  action?: string;
}

const CSV_TEMPLATE = `titel,categorie,beschrijving,kans,impact,actie
"Vertraging materiaallevering","Planning","Supply chain vertragingen",3,4,"Alternatieve leveranciers identificeren"
"Kostenoverschrijding","Kosten","Prijsstijgingen bouwmaterialen",3,4,""
"Arbeidsongeval","Veiligheid","Veiligheidsrisico op locatie",2,5,"Toolbox meetings plannen"`;

export default function CsvSetup({ projectId, projectName }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedRisk[] | null>(null);
  const [rawErrors, setRawErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [imported, setImported] = useState(false);

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "riskbases_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function parseCSV(text: string): { risks: ParsedRisk[]; errors: string[] } {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return { risks: [], errors: ["CSV bevat geen data rijen."] };

    // Simple CSV parser that handles quoted fields
    function parseLine(line: string): string[] {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      result.push(current.trim());
      return result;
    }

    const header = parseLine(lines[0]).map((h) => h.toLowerCase().trim());
    const titleIdx = header.findIndex((h) => h.includes("titel") || h === "title");
    const catIdx = header.findIndex((h) => h.includes("categorie") || h === "category");
    const descIdx = header.findIndex((h) => h.includes("beschrijving") || h === "description");
    const probIdx = header.findIndex((h) => h.includes("kans") || h === "probability");
    const impIdx = header.findIndex((h) => h.includes("impact"));
    const actIdx = header.findIndex((h) => h.includes("actie") || h === "action");

    if (titleIdx === -1) {
      return { risks: [], errors: ["Kolom 'titel' niet gevonden in header."] };
    }

    const risks: ParsedRisk[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = parseLine(lines[i]);
      const title = cols[titleIdx]?.trim();
      if (!title) {
        errors.push(`Rij ${i + 1}: titel ontbreekt, overgeslagen.`);
        continue;
      }
      const prob = probIdx >= 0 ? parseInt(cols[probIdx]) : 3;
      const imp = impIdx >= 0 ? parseInt(cols[impIdx]) : 3;
      if (prob < 1 || prob > 5 || isNaN(prob)) {
        errors.push(`Rij ${i + 1}: kans moet 1–5 zijn, standaard 3 gebruikt.`);
      }
      if (imp < 1 || imp > 5 || isNaN(imp)) {
        errors.push(`Rij ${i + 1}: impact moet 1–5 zijn, standaard 3 gebruikt.`);
      }
      risks.push({
        title,
        category: catIdx >= 0 ? cols[catIdx]?.trim() ?? "" : "",
        description: descIdx >= 0 ? cols[descIdx]?.trim() ?? "" : "",
        probability: Math.max(1, Math.min(5, isNaN(prob) ? 3 : prob)),
        impact: Math.max(1, Math.min(5, isNaN(imp) ? 3 : imp)),
        action: actIdx >= 0 ? cols[actIdx]?.trim() : undefined,
      });
    }

    return { risks, errors };
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setParsed(null);
    setRawErrors([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { risks, errors } = parseCSV(text);
      setParsed(risks);
      setRawErrors(errors);
      if (risks.length === 0 && errors.length === 0) {
        setError("Geen geldige risico's gevonden in het bestand.");
      }
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!parsed || parsed.length === 0) return;
    setError(null);

    startTransition(async () => {
      const supabase = createClient();

      // Insert risks
      const riskRows = parsed.map((r) => ({
        project_id: projectId,
        category: r.category || null,
        title: r.title,
        description: r.description || null,
        probability: r.probability,
        impact: r.impact,
        status: "open",
      }));

      const { data: insertedRisks, error: riskErr } = await supabase
        .from("risks")
        .insert(riskRows)
        .select("id, title");

      if (riskErr) {
        setError("Importeren van risico's mislukt.");
        return;
      }

      // Insert actions linked to their risks
      const actionRows: { project_id: string; risk_id: string; title: string; status: string; priority: string }[] = [];
      parsed.forEach((r, i) => {
        if (r.action && insertedRisks?.[i]) {
          actionRows.push({
            project_id: projectId,
            risk_id: insertedRisks[i].id,
            title: r.action,
            status: "open",
            priority: "medium",
          });
        }
      });

      if (actionRows.length > 0) {
        await supabase.from("actions").insert(actionRows);
      }

      // Mark setup completed
      await supabase
        .from("projects")
        .update({ setup_status: "completed", status: "active" })
        .eq("id", projectId);

      setImported(true);
      setTimeout(() => {
        router.push(`/app/projects/${projectId}/dashboard`);
      }, 1500);
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          All projects
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{projectName}</h1>
        <p className="mt-1 text-sm text-slate-500">CSV import</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        {imported ? (
          <div className="text-center py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Import voltooid!</h2>
            <p className="text-sm text-slate-500 mt-1">Je wordt doorgestuurd naar het dashboard…</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Risico&apos;s importeren via CSV
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Download het template, vul de risico&apos;s in en upload het bestand.
            </p>

            {/* Step 1: Download template */}
            <div className="mb-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-700">
                    1. Download CSV template
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kolommen: titel, categorie, beschrijving, kans (1-5), impact (1-5), actie (optioneel)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  ⬇ Template downloaden
                </button>
              </div>
            </div>

            {/* Step 2: Upload */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                2. Upload ingevuld CSV-bestand
              </h3>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors"
              >
                <svg className="h-10 w-10 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-slate-600 font-medium">
                  Klik om een CSV-bestand te kiezen
                </p>
                <p className="text-xs text-slate-400 mt-1">of sleep het bestand hierheen</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {rawErrors.length > 0 && (
              <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
                <p className="text-sm font-medium text-yellow-700 mb-1">Waarschuwingen:</p>
                <ul className="text-xs text-yellow-600 space-y-0.5">
                  {rawErrors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview */}
            {parsed && parsed.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  3. Voorbeeld ({parsed.length} risico&apos;s gevonden)
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Titel</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Categorie</th>
                        <th className="text-center py-2 px-3 font-medium text-slate-600">K</th>
                        <th className="text-center py-2 px-3 font-medium text-slate-600">I</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Actie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.slice(0, 20).map((r, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-1.5 px-3 font-medium text-slate-900">{r.title}</td>
                          <td className="py-1.5 px-3 text-slate-500">{r.category || "—"}</td>
                          <td className="py-1.5 px-3 text-center">{r.probability}</td>
                          <td className="py-1.5 px-3 text-center">{r.impact}</td>
                          <td className="py-1.5 px-3 text-slate-500">{r.action || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsed.length > 20 && (
                    <p className="text-xs text-slate-400 p-2 text-center">
                      + {parsed.length - 20} meer…
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={isPending}
                    className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-green-700 transition-all active:scale-[.98] disabled:opacity-50"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Importeren…
                      </span>
                    ) : (
                      `✓ ${parsed.length} risico's importeren`
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
