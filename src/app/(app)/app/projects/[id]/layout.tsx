import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectSidebar from "./ProjectSidebar";
import ProjectTopbar from "./ProjectTopbar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjectLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, status, setup_status, module_id")
    .eq("id", id)
    .single();

  if (!project) redirect("/app");

  /* Build user display data */
  const meta = user.user_metadata ?? {};
  const displayName = meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar */}
      <ProjectSidebar project={project} />

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0">
        <ProjectTopbar
          projectName={project.name}
          userInitials={initials}
          userEmail={user.email ?? ""}
          moduleId={project.module_id}
        />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
