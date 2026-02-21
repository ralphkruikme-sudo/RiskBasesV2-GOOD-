"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";

/* ───── TRANSLATIONS ───── */

const translations: Record<Locale, {
  badge: string;
  title: string;
  desc: string;
  contactTitle: string;
  contactDesc: string;
  salesLabel: string;
  supportLabel: string;
  responseLabel: string;
  responseDesc: string;
  ctaEmail: string;
  ctaTrial: string;
}> = {
  nl: {
    badge: "Binnenkort beschikbaar",
    title: "Plan een demo",
    desc: "Online planning komt binnenkort. Neem in de tussentijd direct contact met ons op \u2014 we geven je graag een persoonlijke rondleiding.",
    contactTitle: "Neem contact op",
    contactDesc: "Stuur ons een e-mail en we plannen een gesprek van 30 minuten op een moment dat jou uitkomt.",
    salesLabel: "Sales & Demo\u2019s",
    supportLabel: "Technische Support",
    responseLabel: "Reactietijd",
    responseDesc: "We reageren doorgaans binnen \u00e9\u00e9n werkdag.",
    ctaEmail: "E-mail ons om te plannen",
    ctaTrial: "Of start een gratis proefperiode",
  },
  en: {
    badge: "Coming soon",
    title: "Book a demo",
    desc: "Online scheduling is coming soon. In the meantime, get in touch directly \u2014 we\u2019d love to give you a personal walkthrough.",
    contactTitle: "Get in touch",
    contactDesc: "Send us an email and we\u2019ll schedule a 30-minute call at a time that suits you.",
    salesLabel: "Sales & Demos",
    supportLabel: "Technical Support",
    responseLabel: "Response time",
    responseDesc: "We typically respond within one business day.",
    ctaEmail: "Email us to schedule",
    ctaTrial: "Or start a free trial",
  },
  de: {
    badge: "Demn\u00e4chst verf\u00fcgbar",
    title: "Demo buchen",
    desc: "Online-Terminplanung kommt bald. Kontaktieren Sie uns in der Zwischenzeit direkt \u2014 wir f\u00fchren Sie gerne pers\u00f6nlich durch die Plattform.",
    contactTitle: "Kontakt aufnehmen",
    contactDesc: "Senden Sie uns eine E-Mail und wir planen ein 30-min\u00fctiges Gespr\u00e4ch zu einem Zeitpunkt, der Ihnen passt.",
    salesLabel: "Vertrieb & Demos",
    supportLabel: "Technischer Support",
    responseLabel: "Reaktionszeit",
    responseDesc: "Wir antworten in der Regel innerhalb eines Werktages.",
    ctaEmail: "E-Mail zur Terminvereinbarung",
    ctaTrial: "Oder starten Sie eine kostenlose Testphase",
  },
};

/* ──────────────────── COMPONENT ──────────────────── */

export default function BookDemoContent() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            {t.badge}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Contact card */}
        <div className="mt-14 animate-fade-in-up delay-200">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-accent to-blue-400" />
            <div className="p-8 sm:p-10">
              <h2 className="text-xl font-bold text-slate-900">{t.contactTitle}</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{t.contactDesc}</p>

              <div className="mt-8 space-y-5">
                {/* Sales */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.salesLabel}</p>
                    <a href="mailto:info@riskbases.com" className="mt-0.5 text-sm text-accent hover:underline transition-colors duration-200">
                      info@riskbases.com
                    </a>
                  </div>
                </div>

                {/* Support */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.supportLabel}</p>
                    <a href="mailto:support@riskbases.com" className="mt-0.5 text-sm text-accent hover:underline transition-colors duration-200">
                      support@riskbases.com
                    </a>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.responseLabel}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{t.responseDesc}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="mailto:info@riskbases.com?subject=Demo%20Request%20%E2%80%93%20RiskBases"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[.98]"
                >
                  {t.ctaEmail}
                </a>
                <Link
                  href="/signup"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]"
                >
                  {t.ctaTrial}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
