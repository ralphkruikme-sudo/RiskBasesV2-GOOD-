import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — RiskBases",
};

export default function AppDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Risks", value: "128", change: "+12" },
          { label: "Critical", value: "7", change: "-2" },
          { label: "Open Actions", value: "34", change: "+5" },
          { label: "Controls", value: "86", change: "+3" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {stat.change} this month
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <p className="mt-2 text-sm text-slate-500">
          No activity to show yet. Start by adding risks to your register.
        </p>
        <div className="mt-6 flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
          Activity feed will appear here
        </div>
      </div>

      {/* Risk heatmap placeholder */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Risk Heatmap</h2>
        <p className="mt-2 text-sm text-slate-500">
          Visualize risk likelihood vs. impact across your organization.
        </p>
        <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
          Heatmap visualization will appear here
        </div>
      </div>
    </div>
  );
}
