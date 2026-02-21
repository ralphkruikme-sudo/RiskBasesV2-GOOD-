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
    .select("id, name, description, is_active")
    .order("name");

  return <NewProjectWizard modules={modules ?? []} />;
}
