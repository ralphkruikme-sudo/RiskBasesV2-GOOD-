import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio — RiskBases",
};

export default async function PortfolioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get user's workspace membership + workspace info
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, slug)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) redirect("/app/onboarding");

  const workspace = (membership as any).workspaces as {
    id: string;
    name: string;
    slug: string;
  };

  // Get subscription/plan
  const { data: subscription } = await supabase
    .from("workspace_subscriptions")
    .select("plan, status, trial_ends_at")
    .eq("workspace_id", workspace.id)
    .maybeSingle();

  const plan = subscription?.plan ?? "trial";
  const trialEndsAt = subscription?.trial_ends_at ?? null;

  // Fetch projects for this workspace
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, description, status, sector, reference, start_date, end_date, created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <PortfolioClient
      workspace={workspace}
      plan={plan}
      trialEndsAt={trialEndsAt}
      projects={projects ?? []}
      fetchError={error?.message ?? null}
      userRole={membership.role}
    />
  );
}
