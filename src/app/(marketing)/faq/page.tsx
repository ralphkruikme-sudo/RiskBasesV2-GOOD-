import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen — RiskBases",
  description: "Antwoorden op de meest gestelde vragen over RiskBases.",
};

const faqs = [
  {
    q: "Welke modules zijn beschikbaar?",
    a: "RiskBases biedt modules voor Bouw, Infra & Civiel, Maritiem & Offshore, Industriële Projecten, Energietransitie, Vastgoed & FM en Evenementen. De modules voor Bouw en Infra & Civiel zijn nu live — de overige worden in de komende maanden gelanceerd. Alle modules zijn inbegrepen bij elk abonnement.",
  },
  {
    q: "Hoe werkt de onboarding?",
    a: "Na het aanmaken van een account kun je direct aan de slag. Maak een project aan, kies een module en begin met het registreren van risico's. Er is geen implementatietraject of training nodig — het platform is ontworpen om intuïtief te zijn. Voor Enterprise-klanten bieden we optioneel begeleide onboarding.",
  },
  {
    q: "Hoe is de databeveiliging geregeld?",
    a: "Alle data wordt verwerkt en opgeslagen binnen de EU, versleuteld in transit (TLS 1.3) en at rest (AES-256). We hanteren strikte toegangscontroles, voeren regelmatig pentests uit en zijn AVG/GDPR-compliant. Enterprise-klanten kunnen gebruik maken van SSO (SAML/OIDC) en SCIM-provisioning.",
  },
  {
    q: "Wat kost RiskBases?",
    a: "We bieden drie abonnementen: Standard (€199/mo), Premium (€349/mo) en Enterprise (op maat). Alle abonnementen bevatten alle branchemodules — het verschil zit in functies zoals portfolio-analyses, integraties en SSO. Je kunt 14 dagen gratis uitproberen zonder creditcard.",
  },
  {
    q: "Kan ik RiskBases integreren met andere tools?",
    a: "Ja. Vanaf het Premium-abonnement heb je toegang tot het integratieframework en de API. Hiermee kun je RiskBases koppelen aan je projectmanagement-, ERP- of BI-tooling. Op Enterprise-niveau ondersteunen we ook maatwerkkoppelingen.",
  },
  {
    q: "Kan ik data exporteren?",
    a: "Uiteraard. Je kunt risico's, rapportages en dashboardweergaven exporteren naar Excel, PDF en CSV. Enterprise-klanten kunnen daarnaast gebruik maken van de API voor geautomatiseerde exports en koppelingen.",
  },
  {
    q: "Welke ondersteuning bieden jullie?",
    a: "Standard-gebruikers ontvangen ondersteuning via e-mail. Premium-klanten krijgen prioritaire support met snellere responstijden. Enterprise-klanten beschikken over een dedicated accountmanager en een op maat gemaakte SLA.",
  },
];

export default function FAQPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent mb-6">
            FAQ
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.1]">
            Veelgestelde vragen
          </h1>
          <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Vind snel antwoord op de meest gestelde vragen over RiskBases.
            Staat jouw vraag er niet bij?{" "}
            <a href="mailto:info@riskbases.com" className="text-accent hover:underline font-medium">
              Neem contact op
            </a>.
          </p>
        </div>
      </section>

      {/* ─── FAQ LIST ─── */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-slate-200">
            {faqs.map((faq, i) => (
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
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Nog vragen?
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Neem contact op met ons team of plan direct een demo.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book-demo"
              className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]"
            >
              Plan een demo
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="mailto:info@riskbases.com"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]"
            >
              Stuur ons een e-mail
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
