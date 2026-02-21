"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";

/* ───── TRANSLATIONS ───── */

const translations: Record<Locale, {
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroContact: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaDemo: string;
  ctaEmail: string;
}> = {
  nl: {
    heroBadge: "FAQ",
    heroTitle: "Veelgestelde vragen",
    heroDesc: "Vind snel antwoord op de meest gestelde vragen over RiskBases. Staat jouw vraag er niet bij? ",
    heroContact: "Neem contact op",
    faqs: [
      { q: "Welke modules zijn beschikbaar?", a: "RiskBases biedt modules voor Bouw, Infra & Civiel, Maritiem & Offshore, Industri\u00eble Projecten, Energietransitie, Vastgoed & FM en Evenementen. De modules voor Bouw en Infra & Civiel zijn nu live \u2014 de overige worden in de komende maanden gelanceerd. Alle modules zijn inbegrepen bij elk abonnement." },
      { q: "Hoe werkt de onboarding?", a: "Na het aanmaken van een account kun je direct aan de slag. Maak een project aan, kies een module en begin met het registreren van risico\u2019s. Er is geen implementatietraject of training nodig \u2014 het platform is ontworpen om intu\u00eftief te zijn. Voor Enterprise-klanten bieden we optioneel begeleide onboarding." },
      { q: "Hoe is de databeveiliging geregeld?", a: "Alle data wordt verwerkt en opgeslagen binnen de EU, versleuteld in transit (TLS 1.3) en at rest (AES-256). We hanteren strikte toegangscontroles, voeren regelmatig pentests uit en zijn AVG/GDPR-compliant. Enterprise-klanten kunnen gebruik maken van SSO (SAML/OIDC) en SCIM-provisioning." },
      { q: "Wat kost RiskBases?", a: "We bieden drie abonnementen: Standard (\u20ac199/mo), Premium (\u20ac349/mo) en Enterprise (op maat). Alle abonnementen bevatten alle branchemodules \u2014 het verschil zit in functies zoals portfolio-analyses, integraties en SSO. Je kunt 14 dagen gratis uitproberen zonder creditcard." },
      { q: "Kan ik RiskBases integreren met andere tools?", a: "Ja. Vanaf het Premium-abonnement heb je toegang tot het integratieframework en de API. Hiermee kun je RiskBases koppelen aan je projectmanagement-, ERP- of BI-tooling. Op Enterprise-niveau ondersteunen we ook maatwerkkoppelingen." },
      { q: "Kan ik data exporteren?", a: "Uiteraard. Je kunt risico\u2019s, rapportages en dashboardweergaven exporteren naar Excel, PDF en CSV. Enterprise-klanten kunnen daarnaast gebruik maken van de API voor geautomatiseerde exports en koppelingen." },
      { q: "Welke ondersteuning bieden jullie?", a: "Standard-gebruikers ontvangen ondersteuning via e-mail. Premium-klanten krijgen prioritaire support met snellere responstijden. Enterprise-klanten beschikken over een dedicated accountmanager en een op maat gemaakte SLA." },
    ],
    ctaTitle: "Nog vragen?",
    ctaDesc: "Neem contact op met ons team of plan direct een demo.",
    ctaDemo: "Plan een demo",
    ctaEmail: "Stuur ons een e-mail",
  },
  en: {
    heroBadge: "FAQ",
    heroTitle: "Frequently asked questions",
    heroDesc: "Find answers to the most common questions about RiskBases. Can\u2019t find your question? ",
    heroContact: "Contact us",
    faqs: [
      { q: "Which modules are available?", a: "RiskBases offers modules for Construction, Infrastructure & Civil, Maritime & Offshore, Industrial Projects, Energy Transition, Real Estate & FM, and Events. The Construction and Infrastructure modules are live now \u2014 the rest will launch in the coming months. All modules are included in every plan." },
      { q: "How does onboarding work?", a: "After creating an account, you can get started right away. Create a project, choose a module, and start registering risks. No implementation process or training is needed \u2014 the platform is designed to be intuitive. For Enterprise customers, we offer optional guided onboarding." },
      { q: "How is data security handled?", a: "All data is processed and stored within the EU, encrypted in transit (TLS 1.3) and at rest (AES-256). We enforce strict access controls, perform regular penetration tests, and are GDPR-compliant. Enterprise customers can use SSO (SAML/OIDC) and SCIM provisioning." },
      { q: "What does RiskBases cost?", a: "We offer three plans: Standard (\u20ac199/mo), Premium (\u20ac349/mo), and Enterprise (custom). All plans include all industry modules \u2014 the difference lies in features like portfolio analytics, integrations, and SSO. You can try it free for 14 days without a credit card." },
      { q: "Can I integrate RiskBases with other tools?", a: "Yes. From the Premium plan, you have access to the integrations framework and API. This lets you connect RiskBases to your project management, ERP, or BI tools. At the Enterprise level, we also support custom integrations." },
      { q: "Can I export data?", a: "Of course. You can export risks, reports, and dashboard views to Excel, PDF, and CSV. Enterprise customers can also use the API for automated exports and integrations." },
      { q: "What support do you offer?", a: "Standard users receive email support. Premium customers get priority support with faster response times. Enterprise customers have a dedicated account manager and a custom SLA." },
    ],
    ctaTitle: "Still have questions?",
    ctaDesc: "Get in touch with our team or book a demo directly.",
    ctaDemo: "Book a demo",
    ctaEmail: "Send us an email",
  },
  de: {
    heroBadge: "FAQ",
    heroTitle: "H\u00e4ufig gestellte Fragen",
    heroDesc: "Finden Sie schnell Antworten auf die h\u00e4ufigsten Fragen zu RiskBases. Ihre Frage ist nicht dabei? ",
    heroContact: "Kontaktieren Sie uns",
    faqs: [
      { q: "Welche Module sind verf\u00fcgbar?", a: "RiskBases bietet Module f\u00fcr Bau, Infrastruktur & Tiefbau, Maritim & Offshore, Industrielle Projekte, Energiewende, Immobilien & FM und Veranstaltungen. Die Module f\u00fcr Bau und Infrastruktur sind jetzt live \u2014 die \u00fcbrigen werden in den kommenden Monaten gestartet. Alle Module sind in jedem Plan enthalten." },
      { q: "Wie funktioniert das Onboarding?", a: "Nach der Kontoerstellung k\u00f6nnen Sie sofort loslegen. Erstellen Sie ein Projekt, w\u00e4hlen Sie ein Modul und beginnen Sie mit der Erfassung von Risiken. Kein Implementierungsprozess oder Schulung erforderlich \u2014 die Plattform ist intuitiv gestaltet. F\u00fcr Enterprise-Kunden bieten wir optionales gef\u00fchrtes Onboarding." },
      { q: "Wie ist die Datensicherheit geregelt?", a: "Alle Daten werden innerhalb der EU verarbeitet und gespeichert, verschl\u00fcsselt in Transit (TLS 1.3) und im Ruhezustand (AES-256). Wir setzen strenge Zugriffskontrollen durch, f\u00fchren regelm\u00e4\u00dfig Penetrationstests durch und sind DSGVO-konform. Enterprise-Kunden k\u00f6nnen SSO (SAML/OIDC) und SCIM-Provisioning nutzen." },
      { q: "Was kostet RiskBases?", a: "Wir bieten drei Pl\u00e4ne: Standard (\u20ac199/Mon.), Premium (\u20ac349/Mon.) und Enterprise (individuell). Alle Pl\u00e4ne enthalten alle Branchenmodule \u2014 der Unterschied liegt in Funktionen wie Portfolio-Analysen, Integrationen und SSO. Sie k\u00f6nnen 14 Tage kostenlos ohne Kreditkarte testen." },
      { q: "Kann ich RiskBases mit anderen Tools integrieren?", a: "Ja. Ab dem Premium-Plan haben Sie Zugang zum Integrationsframework und zur API. Damit k\u00f6nnen Sie RiskBases mit Ihrem Projektmanagement-, ERP- oder BI-Tool verbinden. Auf Enterprise-Ebene unterst\u00fctzen wir auch ma\u00dfgeschneiderte Integrationen." },
      { q: "Kann ich Daten exportieren?", a: "Nat\u00fcrlich. Sie k\u00f6nnen Risiken, Berichte und Dashboard-Ansichten nach Excel, PDF und CSV exportieren. Enterprise-Kunden k\u00f6nnen dar\u00fcber hinaus die API f\u00fcr automatisierte Exporte und Integrationen nutzen." },
      { q: "Welchen Support bieten Sie an?", a: "Standard-Benutzer erhalten E-Mail-Support. Premium-Kunden bekommen Priorit\u00e4ts-Support mit schnelleren Reaktionszeiten. Enterprise-Kunden verf\u00fcgen \u00fcber einen dedizierten Accountmanager und ein individuelles SLA." },
    ],
    ctaTitle: "Noch Fragen?",
    ctaDesc: "Kontaktieren Sie unser Team oder buchen Sie direkt eine Demo.",
    ctaDemo: "Demo buchen",
    ctaEmail: "Senden Sie uns eine E-Mail",
  },
};

/* ──────────────────── COMPONENT ──────────────────── */

export default function FAQContent() {
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
          <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
            <a href="mailto:info@riskbases.com" className="text-accent hover:underline font-medium">
              {t.heroContact}
            </a>.
          </p>
        </div>
      </section>

      {/* ─── FAQ LIST ─── */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-slate-200">
            {t.faqs.map((faq, i) => (
              <div key={faq.q} className="py-8 first:pt-0">
                <div className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-navy">{faq.q}</h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">{t.ctaTitle}</h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">{t.ctaDesc}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book-demo" className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]">
              {t.ctaDemo}
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a href="mailto:info@riskbases.com" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]">
              {t.ctaEmail}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
