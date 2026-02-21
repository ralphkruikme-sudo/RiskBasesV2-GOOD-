import { getProjectForSetup } from "../helpers";
import ApiSetup from "./ApiSetup";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApiSetupPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  const { data: integrations } = await supabase
    .from("project_integrations")
    .select("*")
    .eq("project_id", project.id);

  return (
    <ApiSetup
      projectId={project.id}
      projectName={project.name}
      existingIntegrations={integrations ?? []}
    />
  );
}
