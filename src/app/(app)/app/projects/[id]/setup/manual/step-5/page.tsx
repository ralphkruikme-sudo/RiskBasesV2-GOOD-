import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepConstraints from "./StepConstraints";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step5Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  const { data: existing } = await supabase
    .from("project_intake_values")
    .select("field_key, value")
    .eq("project_id", project.id)
    .in("field_key", ["constraints", "assumptions", "dependencies"]);

  const data: Record<string, string> = {};
  existing?.forEach((v) => {
    data[v.field_key] = (v.value as string) ?? "";
  });

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepConstraints projectId={project.id} existingData={data} />
    </SetupShell>
  );
}
