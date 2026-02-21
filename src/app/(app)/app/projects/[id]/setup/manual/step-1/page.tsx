import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepIntake from "./StepIntake";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step1Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  // Fetch module intake fields
  const { data: fields } = await supabase
    .from("module_intake_fields")
    .select("*")
    .eq("module_id", project.module_id)
    .order("sort_order");

  // Fetch existing intake values
  const { data: existingValues } = await supabase
    .from("project_intake_values")
    .select("field_key, value")
    .eq("project_id", project.id);

  const valuesMap: Record<string, unknown> = {};
  existingValues?.forEach((v) => {
    valuesMap[v.field_key] = v.value;
  });

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepIntake
        projectId={project.id}
        fields={fields ?? []}
        existingValues={valuesMap}
      />
    </SetupShell>
  );
}
