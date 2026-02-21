import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      {/* Logo */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-xl font-bold text-navy"
      >
        <svg className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        RiskBases
      </Link>

      {children}
    </div>
  );
}
