"use client";

import Link from "next/link";
import LogoBar from "@/components/marketing/LogoBar";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";

/* ───── icon helper ───── */
function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/* ───── ICONS (shared across locales) ───── */

const moduleIcons = [
  "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21",
  "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  "M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.342.342.865.427 1.298.21L12 15.25l1.64 1.676a6 6 0 001.676.878l1.913.319M12 21a9 9 0 100-18 9 9 0 000 18z",
  "M11.42 15.17l-5.08-3.07a.78.78 0 01-.37-.65V7.79c0-.27.14-.51.37-.65l5.08-3.07a.78.78 0 01.74 0l5.08 3.07c.23.14.37.38.37.65v3.66c0 .27-.14.51-.37.65l-5.08 3.07a.78.78 0 01-.74 0z",
  "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819",
  "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z",
];
const moduleLive = [true, true, false, false, false, false, false];

const featureIcons = [
  "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z",
  "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125",
  "M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z",
  "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
];

/* ───── TRANSLATIONS ───── */

const translations = {
  nl: {
    heroBadge: "Platform voor projectrisicomanagement",
    heroTitle1: "Grip op risico\u2019s.",
    heroTitle2: "Van inzicht tot actie.",
    heroDesc: "RiskBases is het risicomanagementplatform waarmee projectteams risico\u2019s identificeren, analyseren, beheersen en bewaken \u2014 in \u00e9\u00e9n centrale omgeving.",
    ctaDemo: "Plan een demo",
    ctaTrial: "Gratis uitproberen",
    problemLabel: "Het probleem",
    problemTitle: "Risicomanagement draait nog te vaak op spreadsheets",
    problemDesc: "Projectteams verliezen overzicht, werken met verouderde informatie en missen cruciale signalen. Risico-registers in Excel groeien, worden niet bijgewerkt en geven geen inzicht in trends of samenhang. Het resultaat: beslissingen op gevoel in plaats van op data.",
    solutionLabel: "De oplossing",
    solutionTitle: "E\u00e9n platform voor je hele risicoproces",
    solutionDesc: "RiskBases vervangt losse spreadsheets door een gestructureerde, centrale omgeving \u2014 gebouwd voor projectteams die grip willen op risico\u2019s zonder extra bureaucratie.",
    solutionCards: [
      { title: "Centraal & actueel", desc: "E\u00e9n bron van waarheid die altijd up-to-date is \u2014 geen versie-chaos meer." },
      { title: "Visueel & inzichtelijk", desc: "Heatmaps, dashboards en trendgrafieken geven direct overzicht." },
      { title: "Gestructureerd", desc: "Volg bewezen methodieken (RISMAN, ISO 31000) in een helder format." },
      { title: "Samenwerken", desc: "Werk samen met je hele projectteam \u2014 ieder met de juiste rechten." },
      { title: "Rapportages", desc: "Genereer in \u00e9\u00e9n klik rapportages voor directie en opdrachtgevers." },
      { title: "Schaalbaar", desc: "Van \u00e9\u00e9n project tot een portfolio met duizenden risico\u2019s." },
    ],
    howLabel: "Hoe het werkt",
    howTitle: "In vijf stappen van risico naar beheersing",
    steps: [
      { n: "01", title: "Identificeren", desc: "Breng risico\u2019s in kaart via gestructureerde workshops of imports." },
      { n: "02", title: "Analyseren", desc: "Score kans \u00d7 impact met configureerbare risicomatrices." },
      { n: "03", title: "Beheersen", desc: "Koppel maatregelen, wijs eigenaren toe en stel deadlines in." },
      { n: "04", title: "Monitoren", desc: "Volg voortgang via real-time dashboards, heatmaps en alerts." },
      { n: "05", title: "Rapporteren", desc: "Genereer rapportages voor directie, opdrachtgevers en audits." },
    ],
    modulesLabel: "Modules",
    modulesTitle: "Branchespecifieke modules",
    modulesDesc: "Gebruik alleen wat je nodig hebt. Elke module bevat sectorspecifieke risicotemplates, taxonomie\u00ebn en rapportages.",
    moduleNames: ["Bouw", "Infra & Civiel", "Maritiem & Offshore", "Industri\u00eble Projecten", "Energietransitie", "Vastgoed & FM", "Evenementen"],
    moduleDescs: [
      "Risicomanagement voor bouwprojecten \u2014 van tender tot oplevering.",
      "Complexe infraprojecten beheerst beheersen \u2014 van ontwerp tot realisatie.",
      "Risico\u2019s op zee en in havens \u2014 van ontwerp tot operatie.",
      "Risicobeheersing voor complexe industri\u00eble installaties en onderhoud.",
      "Risicomanagement voor windparken, waterstof, zonneparken en netinfra.",
      "Beheer risico\u2019s in vastgoedportefeuilles en facilitair management.",
      "Veiligheidsrisico\u2019s en vergunningenbeheer voor evenementen.",
    ],
    moduleLive: "Live",
    moduleSoon: "Binnenkort",
    featuresLabel: "Functies",
    featuresTitle: "Alles wat je nodig hebt, niets dat je niet nodig hebt",
    featureNames: ["Risicoregister", "Risicomatrix", "Dashboards", "Maatregelen", "Samenwerking", "Audit Trail"],
    featureDescs: [
      "Centraal, doorzoekbaar en filterbaar overzicht van alle risico\u2019s.",
      "Kans \u00d7 impact visualisatie met volledig instelbare schalen.",
      "Interactieve grafieken, heatmaps en KPI-weergaven op \u00e9\u00e9n plek.",
      "Koppel beheersmaatregelen aan risico\u2019s en volg de voortgang.",
      "Wijs eigenaren toe, stel deadlines in en werk samen in real-time.",
      "Volledige traceerbaarheid van elke wijziging voor audits en compliance.",
    ],
    trustLabel: "Vertrouwen & Beveiliging",
    trustTitle: "Enterprise-grade beveiliging",
    trustDesc: "Wij nemen beveiliging en privacy serieus. RiskBases is ontworpen met enterprise-eisen als uitgangspunt.",
    trustItems: [
      { title: "AVG / GDPR-compliant", desc: "Data wordt verwerkt en opgeslagen binnen de EU conform de privacywetgeving." },
      { title: "Versleuteling", desc: "Alle data is versleuteld in transit (TLS) en at rest (AES-256)." },
      { title: "Rollen & Rechten", desc: "Fijnmazig autorisatiemodel met rollen, teams en projecttoegang." },
      { title: "SSO & MFA", desc: "Single Sign-On via SAML/OIDC en multi-factor authenticatie voor iedere gebruiker." },
    ],
    ctaTitle: "Klaar om risico\u2019s \u00e9cht te beheersen?",
    ctaDesc: "Ontdek hoe RiskBases jouw projecten veiliger en voorspelbaarder maakt. Start vandaag \u2014 zonder verplichtingen.",
  },
  en: {
    heroBadge: "Project risk management platform",
    heroTitle1: "Control your risks.",
    heroTitle2: "From insight to action.",
    heroDesc: "RiskBases is the risk management platform that helps project teams identify, analyze, control, and monitor risks \u2014 in one central environment.",
    ctaDemo: "Book a demo",
    ctaTrial: "Start free trial",
    problemLabel: "The problem",
    problemTitle: "Risk management still relies too much on spreadsheets",
    problemDesc: "Project teams lose oversight, work with outdated information, and miss crucial signals. Risk registers in Excel grow, remain un-updated, and provide no insight into trends or connections. The result: decisions based on gut feeling instead of data.",
    solutionLabel: "The solution",
    solutionTitle: "One platform for your entire risk process",
    solutionDesc: "RiskBases replaces scattered spreadsheets with a structured, central environment \u2014 built for project teams that want control over risks without extra bureaucracy.",
    solutionCards: [
      { title: "Central & current", desc: "One source of truth that\u2019s always up to date \u2014 no more version chaos." },
      { title: "Visual & insightful", desc: "Heatmaps, dashboards, and trend charts provide instant oversight." },
      { title: "Structured", desc: "Follow proven methodologies (RISMAN, ISO 31000) in a clear format." },
      { title: "Collaborate", desc: "Work together with your entire project team \u2014 each with the right permissions." },
      { title: "Reports", desc: "Generate reports for management and clients in one click." },
      { title: "Scalable", desc: "From one project to a portfolio with thousands of risks." },
    ],
    howLabel: "How it works",
    howTitle: "Five steps from risk to control",
    steps: [
      { n: "01", title: "Identify", desc: "Map risks through structured workshops or imports." },
      { n: "02", title: "Analyze", desc: "Score probability \u00d7 impact with configurable risk matrices." },
      { n: "03", title: "Control", desc: "Link measures, assign owners, and set deadlines." },
      { n: "04", title: "Monitor", desc: "Track progress via real-time dashboards, heatmaps, and alerts." },
      { n: "05", title: "Report", desc: "Generate reports for management, clients, and audits." },
    ],
    modulesLabel: "Modules",
    modulesTitle: "Industry-specific modules",
    modulesDesc: "Use only what you need. Each module contains sector-specific risk templates, taxonomies, and reports.",
    moduleNames: ["Construction", "Infrastructure & Civil", "Maritime & Offshore", "Industrial Projects", "Energy Transition", "Real Estate & FM", "Events"],
    moduleDescs: [
      "Risk management for construction projects \u2014 from tender to delivery.",
      "Manage complex infrastructure projects \u2014 from design to realization.",
      "Risks at sea and in ports \u2014 from design to operation.",
      "Risk management for complex industrial installations and maintenance.",
      "Risk management for wind farms, hydrogen, solar parks, and grid infrastructure.",
      "Manage risks in real estate portfolios and facility management.",
      "Safety risks and permit management for events.",
    ],
    moduleLive: "Live",
    moduleSoon: "Coming soon",
    featuresLabel: "Features",
    featuresTitle: "Everything you need, nothing you don\u2019t",
    featureNames: ["Risk Register", "Risk Matrix", "Dashboards", "Control Measures", "Collaboration", "Audit Trail"],
    featureDescs: [
      "Central, searchable, and filterable overview of all risks.",
      "Probability \u00d7 impact visualization with fully configurable scales.",
      "Interactive charts, heatmaps, and KPI views in one place.",
      "Link control measures to risks and track progress.",
      "Assign owners, set deadlines, and collaborate in real-time.",
      "Full traceability of every change for audits and compliance.",
    ],
    trustLabel: "Trust & Security",
    trustTitle: "Enterprise-grade security",
    trustDesc: "We take security and privacy seriously. RiskBases is designed with enterprise requirements as a starting point.",
    trustItems: [
      { title: "GDPR compliant", desc: "Data is processed and stored within the EU in compliance with privacy legislation." },
      { title: "Encryption", desc: "All data is encrypted in transit (TLS) and at rest (AES-256)." },
      { title: "Roles & Permissions", desc: "Fine-grained authorization model with roles, teams, and project access." },
      { title: "SSO & MFA", desc: "Single Sign-On via SAML/OIDC and multi-factor authentication for every user." },
    ],
    ctaTitle: "Ready to truly manage your risks?",
    ctaDesc: "Discover how RiskBases makes your projects safer and more predictable. Start today \u2014 no obligations.",
  },
  de: {
    heroBadge: "Plattform f\u00fcr Projektrisikomanagement",
    heroTitle1: "Risiken im Griff.",
    heroTitle2: "Von Einblick zu Aktion.",
    heroDesc: "RiskBases ist die Risikomanagement-Plattform, mit der Projektteams Risiken identifizieren, analysieren, steuern und \u00fcberwachen \u2014 in einer zentralen Umgebung.",
    ctaDemo: "Demo buchen",
    ctaTrial: "Kostenlos testen",
    problemLabel: "Das Problem",
    problemTitle: "Risikomanagement basiert noch zu oft auf Tabellenkalkulationen",
    problemDesc: "Projektteams verlieren den \u00dcberblick, arbeiten mit veralteten Informationen und verpassen entscheidende Signale. Risikoregister in Excel wachsen, werden nicht aktualisiert und liefern keinen Einblick in Trends oder Zusammenh\u00e4nge. Das Ergebnis: Entscheidungen aus dem Bauch statt auf Basis von Daten.",
    solutionLabel: "Die L\u00f6sung",
    solutionTitle: "Eine Plattform f\u00fcr Ihren gesamten Risikoprozess",
    solutionDesc: "RiskBases ersetzt verstreute Tabellenkalkulationen durch eine strukturierte, zentrale Umgebung \u2014 entwickelt f\u00fcr Projektteams, die Risiken ohne zus\u00e4tzliche B\u00fcrokratie beherrschen wollen.",
    solutionCards: [
      { title: "Zentral & aktuell", desc: "Eine Quelle der Wahrheit, die immer aktuell ist \u2014 kein Versionschaos mehr." },
      { title: "Visuell & aufschlussreich", desc: "Heatmaps, Dashboards und Trenddiagramme bieten sofortigen \u00dcberblick." },
      { title: "Strukturiert", desc: "Folgen Sie bew\u00e4hrten Methoden (RISMAN, ISO 31000) in einem klaren Format." },
      { title: "Zusammenarbeit", desc: "Arbeiten Sie mit Ihrem gesamten Projektteam zusammen \u2014 jeder mit den richtigen Berechtigungen." },
      { title: "Berichte", desc: "Erstellen Sie Berichte f\u00fcr Management und Auftraggeber mit einem Klick." },
      { title: "Skalierbar", desc: "Von einem Projekt bis zu einem Portfolio mit Tausenden von Risiken." },
    ],
    howLabel: "So funktioniert es",
    howTitle: "In f\u00fcnf Schritten vom Risiko zur Beherrschung",
    steps: [
      { n: "01", title: "Identifizieren", desc: "Erfassen Sie Risiken durch strukturierte Workshops oder Importe." },
      { n: "02", title: "Analysieren", desc: "Bewerten Sie Wahrscheinlichkeit \u00d7 Auswirkung mit konfigurierbaren Risikomatrizen." },
      { n: "03", title: "Steuern", desc: "Verkn\u00fcpfen Sie Ma\u00dfnahmen, weisen Sie Verantwortliche zu und setzen Sie Fristen." },
      { n: "04", title: "\u00dcberwachen", desc: "Verfolgen Sie den Fortschritt \u00fcber Echtzeit-Dashboards, Heatmaps und Alerts." },
      { n: "05", title: "Berichten", desc: "Erstellen Sie Berichte f\u00fcr Management, Auftraggeber und Audits." },
    ],
    modulesLabel: "Module",
    modulesTitle: "Branchenspezifische Module",
    modulesDesc: "Nutzen Sie nur, was Sie brauchen. Jedes Modul enth\u00e4lt branchenspezifische Risikovorlagen, Taxonomien und Berichte.",
    moduleNames: ["Bau", "Infrastruktur & Tiefbau", "Maritim & Offshore", "Industrielle Projekte", "Energiewende", "Immobilien & FM", "Veranstaltungen"],
    moduleDescs: [
      "Risikomanagement f\u00fcr Bauprojekte \u2014 von der Ausschreibung bis zur Abnahme.",
      "Komplexe Infrastrukturprojekte beherrschen \u2014 vom Entwurf bis zur Realisierung.",
      "Risiken auf See und in H\u00e4fen \u2014 vom Entwurf bis zum Betrieb.",
      "Risikobeherrschung f\u00fcr komplexe industrielle Anlagen und Wartung.",
      "Risikomanagement f\u00fcr Windparks, Wasserstoff, Solarparks und Netzinfrastruktur.",
      "Risiken in Immobilienportfolios und Facility Management verwalten.",
      "Sicherheitsrisiken und Genehmigungsmanagement f\u00fcr Veranstaltungen.",
    ],
    moduleLive: "Live",
    moduleSoon: "Demn\u00e4chst",
    featuresLabel: "Funktionen",
    featuresTitle: "Alles was Sie brauchen, nichts was Sie nicht brauchen",
    featureNames: ["Risikoregister", "Risikomatrix", "Dashboards", "Ma\u00dfnahmen", "Zusammenarbeit", "Audit Trail"],
    featureDescs: [
      "Zentraler, durchsuchbarer und filterbarer \u00dcberblick aller Risiken.",
      "Wahrscheinlichkeit \u00d7 Auswirkung-Visualisierung mit frei konfigurierbaren Skalen.",
      "Interaktive Diagramme, Heatmaps und KPI-Ansichten an einem Ort.",
      "Verkn\u00fcpfen Sie Beherrschungsma\u00dfnahmen mit Risiken und verfolgen Sie den Fortschritt.",
      "Weisen Sie Verantwortliche zu, setzen Sie Fristen und arbeiten Sie in Echtzeit zusammen.",
      "Vollst\u00e4ndige R\u00fcckverfolgbarkeit jeder \u00c4nderung f\u00fcr Audits und Compliance.",
    ],
    trustLabel: "Vertrauen & Sicherheit",
    trustTitle: "Enterprise-grade Sicherheit",
    trustDesc: "Wir nehmen Sicherheit und Datenschutz ernst. RiskBases wurde mit Enterprise-Anforderungen als Ausgangspunkt entwickelt.",
    trustItems: [
      { title: "DSGVO-konform", desc: "Daten werden innerhalb der EU gem\u00e4\u00df der Datenschutzgesetzgebung verarbeitet und gespeichert." },
      { title: "Verschl\u00fcsselung", desc: "Alle Daten sind in Transit (TLS) und im Ruhezustand (AES-256) verschl\u00fcsselt." },
      { title: "Rollen & Berechtigungen", desc: "Feingranulares Autorisierungsmodell mit Rollen, Teams und Projektzugang." },
      { title: "SSO & MFA", desc: "Single Sign-On \u00fcber SAML/OIDC und Multi-Faktor-Authentifizierung f\u00fcr jeden Benutzer." },
    ],
    ctaTitle: "Bereit, Risiken wirklich zu beherrschen?",
    ctaDesc: "Entdecken Sie, wie RiskBases Ihre Projekte sicherer und vorhersehbarer macht. Starten Sie heute \u2014 ohne Verpflichtungen.",
  },
} as const;

/* ──────────────────── COMPONENT ──────────────────── */

export default function HomeContent() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-navy">

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <div className="animate-fade-in-up text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm mb-6">
                  {t.heroBadge}
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                  {t.heroTitle1}
                  <br />
                  <span className="text-accent">{t.heroTitle2}</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-slate-300 leading-relaxed">
                  {t.heroDesc}
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up delay-200">
                <Link href="/book-demo" className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]">
                  {t.ctaDemo}
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link href="/signup" className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/30 active:scale-[.98]">
                  {t.ctaTrial}
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-6">
                {/* Mock dashboard header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-accent" />
                    <div className="h-2.5 w-24 rounded bg-white/10" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-8 rounded bg-white/10" />
                    <div className="h-2 w-8 rounded bg-white/10" />
                  </div>
                </div>
                {/* Risk matrix 5×5 */}
                <div className="grid grid-cols-5 gap-1.5">
                  {/* Row 5 (top - highest probability) */}
                  <div className="aspect-square rounded bg-yellow-500/70" />
                  <div className="aspect-square rounded bg-orange-500/70" />
                  <div className="aspect-square rounded bg-red-500/80" />
                  <div className="aspect-square rounded bg-red-500/90" />
                  <div className="aspect-square rounded bg-red-500" />
                  {/* Row 4 */}
                  <div className="aspect-square rounded bg-green-500/60" />
                  <div className="aspect-square rounded bg-yellow-500/70" />
                  <div className="aspect-square rounded bg-orange-500/70" />
                  <div className="aspect-square rounded bg-red-500/80" />
                  <div className="aspect-square rounded bg-red-500/90" />
                  {/* Row 3 */}
                  <div className="aspect-square rounded bg-green-500/50" />
                  <div className="aspect-square rounded bg-green-500/60" />
                  <div className="aspect-square rounded bg-yellow-500/70" />
                  <div className="aspect-square rounded bg-orange-500/70" />
                  <div className="aspect-square rounded bg-red-500/80" />
                  {/* Row 2 */}
                  <div className="aspect-square rounded bg-green-500/40" />
                  <div className="aspect-square rounded bg-green-500/50" />
                  <div className="aspect-square rounded bg-green-500/60" />
                  <div className="aspect-square rounded bg-yellow-500/70" />
                  <div className="aspect-square rounded bg-orange-500/70" />
                  {/* Row 1 (bottom - lowest probability) */}
                  <div className="aspect-square rounded bg-green-500/30" />
                  <div className="aspect-square rounded bg-green-500/40" />
                  <div className="aspect-square rounded bg-green-500/50" />
                  <div className="aspect-square rounded bg-green-500/60" />
                  <div className="aspect-square rounded bg-yellow-500/70" />
                </div>
                {/* Mock stats row */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white/[.05] p-3">
                    <div className="h-2 w-8 rounded bg-white/10 mb-2" />
                    <div className="h-5 w-12 rounded bg-white/15" />
                  </div>
                  <div className="rounded-lg bg-white/[.05] p-3">
                    <div className="h-2 w-10 rounded bg-white/10 mb-2" />
                    <div className="h-5 w-10 rounded bg-white/15" />
                  </div>
                  <div className="rounded-lg bg-white/[.05] p-3">
                    <div className="h-2 w-6 rounded bg-white/10 mb-2" />
                    <div className="h-5 w-14 rounded bg-white/15" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoBar />

      {/* ─── PROBLEM ─── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.problemLabel}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight max-w-3xl">{t.problemTitle}</h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto lg:mx-0">{t.problemDesc}</p>
        </div>
      </section>

      {/* ─── SOLUTION ─── */}
      <section id="product" className="py-20 lg:py-28 bg-slate-50 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.solutionLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">{t.solutionTitle}</h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">{t.solutionDesc}</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.solutionCards.map((s) => (
              <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-8 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <h3 className="text-base font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.howLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">{t.howTitle}</h2>
          </div>
          <div className="mt-16 space-y-0">
            {t.steps.map((step, i) => (
              <div key={step.n} className="group relative flex items-start gap-6 py-8">
                {i < t.steps.length - 1 && <div className="absolute left-[23px] top-[60px] bottom-0 w-px bg-slate-200" />}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white font-bold text-sm shadow-lg shadow-navy/20 transition-transform duration-200 group-hover:scale-110">{step.n}</div>
                <div className="pt-1.5">
                  <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MODULES ─── */}
      <section id="modules" className="py-20 lg:py-28 bg-slate-50 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.modulesLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">{t.modulesTitle}</h2>
            <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">{t.modulesDesc}</p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.moduleNames.map((name, i) => (
              <div key={name} className={`group relative rounded-xl border bg-white p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${moduleLive[i] ? "border-slate-200" : "border-dashed border-slate-300"}`}>
                <span className={`absolute top-4 right-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${moduleLive[i] ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {moduleLive[i] ? t.moduleLive : t.moduleSoon}
                </span>
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${moduleLive[i] ? "bg-accent/10 text-accent" : "bg-slate-100 text-slate-400"}`}>
                  <Icon d={moduleIcons[i]} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{name}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{t.moduleDescs[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.featuresLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">{t.featuresTitle}</h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.featureNames.map((name, i) => (
              <div key={name} className="flex items-start gap-4 rounded-xl border border-slate-200 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon d={featureIcons[i]} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-navy">{name}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{t.featureDescs[i]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST & SECURITY ─── */}
      <section className="py-20 lg:py-28 bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.trustLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white leading-tight">{t.trustTitle}</h2>
            <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.trustDesc}</p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {t.trustItems.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-200 hover:bg-white/[.08]">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-28 lg:py-36 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">{t.ctaTitle}</h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">{t.ctaDesc}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book-demo" className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]">
              {t.ctaDemo}
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href="/signup" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]">
              {t.ctaTrial}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
