import { getUser, getWorkspaceMembership } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* Onboarding has its own fullscreen UI — suppress the app chrome */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (!user) redirect("/login");

  // If the user already has a workspace, they don't belong here
  const { membership } = await getWorkspaceMembership(user.id);
  if (membership) {
    redirect("/app");
  }

  return <>{children}</>;
}
