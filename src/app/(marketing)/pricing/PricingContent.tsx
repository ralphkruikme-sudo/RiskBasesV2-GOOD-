"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";

/* ───── TYPES ───── */
type FeatureAvailability = true | false | "coming-soon";
type TierDef = {
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  futureNote?: string;
};
type ComparisonGroup = {
  category: string;
  rows: { feature: string; standard: FeatureAvailability; premium: FeatureAvailability; enterprise: FeatureAvailability }[];
};

/* ───── TRANSLATIONS ───── */

const translations: Record<Locale, {
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  allModulesTitle: string;
  allModulesDesc: string;
  perUser: string;
  compareLabel: string;
  compareTitle: string;
  compareDesc: string;
  featureCol: string;
  soon: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaTrial: string;
  ctaDemo: string;
  tiers: TierDef[];
  comparisonFeatures: ComparisonGroup[];
}> = {
  nl: {
    heroBadge: "Eenvoudige, Transparante Prijzen",
    heroTitle: "E\u00e9n platform. Alle modules inbegrepen.",
    heroDesc: "Elk abonnement geeft je toegang tot alle branchemodules \u2014 Bouw, Infra, Maritiem en meer. Abonnementen verschillen alleen in functies, analysediepte en ondersteuningsniveau.",
    perUser: "per gebruiker, jaarlijks gefactureerd",
    allModulesTitle: "Alle modules inbegrepen bij elk abonnement.",
    allModulesDesc: "Bouw, Infra, Maritiem, Industrie, Energie, Vastgoed & Evenementen.",
    compareLabel: "Vergelijk Abonnementen",
    compareTitle: "Functievergelijking",
    compareDesc: "Bekijk precies wat er in elk abonnement zit.",
    featureCol: "Functie",
    soon: "Binnenkort",
    ctaTitle: "Klaar om te starten?",
    ctaDesc: "Start een gratis proefperiode van 14 dagen met volledige toegang \u2014 geen creditcard nodig. Of plan een persoonlijke demo met ons team.",
    ctaTrial: "Gratis Uitproberen",
    ctaDemo: "Plan een Demo",
    tiers: [
      {
        name: "Standard",
        price: "\u20ac199",
        period: "/mnd",
        description: "Alles wat je nodig hebt voor gestructureerd risicomanagement in projecten.",
        features: [
          "Alle branchemodules",
          "Onbeperkt risico\u2019s",
          "Risicoregister & matrix",
          "Dashboards & heatmaps",
          "Beheersmaatregelen",
          "Samenwerking & rollen",
          "Audit trail",
          "E-mail support",
        ],
        cta: "Gratis Uitproberen",
        ctaHref: "/signup",
        highlighted: false,
      },
      {
        name: "Premium",
        price: "\u20ac349",
        period: "/mnd",
        description: "Geavanceerde analyses en integraties voor teams die dieper inzicht nodig hebben.",
        badge: "Populairst",
        features: [
          "Alles in Standard",
          "Portfolio-analyses",
          "Integratieframework",
          "Custom rapportbouwer",
          "Prioritaire support",
          "API-toegang",
          "Geavanceerde rechten",
        ],
        cta: "Gratis Uitproberen",
        ctaHref: "/signup",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "Op maat",
        period: "",
        description: "Volledige controle, compliance en toegewijde ondersteuning voor grote organisaties.",
        features: [
          "Alles in Premium",
          "SSO (SAML / OIDC)",
          "SCIM-provisioning",
          "Monte Carlo & Tornado-analyse",
          "Dedicated CSM",
          "Custom SLA",
          "On-premise optie",
        ],
        cta: "Plan een Demo",
        ctaHref: "/book-demo",
        highlighted: false,
        futureNote: "Monte Carlo & Tornado \u2014 binnenkort beschikbaar",
      },
    ],
    comparisonFeatures: [
      {
        category: "Kern",
        rows: [
          { feature: "Alle branchemodules", standard: true, premium: true, enterprise: true },
          { feature: "Onbeperkt risico\u2019s", standard: true, premium: true, enterprise: true },
          { feature: "Risicoregister & matrix", standard: true, premium: true, enterprise: true },
          { feature: "Dashboards & heatmaps", standard: true, premium: true, enterprise: true },
          { feature: "Beheersmaatregelen", standard: true, premium: true, enterprise: true },
          { feature: "Samenwerking & rollen", standard: true, premium: true, enterprise: true },
          { feature: "Audit trail", standard: true, premium: true, enterprise: true },
        ],
      },
      {
        category: "Geavanceerd",
        rows: [
          { feature: "Portfolio-analyses", standard: false, premium: true, enterprise: true },
          { feature: "Integratieframework", standard: false, premium: true, enterprise: true },
          { feature: "Custom rapportbouwer", standard: false, premium: true, enterprise: true },
          { feature: "API-toegang", standard: false, premium: true, enterprise: true },
          { feature: "Geavanceerde rechten", standard: false, premium: true, enterprise: true },
        ],
      },
      {
        category: "Enterprise",
        rows: [
          { feature: "SSO (SAML / OIDC)", standard: false, premium: false, enterprise: true },
          { feature: "SCIM-provisioning", standard: false, premium: false, enterprise: true },
          { feature: "Monte Carlo-simulatie", standard: false, premium: false, enterprise: "coming-soon" },
          { feature: "Tornado-analyse", standard: false, premium: false, enterprise: "coming-soon" },
          { feature: "Dedicated CSM", standard: false, premium: false, enterprise: true },
          { feature: "Custom SLA", standard: false, premium: false, enterprise: true },
          { feature: "On-premise optie", standard: false, premium: false, enterprise: true },
        ],
      },
      {
        category: "Support",
        rows: [
          { feature: "E-mail support", standard: true, premium: true, enterprise: true },
          { feature: "Prioritaire support", standard: false, premium: true, enterprise: true },
          { feature: "Dedicated accountmanager", standard: false, premium: false, enterprise: true },
        ],
      },
    ],
  },
  en: {
    heroBadge: "Simple, Transparent Pricing",
    heroTitle: "One platform. All modules included.",
    heroDesc: "Every plan gives you access to all industry modules \u2014 Construction, Infrastructure, Maritime, and more. Plans only differ in features, analytics depth, and support level.",
    perUser: "per user, billed annually",
    allModulesTitle: "All modules included on every plan.",
    allModulesDesc: "Construction, Infrastructure, Maritime, Industrial, Energy, Real Estate & Events.",
    compareLabel: "Compare Plans",
    compareTitle: "Feature comparison",
    compareDesc: "See exactly what\u2019s included in each plan.",
    featureCol: "Feature",
    soon: "Soon",
    ctaTitle: "Ready to get started?",
    ctaDesc: "Start a 14-day free trial with full access \u2014 no credit card required. Or book a personalized demo with our team.",
    ctaTrial: "Start Free Trial",
    ctaDemo: "Book a Demo",
    tiers: [
      {
        name: "Standard",
        price: "\u20ac199",
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
        price: "\u20ac349",
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
        futureNote: "Monte Carlo & Tornado \u2014 coming soon",
      },
    ],
    comparisonFeatures: [
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
    ],
  },
  de: {
    heroBadge: "Einfache, Transparente Preise",
    heroTitle: "Eine Plattform. Alle Module inklusive.",
    heroDesc: "Jeder Plan bietet Zugang zu allen Branchenmodulen \u2014 Bau, Infrastruktur, Maritim und mehr. Pl\u00e4ne unterscheiden sich nur in Funktionen, Analysetiefe und Support-Level.",
    perUser: "pro Benutzer, j\u00e4hrlich abgerechnet",
    allModulesTitle: "Alle Module in jedem Plan enthalten.",
    allModulesDesc: "Bau, Infrastruktur, Maritim, Industrie, Energie, Immobilien & Veranstaltungen.",
    compareLabel: "Pl\u00e4ne vergleichen",
    compareTitle: "Funktionsvergleich",
    compareDesc: "Sehen Sie genau, was in jedem Plan enthalten ist.",
    featureCol: "Funktion",
    soon: "Demn\u00e4chst",
    ctaTitle: "Bereit loszulegen?",
    ctaDesc: "Starten Sie eine 14-t\u00e4gige kostenlose Testphase mit vollem Zugang \u2014 keine Kreditkarte erforderlich. Oder buchen Sie eine pers\u00f6nliche Demo mit unserem Team.",
    ctaTrial: "Kostenlos Testen",
    ctaDemo: "Demo Buchen",
    tiers: [
      {
        name: "Standard",
        price: "\u20ac199",
        period: "/Mon.",
        description: "Alles, was Sie f\u00fcr strukturiertes Risikomanagement in Projekten brauchen.",
        features: [
          "Alle Branchenmodule",
          "Unbegrenzte Risiken",
          "Risikoregister & Matrix",
          "Dashboards & Heatmaps",
          "Beherrschungsma\u00dfnahmen",
          "Zusammenarbeit & Rollen",
          "Audit Trail",
          "E-Mail-Support",
        ],
        cta: "Kostenlos Testen",
        ctaHref: "/signup",
        highlighted: false,
      },
      {
        name: "Premium",
        price: "\u20ac349",
        period: "/Mon.",
        description: "Erweiterte Analysen und Integrationen f\u00fcr Teams, die tiefere Einblicke ben\u00f6tigen.",
        badge: "Beliebteste",
        features: [
          "Alles in Standard",
          "Portfolio-Analysen",
          "Integrationsframework",
          "Benutzerdefinierter Berichtsbauer",
          "Priorit\u00e4ts-Support",
          "API-Zugang",
          "Erweiterte Berechtigungen",
        ],
        cta: "Kostenlos Testen",
        ctaHref: "/signup",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "Individuell",
        period: "",
        description: "Volle Kontrolle, Compliance und dedizierter Support f\u00fcr gro\u00dfe Organisationen.",
        features: [
          "Alles in Premium",
          "SSO (SAML / OIDC)",
          "SCIM-Provisioning",
          "Monte Carlo & Tornado-Analyse",
          "Dedicated CSM",
          "Individuelles SLA",
          "On-premise Option",
        ],
        cta: "Demo Buchen",
        ctaHref: "/book-demo",
        highlighted: false,
        futureNote: "Monte Carlo & Tornado \u2014 demn\u00e4chst verf\u00fcgbar",
      },
    ],
    comparisonFeatures: [
      {
        category: "Kern",
        rows: [
          { feature: "Alle Branchenmodule", standard: true, premium: true, enterprise: true },
          { feature: "Unbegrenzte Risiken", standard: true, premium: true, enterprise: true },
          { feature: "Risikoregister & Matrix", standard: true, premium: true, enterprise: true },
          { feature: "Dashboards & Heatmaps", standard: true, premium: true, enterprise: true },
          { feature: "Beherrschungsma\u00dfnahmen", standard: true, premium: true, enterprise: true },
          { feature: "Zusammenarbeit & Rollen", standard: true, premium: true, enterprise: true },
          { feature: "Audit Trail", standard: true, premium: true, enterprise: true },
        ],
      },
      {
        category: "Erweitert",
        rows: [
          { feature: "Portfolio-Analysen", standard: false, premium: true, enterprise: true },
          { feature: "Integrationsframework", standard: false, premium: true, enterprise: true },
          { feature: "Berichtsbauer", standard: false, premium: true, enterprise: true },
          { feature: "API-Zugang", standard: false, premium: true, enterprise: true },
          { feature: "Erweiterte Berechtigungen", standard: false, premium: true, enterprise: true },
        ],
      },
      {
        category: "Enterprise",
        rows: [
          { feature: "SSO (SAML / OIDC)", standard: false, premium: false, enterprise: true },
          { feature: "SCIM-Provisioning", standard: false, premium: false, enterprise: true },
          { feature: "Monte-Carlo-Simulation", standard: false, premium: false, enterprise: "coming-soon" },
          { feature: "Tornado-Analyse", standard: false, premium: false, enterprise: "coming-soon" },
          { feature: "Dedicated CSM", standard: false, premium: false, enterprise: true },
          { feature: "Individuelles SLA", standard: false, premium: false, enterprise: true },
          { feature: "On-premise Option", standard: false, premium: false, enterprise: true },
        ],
      },
      {
        category: "Support",
        rows: [
          { feature: "E-Mail-Support", standard: true, premium: true, enterprise: true },
          { feature: "Priorit\u00e4ts-Support", standard: false, premium: true, enterprise: true },
          { feature: "Dedizierter Accountmanager", standard: false, premium: false, enterprise: true },
        ],
      },
    ],
  },
};

/* ───── HELPERS ───── */

function CellIcon({ value, soonLabel }: { value: FeatureAvailability; soonLabel: string }) {
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
        {soonLabel}
      </span>
    );
  }
  return (
    <svg className="mx-auto h-5 w-5 text-slate-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  );
}

/* ──────────────────── COMPONENT ──────────────────── */

export default function PricingContent() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent mb-6">
            {t.heroBadge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.1]">
            {t.heroTitle}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {t.tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border bg-white p-8 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                  tier.highlighted ? "border-accent shadow-lg ring-1 ring-accent" : "border-slate-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-navy">{tier.name}</h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed min-h-[40px]">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                  {tier.period && <span className="text-base text-slate-400 font-medium">{tier.period}</span>}
                </div>
                {tier.price !== "Custom" && tier.price !== "Op maat" && tier.price !== "Individuell" && (
                  <p className="mt-1 text-xs text-slate-400">{t.perUser}</p>
                )}
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.futureNote && (
                  <p className="mt-4 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">* {tier.futureNote}</p>
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
                  {tier.ctaHref === "/book-demo" && (
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
                <span className="font-semibold text-navy">{t.allModulesTitle}</span>{" "}
                {t.allModulesDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.compareLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">{t.compareTitle}</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">{t.compareDesc}</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-5 px-6 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider w-[40%]">{t.featureCol}</th>
                  <th className="py-5 px-4 text-center font-semibold text-navy w-[20%]">
                    Standard
                    <span className="block text-xs font-medium text-slate-400 mt-0.5">\u20ac199{t.tiers[0].period}</span>
                  </th>
                  <th className="py-5 px-4 text-center font-semibold text-accent w-[20%]">
                    Premium
                    <span className="block text-xs font-medium text-accent/70 mt-0.5">\u20ac349{t.tiers[1].period}</span>
                  </th>
                  <th className="py-5 px-4 text-center font-semibold text-navy w-[20%]">
                    Enterprise
                    <span className="block text-xs font-medium text-slate-400 mt-0.5">{t.tiers[2].price}</span>
                  </th>
                </tr>
              </thead>
              {t.comparisonFeatures.map((group) => (
                <tbody key={group.category}>
                  <tr className="bg-slate-50/50">
                    <td colSpan={4} className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {group.category}
                    </td>
                  </tr>
                  {group.rows.map((row, i) => (
                    <tr key={row.feature} className={i < group.rows.length - 1 ? "border-b border-slate-100" : "border-b border-slate-200"}>
                      <td className="py-3.5 px-6 text-slate-600">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center"><CellIcon value={row.standard} soonLabel={t.soon} /></td>
                      <td className="py-3.5 px-4 text-center bg-accent/[.02]"><CellIcon value={row.premium} soonLabel={t.soon} /></td>
                      <td className="py-3.5 px-4 text-center"><CellIcon value={row.enterprise} soonLabel={t.soon} /></td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">{t.ctaTitle}</h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">{t.ctaDesc}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]">
              {t.ctaTrial}
            </Link>
            <Link href="/book-demo" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]">
              {t.ctaDemo}
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
