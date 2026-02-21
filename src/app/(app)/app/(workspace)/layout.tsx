import { getUser } from "@/lib/supabase/server";
import WorkspaceTopbar from "./WorkspaceTopbar";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const email = user?.email ?? "";

  return (
    <div className="min-h-screen bg-slate-50">
      <WorkspaceTopbar
        displayName={displayName}
        initials={initials}
        email={email}
      />
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
