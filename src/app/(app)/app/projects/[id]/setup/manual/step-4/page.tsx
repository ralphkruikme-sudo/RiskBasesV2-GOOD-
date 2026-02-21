import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepPermits from "./StepPermits";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step4Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  const { data: permits } = await supabase
    .from("permits")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at");

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepPermits projectId={project.id} initialPermits={permits ?? []} />
    </SetupShell>
  );
}
