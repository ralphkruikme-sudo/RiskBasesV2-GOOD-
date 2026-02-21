import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Fetch project + verify user has access. Used by all setup pages.
 */
export async function getProjectForSetup(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, workspace_id, module_id, ingest_type, setup_status")
    .eq("id", projectId)
    .single();

  if (!project) redirect("/app/portfolio");

  return { supabase, user, project };
}
