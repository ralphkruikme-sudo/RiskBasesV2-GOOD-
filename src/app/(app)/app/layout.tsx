import { getUser, getWorkspaceMembership } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Determine onboarding status ONLY by workspace_members existence
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isOnboarding = pathname.includes("/onboarding");

  const { membership, error: memberError } = await getWorkspaceMembership(user.id);
  const hasMembership = !!membership;

  if (!isOnboarding && !hasMembership && !memberError) {
    redirect("/app/onboarding");
  }

  // If user IS on onboarding but already has a membership, send to /app
  if (isOnboarding && hasMembership) {
    redirect("/app");
  }

  return <>{children}</>;
}
