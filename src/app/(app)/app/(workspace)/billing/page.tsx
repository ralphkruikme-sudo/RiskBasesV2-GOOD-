import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing — RiskBases",
};

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your plan, usage, and payment details.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">Billing management coming soon</h3>
          <p className="mt-1 text-sm text-slate-500 text-center max-w-sm">
            View your current plan, monitor usage, and update payment information.
          </p>
        </div>
      </div>
    </div>
  );
}
