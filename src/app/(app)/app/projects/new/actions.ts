"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moduleId = formData.get("module_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const startDate = formData.get("start_date") as string | null;
  const endDate = formData.get("end_date") as string | null;
  const ingestType = formData.get("ingest_type") as string;

  if (!moduleId || !name || !ingestType) {
    return { error: "Vul alle verplichte velden in." };
  }

  // Get user's workspace
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return { error: "Geen workspace gevonden." };
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      workspace_id: membership.workspace_id,
      module_id: moduleId,
      name,
      start_date: startDate || null,
      end_date: endDate || null,
      ingest_type: ingestType,
      setup_status: "in_progress",
      status: "draft",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !project) {
    console.error("Project create error:", error);
    return { error: "Kon project niet aanmaken. Probeer het opnieuw." };
  }

  // Redirect based on ingest type
  const routes: Record<string, string> = {
    manual: `/app/projects/${project.id}/setup/manual/step-1`,
    csv: `/app/projects/${project.id}/setup/csv`,
    api: `/app/projects/${project.id}/setup/api`,
  };

  redirect(routes[ingestType] ?? routes.manual);
}
