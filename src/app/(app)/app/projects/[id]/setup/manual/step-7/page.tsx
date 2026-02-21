import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepActions from "./StepActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step7Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  const { data: risks } = await supabase
    .from("risks")
    .select("id, title, category")
    .eq("project_id", project.id)
    .order("created_at");

  const { data: actions } = await supabase
    .from("actions")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at");

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepActions
        projectId={project.id}
        risks={risks ?? []}
        initialActions={actions ?? []}
      />
    </SetupShell>
  );
}
