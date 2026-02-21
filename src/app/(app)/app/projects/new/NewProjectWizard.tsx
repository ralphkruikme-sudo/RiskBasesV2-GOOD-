"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createProject } from "./actions";

interface Module {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  enabled: boolean;
}

const STEPS = ["Module", "Projectgegevens", "Invoermethode"];

const INGEST_OPTIONS = [
  {
    value: "manual",
    label: "Handmatig invoeren",
    desc: "Stap voor stap alle projectgegevens invullen via een wizard.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    value: "csv",
    label: "CSV importeren",
    desc: "Upload een CSV-bestand met risico's en eventueel acties.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    value: "api",
    label: "API koppeling",
    desc: "Koppel bestaande systemen zoals ERP of BIM.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
];

export default function NewProjectWizard({ modules }: { modules: Module[] }) {
  const [step, setStep] = useState(0);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ingestType, setIngestType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function next() {
    if (step === 0 && !selectedModule) {
      setError("Selecteer een module om door te gaan.");
      return;
    }
    if (step === 1 && !name.trim()) {
      setError("Vul een projectnaam in.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, 2));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    if (!ingestType) {
      setError("Kies een invoermethode.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("module_id", selectedModule!);
    fd.set("name", name.trim());
    fd.set("start_date", startDate);
    fd.set("end_date", endDate);
    fd.set("ingest_type", ingestType);

    startTransition(async () => {
      const result = await createProject(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/app/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Terug naar portfolio
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nieuw project</h1>
        <p className="mt-1 text-sm text-slate-500">
          Maak een nieuw project aan in 3 stappen.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                  ? "bg-accent text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {i < step ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`hidden sm:block text-sm font-medium ${
                i === step ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-slate-200 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Step 1: Module */}
        {step === 0 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Kies een module
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Selecteer het type project waarvoor je risicomanagement wilt opzetten.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {modules.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={!m.enabled}
                  onClick={() => {
                    setSelectedModule(m.id);
                    setError(null);
                  }}
                  className={`relative flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                    !m.enabled
                      ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                      : selectedModule === m.id
                      ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <span className="text-2xl mb-2">{m.icon}</span>
                  <span className="font-semibold text-slate-900">{m.name}</span>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {m.description}
                  </span>
                  {!m.enabled && (
                    <span className="absolute top-3 right-3 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      Coming soon
                    </span>
                  )}
                  {selectedModule === m.id && (
                    <span className="absolute top-3 right-3">
                      <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Basics */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Projectgegevens
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Vul de basisinformatie van het project in.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Projectnaam *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bijv. Renovatie Stadskantoor Utrecht"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Startdatum
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-600 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Einddatum
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-600 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Ingest */}
        {step === 2 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Hoe wil je data invoeren?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Kies hoe je de projectgegevens en risico&apos;s wilt aanleveren.
            </p>
            <div className="grid gap-3">
              {INGEST_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setIngestType(opt.value);
                    setError(null);
                  }}
                  className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    ingestType === opt.value
                      ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`mt-0.5 ${
                      ingestType === opt.value
                        ? "text-accent"
                        : "text-slate-400"
                    }`}
                  >
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900">
                      {opt.label}
                    </span>
                    <p className="text-sm text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  {ingestType === opt.value && (
                    <svg className="h-5 w-5 mt-0.5 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Vorige
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98]"
            >
              Volgende
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all active:scale-[.98] disabled:opacity-50"
            >
              {isPending ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
