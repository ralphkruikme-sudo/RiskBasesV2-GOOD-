import Link from "next/link";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { href: "/#product", label: "Overzicht" },
      { href: "/#modules", label: "Modules" },
      { href: "/pricing", label: "Prijzen" },
      { href: "/about", label: "Over ons" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Aan de slag",
    links: [
      { href: "/book-demo", label: "Plan een demo" },
      { href: "/signup", label: "Gratis starten" },
    ],
  },
  {
    heading: "Juridisch",
    links: [
      { href: "/legal/privacy", label: "Privacybeleid" },
      { href: "/legal/terms", label: "Algemene voorwaarden" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand + contact */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-navy">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              RiskBases
            </Link>
            <p className="mt-3 text-sm text-slate-500 max-w-xs leading-relaxed">
              Het risicomanagementplatform voor projectteams in bouw, infra en industrie.
            </p>

            <div className="mt-5 space-y-2">
              <a
                href="mailto:info@riskbases.com"
                className="flex items-center gap-2 text-sm text-slate-500 transition-colors duration-200 hover:text-accent"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@riskbases.com
              </a>
              <a
                href="mailto:support@riskbases.com"
                className="flex items-center gap-2 text-sm text-slate-500 transition-colors duration-200 hover:text-accent"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                support@riskbases.com
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 transition-colors duration-200 hover:text-navy"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} RiskBases. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/legal/privacy" className="hover:text-slate-600 transition-colors duration-200">
              Privacy
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/legal/terms" className="hover:text-slate-600 transition-colors duration-200">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
