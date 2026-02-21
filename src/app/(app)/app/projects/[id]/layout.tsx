import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectShell from "./ProjectShell";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjectLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, status, setup_status")
    .eq("id", id)
    .single();

  if (!project) redirect("/app");

  return (
    <ProjectShell project={project}>
      {children}
    </ProjectShell>
  );
}
