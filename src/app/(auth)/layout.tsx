import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <img src="/logo.svg" alt="RiskBases" className="h-9" />
        <span className="text-xl font-bold text-navy">RiskBases</span>
      </Link>

      {children}
    </div>
  );
}
