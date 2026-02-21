"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MANUAL_STEPS = [
  { num: 1, label: "Intake" },
  { num: 2, label: "Planning" },
  { num: 3, label: "Stakeholders" },
  { num: 4, label: "Vergunningen" },
  { num: 5, label: "Randvoorwaarden" },
  { num: 6, label: "Risico's" },
  { num: 7, label: "Acties" },
  { num: 8, label: "Overzicht" },
];

interface Props {
  projectId: string;
  projectName: string;
  children: React.ReactNode;
}

export default function SetupShell({ projectId, projectName, children }: Props) {
  const pathname = usePathname();
  const currentStep = parseInt(pathname.split("/step-")[1] ?? "1", 10);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/app/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Terug naar portfolio
        </Link>
        <h1 className="text-xl font-bold text-slate-900">{projectName}</h1>
        <p className="text-sm text-slate-500">Handmatige setup</p>
      </div>

      {/* Step indicator */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {MANUAL_STEPS.map((s, i) => {
            const isActive = s.num === currentStep;
            const isCompleted = s.num < currentStep;
            return (
              <div key={s.num} className="flex items-center gap-1">
                <Link
                  href={`/app/projects/${projectId}/setup/manual/step-${s.num}`}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : isCompleted
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span>{s.num}</span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </Link>
                {i < MANUAL_STEPS.length - 1 && (
                  <div className={`w-4 h-px ${isCompleted ? "bg-green-300" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {children}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        {currentStep > 1 ? (
          <Link
            href={`/app/projects/${projectId}/setup/manual/step-${currentStep - 1}`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Vorige stap
          </Link>
        ) : (
          <div />
        )}
        {currentStep < 8 && (
          <Link
            href={`/app/projects/${projectId}/setup/manual/step-${currentStep + 1}`}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-all"
          >
            Volgende stap →
          </Link>
        )}
      </div>
    </div>
  );
}
