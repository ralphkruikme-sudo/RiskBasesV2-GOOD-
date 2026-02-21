import type { Metadata } from "next";
import { createClient, getUser, getWorkspaceMembershipFull } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Projects — RiskBases",
};

export default async function ProjectsPage() {
  // Use cached helpers — no duplicate auth/membership calls
  const { user } = await getUser();
  if (!user) redirect("/login");

  const { membership } = await getWorkspaceMembershipFull(user.id);
  if (!membership) redirect("/app/onboarding");

  const workspace = (membership as any).workspaces as {
    id: string;
    name: string;
  };

  // These DB queries are unique to this page — run in parallel
  const supabase = await createClient();
  const [subscriptionResult, projectsResult] = await Promise.all([
    supabase
      .from("workspace_subscriptions")
      .select("plan_id, status, trial_ends_at")
      .eq("workspace_id", workspace.id)
      .maybeSingle(),
    supabase
      .from("projects")
      .select("id, name, status, module_id, start_date, end_date, created_at")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false }),
  ]);

  const plan = subscriptionResult.data?.plan_id ?? "standard";
  const trialEndsAt = subscriptionResult.data?.trial_ends_at ?? null;

  return (
    <PortfolioClient
      workspace={workspace}
      plan={plan}
      trialEndsAt={trialEndsAt}
      projects={projectsResult.data ?? []}
      fetchError={projectsResult.error?.message ?? null}
      userRole={membership.role}
    />
  );
}
