import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team — RiskBases",
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Team</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage team members and invitations for your workspace.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">Team management coming soon</h3>
          <p className="mt-1 text-sm text-slate-500 text-center max-w-sm">
            Invite team members, assign roles, and manage access to your workspace projects.
          </p>
        </div>
      </div>
    </div>
  );
}
