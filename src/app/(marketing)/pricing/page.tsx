import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — RiskBases",
  description: "Simple, transparent pricing. All modules included on every plan.",
};

/* ────────────────────── DATA ────────────────────── */

const tiers = [
  {
    name: "Standard",
    price: "€199",
    period: "/mo",
    description: "Everything you need to run structured risk management across projects.",
    features: [
      "All industry modules",
      "Unlimited risks",
      "Risk register & matrix",
      "Dashboards & heatmaps",
      "Control measures",
      "Collaboration & roles",
      "Audit trail",
      "Email support",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "€349",
    period: "/mo",
    description: "Advanced analytics and integrations for teams that need deeper insight.",
    badge: "Most Popular",
    features: [
      "Everything in Standard",
      "Portfolio analytics",
      "Integrations framework",
      "Custom report builder",
      "Priority support",
      "API access",
      "Advanced permissions",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Full control, compliance, and dedicated support for large organizations.",
    features: [
      "Everything in Premium",
      "SSO (SAML / OIDC)",
      "SCIM provisioning",
      "Monte Carlo & Tornado analysis",
      "Dedicated CSM",
      "Custom SLA",
      "On-premise option",
    ],
    cta: "Book a Demo",
    ctaHref: "/book-demo",
    highlighted: false,
    futureNote: "Monte Carlo & Tornado — coming soon",
  },
];

type FeatureAvailability = true | false | "coming-soon";

const comparisonFeatures: {
  category: string;
  rows: { feature: string; standard: FeatureAvailability; premium: FeatureAvailability; enterprise: FeatureAvailability }[];
}[] = [
  {
    category: "Core",
    rows: [
      { feature: "All industry modules", standard: true, premium: true, enterprise: true },
      { feature: "Unlimited risks", standard: true, premium: true, enterprise: true },
      { feature: "Risk register & matrix", standard: true, premium: true, enterprise: true },
      { feature: "Dashboards & heatmaps", standard: true, premium: true, enterprise: true },
      { feature: "Control measures", standard: true, premium: true, enterprise: true },
      { feature: "Collaboration & roles", standard: true, premium: true, enterprise: true },
      { feature: "Audit trail", standard: true, premium: true, enterprise: true },
    ],
  },
  {
    category: "Advanced",
    rows: [
      { feature: "Portfolio analytics", standard: false, premium: true, enterprise: true },
      { feature: "Integrations framework", standard: false, premium: true, enterprise: true },
      { feature: "Custom report builder", standard: false, premium: true, enterprise: true },
      { feature: "API access", standard: false, premium: true, enterprise: true },
      { feature: "Advanced permissions", standard: false, premium: true, enterprise: true },
    ],
  },
  {
    category: "Enterprise",
    rows: [
      { feature: "SSO (SAML / OIDC)", standard: false, premium: false, enterprise: true },
      { feature: "SCIM provisioning", standard: false, premium: false, enterprise: true },
      { feature: "Monte Carlo simulation", standard: false, premium: false, enterprise: "coming-soon" },
      { feature: "Tornado analysis", standard: false, premium: false, enterprise: "coming-soon" },
      { feature: "Dedicated CSM", standard: false, premium: false, enterprise: true },
      { feature: "Custom SLA", standard: false, premium: false, enterprise: true },
      { feature: "On-premise option", standard: false, premium: false, enterprise: true },
    ],
  },
  {
    category: "Support",
    rows: [
      { feature: "Email support", standard: true, premium: true, enterprise: true },
      { feature: "Priority support", standard: false, premium: true, enterprise: true },
      { feature: "Dedicated account manager", standard: false, premium: false, enterprise: true },
    ],
  },
];

/* ────────────────────── HELPERS ────────────────────── */

function CellIcon({ value }: { value: FeatureAvailability }) {
  if (value === true) {
    return (
      <svg className="mx-auto h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (value === "coming-soon") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
        Soon
      </span>
    );
  }
  return (
    <svg className="mx-auto h-5 w-5 text-slate-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  );
}

/* ──────────────────── PAGE ──────────────────── */

export default function PricingPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent mb-6">
            Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.1]">
            One platform. All modules included.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Every plan gives you access to all industry modules — Construction,
            Infrastructure, Maritime, and more. Plans only differ in features,
            analytics depth, and support level.
          </p>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border bg-white p-8 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                  tier.highlighted
                    ? "border-accent shadow-lg ring-1 ring-accent"
                    : "border-slate-200"
                }`}
              >
                {/* Popular badge */}
                {"badge" in tier && tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <h2 className="text-xl font-bold text-navy">{tier.name}</h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed min-h-[40px]">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-base text-slate-400 font-medium">{tier.period}</span>
                  )}
                </div>
                {tier.price !== "Custom" && (
                  <p className="mt-1 text-xs text-slate-400">per user, billed annually</p>
                )}

                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {"futureNote" in tier && tier.futureNote && (
                  <p className="mt-4 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    * {tier.futureNote}
                  </p>
                )}

                <Link
                  href={tier.ctaHref}
                  className={`mt-8 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[.98] ${
                    tier.highlighted
                      ? "bg-accent text-white shadow-sm hover:bg-accent-hover hover:shadow-md"
                      : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:shadow-sm"
                  }`}
                >
                  {tier.cta}
                  {tier.cta === "Book a Demo" && (
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* All-modules note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
              <svg className="h-5 w-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-navy">All modules included on every plan.</span>{" "}
                Construction, Infrastructure, Maritime, Industrial, Energy, Real Estate &amp; Events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Compare Plans</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
              Feature comparison
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              See exactly what&apos;s included in each plan.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              {/* Header */}
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-5 px-6 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider w-[40%]">
                    Feature
                  </th>
                  <th className="py-5 px-4 text-center font-semibold text-navy w-[20%]">
                    Standard
                    <span className="block text-xs font-medium text-slate-400 mt-0.5">€199/mo</span>
                  </th>
                  <th className="py-5 px-4 text-center font-semibold text-accent w-[20%]">
                    Premium
                    <span className="block text-xs font-medium text-accent/70 mt-0.5">€349/mo</span>
                  </th>
                  <th className="py-5 px-4 text-center font-semibold text-navy w-[20%]">
                    Enterprise
                    <span className="block text-xs font-medium text-slate-400 mt-0.5">Custom</span>
                  </th>
                </tr>
              </thead>
              {comparisonFeatures.map((group) => (
                <tbody key={group.category}>
                  {/* Category header */}
                  <tr className="bg-slate-50/50">
                    <td
                      colSpan={4}
                      className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {group.category}
                    </td>
                  </tr>
                  {group.rows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i < group.rows.length - 1 ? "border-b border-slate-100" : "border-b border-slate-200"}
                    >
                      <td className="py-3.5 px-6 text-slate-600">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center">
                        <CellIcon value={row.standard} />
                      </td>
                      <td className="py-3.5 px-4 text-center bg-accent/[.02]">
                        <CellIcon value={row.premium} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <CellIcon value={row.enterprise} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ + CTA ─── */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Ready to get started?
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Start a 14-day free trial with full access — no credit card required.
            Or book a personalized demo with our team.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]"
            >
              Start Free Trial
            </Link>
            <Link
              href="/book-demo"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]"
            >
              Book a Demo
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
