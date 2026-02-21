import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan een Demo — RiskBases",
  description: "Plan een persoonlijke walkthrough van het RiskBases-platform.",
};

export default function BookDemoPage() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            Binnenkort beschikbaar
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Plan een demo
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Online planning komt binnenkort. Neem in de tussentijd direct
            contact met ons op — we geven je graag een persoonlijke rondleiding.
          </p>
        </div>

        {/* Contact card */}
        <div className="mt-14 animate-fade-in-up delay-200">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-r from-accent to-blue-400" />

            <div className="p-8 sm:p-10">
              <h2 className="text-xl font-bold text-slate-900">
                Neem contact op
              </h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Stuur ons een e-mail en we plannen een gesprek van 30 minuten
                op een moment dat jou uitkomt.
              </p>

              <div className="mt-8 space-y-5">
                {/* Sales */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Sales & Demo&apos;s
                    </p>
                    <a
                      href="mailto:info@riskbases.com"
                      className="mt-0.5 text-sm text-accent hover:underline transition-colors duration-200"
                    >
                      info@riskbases.com
                    </a>
                  </div>
                </div>

                {/* Support */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Technische Support
                    </p>
                    <a
                      href="mailto:support@riskbases.com"
                      className="mt-0.5 text-sm text-accent hover:underline transition-colors duration-200"
                    >
                      support@riskbases.com
                    </a>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Reactietijd
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      We reageren doorgaans binnen één werkdag.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA fallback */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="mailto:info@riskbases.com?subject=Demo%20Request%20%E2%80%93%20RiskBases"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[.98]"
                >
                  E-mail ons om te plannen
                </a>
                <Link
                  href="/signup"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]"
                >
                  Of start een gratis proefperiode
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
