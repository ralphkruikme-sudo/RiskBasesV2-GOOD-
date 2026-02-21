import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import LogoutButton from "./LogoutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user server-side — middleware already protects this route
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check workspace membership — redirect to onboarding if none
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isOnboarding = pathname.includes("/onboarding");

  if (!isOnboarding) {
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      redirect("/app/onboarding");
    }
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-navy">
        <div className="flex h-16 items-center px-6">
          <Link href="/app" className="text-lg font-bold text-white">
            RiskBases
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: "Dashboard", href: "/app" },
            { label: "Portfolio", href: "/app/portfolio" },
            { label: "Nieuw project", href: "/app/projects/new" },
            { label: "Risk Register", href: "/app" },
            { label: "Assessments", href: "/app" },
            { label: "Controls", href: "/app" },
            { label: "Reports", href: "/app" },
            { label: "Settings", href: "/app" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-navy-light hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-700 px-3 py-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
