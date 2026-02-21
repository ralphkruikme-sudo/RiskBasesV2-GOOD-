import { getProjectForSetup } from "../../helpers";
import SetupShell from "../SetupShell";
import StepPlanning from "./StepPlanning";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Step2Page({ params }: PageProps) {
  const { id } = await params;
  const { supabase, project } = await getProjectForSetup(id);

  // Fetch existing planning values (stored as intake values with planning_ prefix)
  const { data: existing } = await supabase
    .from("project_intake_values")
    .select("field_key, value")
    .eq("project_id", project.id)
    .like("field_key", "planning_%");

  const planningData: Record<string, unknown> = {};
  existing?.forEach((v) => {
    planningData[v.field_key] = v.value;
  });

  return (
    <SetupShell projectId={project.id} projectName={project.name}>
      <StepPlanning projectId={project.id} existingData={planningData} />
    </SetupShell>
  );
}
