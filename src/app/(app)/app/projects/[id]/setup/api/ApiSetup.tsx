"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Integration {
  id: string;
  integration_type: string;
  status: string;
  config: Record<string, unknown>;
}

interface Props {
  projectId: string;
  projectName: string;
  existingIntegrations: Integration[];
}

const INTEGRATIONS = [
  {
    type: "erp",
    title: "ERP systeem",
    description: "Koppel met je ERP-systeem om projectdata en budgetten automatisch te synchroniseren.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    type: "bim",
    title: "BIM model",
    description: "Importeer risico's rechtstreeks vanuit je BIM-model en 3D omgeving.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
];

export default function ApiSetup({ projectId, projectName, existingIntegrations }: Props) {
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>(existingIntegrations);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function isConnected(type: string) {
    return integrations.some((i) => i.integration_type === type);
  }

  function handleConnect(type: string) {
    startTransition(async () => {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("project_integrations")
        .upsert(
          {
            project_id: projectId,
            integration_type: type,
            status: "not_connected",
            config: {},
          },
          { onConflict: "project_id,integration_type" }
        )
        .select()
        .single();

      if (err) {
        setError("Koppeling aanmaken mislukt.");
        return;
      }
      setIntegrations((prev) => {
        const existing = prev.find((i) => i.integration_type === type);
        if (existing) return prev.map((i) => (i.integration_type === type ? data : i));
        return [...prev, data];
      });
    });
  }

  function handleFinish() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from("projects")
        .update({ setup_status: "completed", status: "active" })
        .eq("id", projectId);
      router.push(`/app/projects/${projectId}/dashboard`);
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
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
        <h1 className="text-2xl font-bold text-slate-900">{projectName}</h1>
        <p className="mt-1 text-sm text-slate-500">API koppelingen</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {INTEGRATIONS.map((integ) => {
          const connected = isConnected(integ.type);
          return (
            <div
              key={integ.type}
              className={`rounded-2xl border-2 p-6 transition-all ${
                connected
                  ? "border-accent/30 bg-accent/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className={`mb-4 ${connected ? "text-accent" : "text-slate-400"}`}>
                {integ.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{integ.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">{integ.description}</p>

              {connected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="text-xs font-medium text-accent">
                      Koppeling aangemaakt — synchronisatie binnenkort beschikbaar
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    De daadwerkelijke datasynchronisatie wordt in een volgende release beschikbaar gesteld.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConnect(integ.type)}
                  disabled={isPending}
                  className="rounded-lg border border-accent bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/5 transition-all disabled:opacity-50"
                >
                  Verbinden
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 mb-8">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-700">
              API-koppelingen zijn momenteel in bèta
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Je kunt alvast koppelingen aanmaken. De daadwerkelijke synchronisatie wordt binnenkort uitgerold.
              Neem contact op voor early access.
            </p>
          </div>
        </div>
      </div>

      {/* Finish */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleFinish}
          disabled={isPending}
          className="rounded-xl bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700 transition-all active:scale-[.98] disabled:opacity-50"
        >
          {isPending ? "Bezig…" : "✓ Setup afronden"}
        </button>
      </div>
    </div>
  );
}
