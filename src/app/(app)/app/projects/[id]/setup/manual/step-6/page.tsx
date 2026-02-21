import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepRisks from "./StepRisks";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step6Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  // Fetch existing risks
  const { data: risks } = await supabase
    .from("risks")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at");

  // Fetch templates for this module
  const { data: templates } = await supabase
    .from("module_risk_templates")
    .select("*")
    .eq("module_id", project.module_id)
    .order("sort_order");

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepRisks
        projectId={project.id}
        initialRisks={risks ?? []}
        templates={templates ?? []}
      />
    </SetupShell>
  );
}
