import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepStakeholders from "./StepStakeholders";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step3Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  const { data: stakeholders } = await supabase
    .from("stakeholders")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at");

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepStakeholders
        projectId={project.id}
        initialStakeholders={stakeholders ?? []}
      />
    </SetupShell>
  );
}
