import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepReview from "./StepReview";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step8Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  // Gather all setup data for review
  const [intakeRes, stakeholderRes, permitRes, riskRes, actionRes] =
    await Promise.all([
      supabase
        .from("project_intake_values")
        .select("field_key, value")
        .eq("project_id", project.id),
      supabase
        .from("stakeholders")
        .select("id, name, role, influence_level, sentiment")
        .eq("project_id", project.id),
      supabase
        .from("permits")
        .select("id, name, status, type")
        .eq("project_id", project.id),
      supabase
        .from("risks")
        .select("id, title, category, probability, impact, risk_score")
        .eq("project_id", project.id),
      supabase
        .from("actions")
        .select("id, title, priority, status")
        .eq("project_id", project.id),
    ]);

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepReview
        projectId={project.id}
        intakeValues={intakeRes.data ?? []}
        stakeholders={stakeholderRes.data ?? []}
        permits={permitRes.data ?? []}
        risks={riskRes.data ?? []}
        actions={actionRes.data ?? []}
      />
    </SetupShell>
  );
}
