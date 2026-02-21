import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over ons — RiskBases",
  description: "Leer wie er achter RiskBases zit en waarom we dit platform bouwen.",
};

/* ────────────────────── DATA ────────────────────── */

const founders = [
  {
    name: "Ralph Kruik",
    role: "Product & Development",
    bio: "Ralph is verantwoordelijk voor de productstrategie, architectuur en ontwikkeling van het platform. Met een achtergrond in software engineering en projectomgevingen ziet hij dagelijks welke frustraties teams hebben met verspreide risico-informatie. Die ervaring vertaalt hij naar een product dat niet alleen functioneel is, maar ook prettig in gebruik.",
    initials: "RK",
  },
  {
    name: "Jasper Kraamwinkel",
    role: "Marketing & Sales",
    bio: "Jasper richt zich op groei, positionering en klantrelaties. Hij begrijpt de taal van opdrachtgevers, projectmanagers en directies — en zorgt ervoor dat RiskBases niet alleen een goed product is, maar ook vindbaar, begrijpelijk en overtuigend wordt gepresenteerd aan de markt.",
    initials: "JK",
  },
];

const principles = [
  {
    title: "Visual-first",
    desc: "Risico's worden pas beheerst als je ze begrijpt. Daarom zetten we heatmaps, dashboards en matrices centraal — zodat inzicht voorop staat.",
    icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Actiegericht",
    desc: "Een risicoregister zonder opvolging is een papieren tijger. RiskBases dwingt actie af: eigenaren, deadlines, maatregelen en voortgang.",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    title: "Gebouwd voor teams",
    desc: "Risicomanagement is geen solo-activiteit. Samenwerking, rollen en real-time updates zijn geen add-on — ze zitten in de kern van het platform.",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  },
  {
    title: "Modulair & schaalbaar",
    desc: "Van één bouwproject tot een portfolio met honderden risico's — het platform schaalt mee. Gebruik alleen de modules die je nodig hebt.",
    icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  },
];

/* ──────────────────── PAGE ──────────────────── */

export default function AboutPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent mb-6">
            Over Ons
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy leading-[1.1]">
            Risicomanagement dat wél werkt
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            RiskBases is ontstaan vanuit een simpele frustratie: risicomanagement
            in projecten is te belangrijk om in spreadsheets te doen — maar de
            bestaande tooling is te complex, te duur of te generiek. Wij bouwen
            het platform dat projectteams écht willen gebruiken.
          </p>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Ons verhaal</span>
              <h2 className="mt-3 text-3xl font-bold text-navy leading-tight">
                Waarom RiskBases?
              </h2>
              <div className="mt-6 space-y-5 text-slate-600 leading-relaxed">
                <p>
                  In de bouw, infra en industrie draait alles om projecten. En elk
                  project brengt risico&apos;s met zich mee — van budgetoverschrijdingen
                  tot veiligheidsincidenten. Toch worden die risico&apos;s in de praktijk
                  nog te vaak beheerd in losse Excel-bestanden, gedeeld via e-mail
                  en besproken zonder opvolging.
                </p>
                <p>
                  Wij geloven dat het anders kan. RiskBases combineert de
                  structuur van bewezen methodieken (zoals RISMAN en ISO 31000)
                  met moderne technologie: visuele dashboards, realtime
                  samenwerking en automatische rapportages. Geen ingewikkelde
                  implementatie, geen consultants nodig — gewoon inloggen en
                  starten.
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Voor wie?</span>
              <h2 className="mt-3 text-3xl font-bold text-navy leading-tight">
                Projectgedreven organisaties
              </h2>
              <div className="mt-6 space-y-5 text-slate-600 leading-relaxed">
                <p>
                  RiskBases is gebouwd voor organisaties waar projecten de kern
                  vormen: aannemers, ingenieursbureaus, projectontwikkelaars,
                  energiebedrijven en overheden. Van een middelgroot bouwbedrijf
                  tot een internationaal infraconcern.
                </p>
                <p>
                  Of je nu één project beheert of een heel portfolio —
                  RiskBases schaalt mee. Met branchespecifieke modules,
                  configureerbare risicomatrices en rolgebaseerde toegang past
                  het platform zich aan jouw werkwijze aan, niet andersom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDERS ─── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Het team</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
              De oprichters
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              RiskBases wordt gebouwd door een compact team met een duidelijke missie:
              risicomanagement toegankelijk maken voor iedere projectorganisatie.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {founders.map((f) => (
              <div
                key={f.name}
                className="rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white text-lg font-bold">
                    {f.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{f.name}</h3>
                    <p className="text-sm font-medium text-accent">{f.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-slate-600 leading-relaxed">
                  {f.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRINCIPLES ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Onze principes</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
              Hoe wij het platform bouwen
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
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
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Benieuwd wat RiskBases voor jouw organisatie kan betekenen?
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Plan een demo of start direct met een gratis proefperiode.
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
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]"
            >
              Gratis starten
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
