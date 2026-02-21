import { getProjectForSetup } from "../helpers";
import CsvSetup from "./CsvSetup";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CsvSetupPage({ params }: PageProps) {
  const { id } = await params;
  const { project } = await getProjectForSetup(id);

  return <CsvSetup projectId={project.id} projectName={project.name} />;
}
