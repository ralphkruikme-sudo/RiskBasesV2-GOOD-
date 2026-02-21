"use client";

import { useActionState } from "react";
import { createWorkspace, type OnboardingResult } from "./actions";
import Link from "next/link";

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState<
    OnboardingResult | null,
    FormData
  >(createWorkspace, null);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5 text-xl font-bold text-navy"
        >
          <svg
            className="h-8 w-8 text-accent"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          RiskBases
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
              1
            </div>
            <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-400 text-sm font-bold">
              2
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Workspace aanmaken
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Een workspace is de plek waar jouw team samenwerkt aan
            risicobeheer. Je kunt later meer leden uitnodigen.
          </p>

          {/* Error */}
          {state?.error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="mt-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Workspace naam
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={60}
                autoFocus
                placeholder="Bijv. Bouwbedrijf De Vries"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent transition-colors"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Dit is de naam van je organisatie of team.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-6 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Workspace aanmaken…
                </span>
              ) : (
                "Workspace aanmaken"
              )}
            </button>
          </form>

          {/* Trial badge */}
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-accent/5 border border-accent/10 px-4 py-3">
            <svg
              className="h-4 w-4 shrink-0 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
            <p className="text-xs text-accent font-medium">
              Je start met een gratis trial van 14 dagen — alle Premium-functies
              inbegrepen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
