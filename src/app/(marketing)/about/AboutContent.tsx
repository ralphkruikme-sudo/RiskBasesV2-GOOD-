"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";

/* ───── ICON PATHS (shared across locales) ───── */
const principleIcons = [
  "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
];

/* ───── TRANSLATIONS ───── */

const translations = {
  nl: {
    heroBadge: "Over Ons",
    heroTitle: "Risicomanagement dat w\u00e9l werkt",
    heroDesc: "RiskBases is ontstaan vanuit een simpele frustratie: risicomanagement in projecten is te belangrijk om in spreadsheets te doen \u2014 maar de bestaande tooling is te complex, te duur of te generiek. Wij bouwen het platform dat projectteams \u00e9cht willen gebruiken.",
    storyLabel: "Ons verhaal",
    storyTitle: "Waarom RiskBases?",
    storyP1: "In de bouw, infra en industrie draait alles om projecten. En elk project brengt risico\u2019s met zich mee \u2014 van budgetoverschrijdingen tot veiligheidsincidenten. Toch worden die risico\u2019s in de praktijk nog te vaak beheerd in losse Excel-bestanden, gedeeld via e-mail en besproken zonder opvolging.",
    storyP2: "Wij geloven dat het anders kan. RiskBases combineert de structuur van bewezen methodieken (zoals RISMAN en ISO 31000) met moderne technologie: visuele dashboards, realtime samenwerking en automatische rapportages. Geen ingewikkelde implementatie, geen consultants nodig \u2014 gewoon inloggen en starten.",
    forWhoLabel: "Voor wie?",
    forWhoTitle: "Projectgedreven organisaties",
    forWhoP1: "RiskBases is gebouwd voor organisaties waar projecten de kern vormen: aannemers, ingenieursbureaus, projectontwikkelaars, energiebedrijven en overheden. Van een middelgroot bouwbedrijf tot een internationaal infraconcern.",
    forWhoP2: "Of je nu \u00e9\u00e9n project beheert of een heel portfolio \u2014 RiskBases schaalt mee. Met branchespecifieke modules, configureerbare risicomatrices en rolgebaseerde toegang past het platform zich aan jouw werkwijze aan, niet andersom.",
    teamLabel: "Het team",
    teamTitle: "De oprichters",
    teamDesc: "RiskBases wordt gebouwd door een compact team met een duidelijke missie: risicomanagement toegankelijk maken voor iedere projectorganisatie.",
    founders: [
      { name: "Ralph Kruik", role: "Product & Development", bio: "Ralph is verantwoordelijk voor de productstrategie, architectuur en ontwikkeling van het platform. Met een achtergrond in software engineering en projectomgevingen ziet hij dagelijks welke frustraties teams hebben met verspreide risico-informatie. Die ervaring vertaalt hij naar een product dat niet alleen functioneel is, maar ook prettig in gebruik.", initials: "RK" },
      { name: "Jasper Kraamwinkel", role: "Marketing & Sales", bio: "Jasper richt zich op groei, positionering en klantrelaties. Hij begrijpt de taal van opdrachtgevers, projectmanagers en directies \u2014 en zorgt ervoor dat RiskBases niet alleen een goed product is, maar ook vindbaar, begrijpelijk en overtuigend wordt gepresenteerd aan de markt.", initials: "JK" },
    ],
    principlesLabel: "Onze principes",
    principlesTitle: "Hoe wij het platform bouwen",
    principles: [
      { title: "Visual-first", desc: "Risico\u2019s worden pas beheerst als je ze begrijpt. Daarom zetten we heatmaps, dashboards en matrices centraal \u2014 zodat inzicht voorop staat." },
      { title: "Actiegericht", desc: "Een risicoregister zonder opvolging is een papieren tijger. RiskBases dwingt actie af: eigenaren, deadlines, maatregelen en voortgang." },
      { title: "Gebouwd voor teams", desc: "Risicomanagement is geen solo-activiteit. Samenwerking, rollen en real-time updates zijn geen add-on \u2014 ze zitten in de kern van het platform." },
      { title: "Modulair & schaalbaar", desc: "Van \u00e9\u00e9n bouwproject tot een portfolio met honderden risico\u2019s \u2014 het platform schaalt mee. Gebruik alleen de modules die je nodig hebt." },
    ],
    ctaTitle: "Benieuwd wat RiskBases voor jouw organisatie kan betekenen?",
    ctaDesc: "Plan een demo of start direct met een gratis proefperiode.",
    ctaDemo: "Plan een demo",
    ctaStart: "Gratis starten",
  },
  en: {
    heroBadge: "About Us",
    heroTitle: "Risk management that actually works",
    heroDesc: "RiskBases was born from a simple frustration: risk management in projects is too important for spreadsheets \u2014 yet existing tools are too complex, too expensive, or too generic. We\u2019re building the platform that project teams actually want to use.",
    storyLabel: "Our story",
    storyTitle: "Why RiskBases?",
    storyP1: "In construction, infrastructure, and industry, everything revolves around projects. And every project carries risks \u2014 from budget overruns to safety incidents. Yet in practice, those risks are still too often managed in scattered Excel files, shared via email, and discussed without follow-up.",
    storyP2: "We believe it can be different. RiskBases combines the structure of proven methodologies (like RISMAN and ISO 31000) with modern technology: visual dashboards, real-time collaboration, and automated reporting. No complex implementation, no consultants needed \u2014 just log in and start.",
    forWhoLabel: "For whom?",
    forWhoTitle: "Project-driven organizations",
    forWhoP1: "RiskBases is built for organizations where projects are the core: contractors, engineering firms, project developers, energy companies, and governments. From a mid-sized construction company to an international infrastructure group.",
    forWhoP2: "Whether you manage one project or an entire portfolio \u2014 RiskBases scales with you. With industry-specific modules, configurable risk matrices, and role-based access, the platform adapts to your workflow, not the other way around.",
    teamLabel: "The team",
    teamTitle: "The founders",
    teamDesc: "RiskBases is built by a compact team with a clear mission: making risk management accessible for every project organization.",
    founders: [
      { name: "Ralph Kruik", role: "Product & Development", bio: "Ralph is responsible for product strategy, architecture, and platform development. With a background in software engineering and project environments, he sees daily the frustrations teams have with scattered risk information. He translates that experience into a product that is not only functional but also pleasant to use.", initials: "RK" },
      { name: "Jasper Kraamwinkel", role: "Marketing & Sales", bio: "Jasper focuses on growth, positioning, and client relationships. He understands the language of clients, project managers, and executives \u2014 and ensures RiskBases is not just a great product, but also discoverable, understandable, and convincingly presented to the market.", initials: "JK" },
    ],
    principlesLabel: "Our principles",
    principlesTitle: "How we build the platform",
    principles: [
      { title: "Visual-first", desc: "Risks are only managed when you understand them. That\u2019s why we put heatmaps, dashboards, and matrices at the center \u2014 so insight comes first." },
      { title: "Action-oriented", desc: "A risk register without follow-up is a paper tiger. RiskBases enforces action: owners, deadlines, measures, and progress." },
      { title: "Built for teams", desc: "Risk management is not a solo activity. Collaboration, roles, and real-time updates aren\u2019t add-ons \u2014 they\u2019re at the core of the platform." },
      { title: "Modular & scalable", desc: "From a single construction project to a portfolio with hundreds of risks \u2014 the platform scales with you. Use only the modules you need." },
    ],
    ctaTitle: "Curious what RiskBases can do for your organization?",
    ctaDesc: "Book a demo or start directly with a free trial.",
    ctaDemo: "Book a demo",
    ctaStart: "Start for free",
  },
  de: {
    heroBadge: "\u00dcber Uns",
    heroTitle: "Risikomanagement, das wirklich funktioniert",
    heroDesc: "RiskBases entstand aus einer einfachen Frustration: Risikomanagement in Projekten ist zu wichtig f\u00fcr Tabellenkalkulationen \u2014 aber die bestehenden Tools sind zu komplex, zu teuer oder zu generisch. Wir bauen die Plattform, die Projektteams wirklich nutzen wollen.",
    storyLabel: "Unsere Geschichte",
    storyTitle: "Warum RiskBases?",
    storyP1: "Im Bauwesen, in der Infrastruktur und in der Industrie dreht sich alles um Projekte. Und jedes Projekt bringt Risiken mit sich \u2014 von Budget\u00fcberschreitungen bis zu Sicherheitsvorf\u00e4llen. Doch in der Praxis werden diese Risiken noch zu oft in verstreuten Excel-Dateien verwaltet, per E-Mail geteilt und ohne Nachverfolgung besprochen.",
    storyP2: "Wir glauben, es geht anders. RiskBases kombiniert die Struktur bew\u00e4hrter Methoden (wie RISMAN und ISO 31000) mit moderner Technologie: visuelle Dashboards, Echtzeit-Zusammenarbeit und automatisierte Berichte. Keine komplexe Implementierung, keine Berater n\u00f6tig \u2014 einfach einloggen und loslegen.",
    forWhoLabel: "F\u00fcr wen?",
    forWhoTitle: "Projektgetriebene Organisationen",
    forWhoP1: "RiskBases ist f\u00fcr Organisationen gebaut, in denen Projekte im Mittelpunkt stehen: Bauunternehmen, Ingenieurb\u00fcros, Projektentwickler, Energieunternehmen und Beh\u00f6rden. Vom mittelst\u00e4ndischen Bauunternehmen bis zum internationalen Infrastrukturkonzern.",
    forWhoP2: "Ob Sie ein Projekt verwalten oder ein ganzes Portfolio \u2014 RiskBases w\u00e4chst mit. Mit branchenspezifischen Modulen, konfigurierbaren Risikomatrizen und rollenbasiertem Zugang passt sich die Plattform Ihrer Arbeitsweise an, nicht umgekehrt.",
    teamLabel: "Das Team",
    teamTitle: "Die Gr\u00fcnder",
    teamDesc: "RiskBases wird von einem kompakten Team mit einer klaren Mission gebaut: Risikomanagement f\u00fcr jede Projektorganisation zug\u00e4nglich zu machen.",
    founders: [
      { name: "Ralph Kruik", role: "Product & Development", bio: "Ralph ist verantwortlich f\u00fcr Produktstrategie, Architektur und Plattformentwicklung. Mit einem Hintergrund in Software Engineering und Projektumgebungen sieht er t\u00e4glich die Frustrationen, die Teams mit verstreuten Risikoinformationen haben. Diese Erfahrung \u00fcbersetzt er in ein Produkt, das nicht nur funktional, sondern auch angenehm zu nutzen ist.", initials: "RK" },
      { name: "Jasper Kraamwinkel", role: "Marketing & Sales", bio: "Jasper konzentriert sich auf Wachstum, Positionierung und Kundenbeziehungen. Er versteht die Sprache von Auftraggebern, Projektmanagern und Gesch\u00e4ftsf\u00fchrungen \u2014 und sorgt daf\u00fcr, dass RiskBases nicht nur ein gro\u00dfartiges Produkt ist, sondern auch auffindbar, verst\u00e4ndlich und \u00fcberzeugend am Markt pr\u00e4sentiert wird.", initials: "JK" },
    ],
    principlesLabel: "Unsere Prinzipien",
    principlesTitle: "Wie wir die Plattform bauen",
    principles: [
      { title: "Visual-first", desc: "Risiken werden erst beherrscht, wenn man sie versteht. Deshalb stellen wir Heatmaps, Dashboards und Matrizen in den Mittelpunkt \u2014 damit Einblick an erster Stelle steht." },
      { title: "Handlungsorientiert", desc: "Ein Risikoregister ohne Nachverfolgung ist ein Papiertiger. RiskBases erzwingt Handlung: Verantwortliche, Fristen, Ma\u00dfnahmen und Fortschritt." },
      { title: "F\u00fcr Teams gebaut", desc: "Risikomanagement ist keine Solo-Aktivit\u00e4t. Zusammenarbeit, Rollen und Echtzeit-Updates sind kein Add-on \u2014 sie sind der Kern der Plattform." },
      { title: "Modular & skalierbar", desc: "Von einem einzelnen Bauprojekt bis zu einem Portfolio mit Hunderten von Risiken \u2014 die Plattform w\u00e4chst mit. Nutzen Sie nur die Module, die Sie brauchen." },
    ],
    ctaTitle: "Neugierig, was RiskBases f\u00fcr Ihre Organisation tun kann?",
    ctaDesc: "Buchen Sie eine Demo oder starten Sie direkt mit einer kostenlosen Testphase.",
    ctaDemo: "Demo buchen",
    ctaStart: "Kostenlos starten",
  },
} as const;

/* ──────────────────── COMPONENT ──────────────────── */

export default function AboutContent() {
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
          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.storyLabel}</span>
              <h2 className="mt-3 text-3xl font-bold text-navy leading-tight">{t.storyTitle}</h2>
              <div className="mt-6 space-y-5 text-slate-600 leading-relaxed">
                <p>{t.storyP1}</p>
                <p>{t.storyP2}</p>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.forWhoLabel}</span>
              <h2 className="mt-3 text-3xl font-bold text-navy leading-tight">{t.forWhoTitle}</h2>
              <div className="mt-6 space-y-5 text-slate-600 leading-relaxed">
                <p>{t.forWhoP1}</p>
                <p>{t.forWhoP2}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDERS ─── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.teamLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">{t.teamTitle}</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">{t.teamDesc}</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {t.founders.map((f) => (
              <div key={f.name} className="rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white text-lg font-bold">{f.initials}</div>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{f.name}</h3>
                    <p className="text-sm font-medium text-accent">{f.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-slate-600 leading-relaxed">{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRINCIPLES ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t.principlesLabel}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">{t.principlesTitle}</h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {t.principles.map((p, i) => (
              <div key={p.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={principleIcons[i]} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-navy">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{p.desc}</p>
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
            <Link href="/signup" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]">
              {t.ctaStart}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
