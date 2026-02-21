import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewProjectWizard from "./NewProjectWizard";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch available modules
  const { data: modules } = await supabase
    .from("modules")
    .select("id, slug, name, description, icon, enabled")
    .order("sort_order");

  return <NewProjectWizard modules={modules ?? []} />;
}
