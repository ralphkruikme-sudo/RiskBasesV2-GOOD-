import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Determine onboarding status ONLY by workspace_members existence
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isOnboarding = pathname.includes("/onboarding");

  const { data: members, error: memberError } = await supabase
    .from("workspace_members")
    .select("id, workspace_id")
    .eq("user_id", user.id)
    .limit(1);

  const memberCount = members?.length ?? 0;
  const defaultWsId = members?.[0]?.workspace_id ?? null;

  console.log("[AppLayout guard]", {
    userId: user.id,
    pathname,
    isOnboarding,
    memberCount,
    defaultWorkspaceId: defaultWsId,
    memberError: memberError?.message ?? null,
  });

  if (!isOnboarding && memberCount === 0 && !memberError) {
    redirect("/app/onboarding");
  }

  // If user IS on onboarding but already has a membership, send to /app
  if (isOnboarding && memberCount > 0) {
    redirect("/app");
  }

  return <>{children}</>;
}
