import Link from "next/link";
import LogoBar from "@/components/marketing/LogoBar";

/* ───── icon helper (inline SVG keeps bundle tiny) ───── */
function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/* ────────────────────── DATA ────────────────────── */

const modules: { name: string; desc: string; live: boolean; icon: string }[] = [
  { name: "Bouw", desc: "Risicomanagement voor bouwprojecten — van tender tot oplevering.", live: true, icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" },
  { name: "Infra & Civiel", desc: "Complexe infraprojecten beheerst beheersen — van ontwerp tot realisatie.", live: true, icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" },
  { name: "Maritiem & Offshore", desc: "Risico\u2019s op zee en in havens — van ontwerp tot operatie.", live: false, icon: "M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.342.342.865.427 1.298.21L12 15.25l1.64 1.676a6 6 0 001.676.878l1.913.319M12 21a9 9 0 100-18 9 9 0 000 18z" },
  { name: "Industri\u00eble Projecten", desc: "Risicobeheersing voor complexe industri\u00eble installaties en onderhoud.", live: false, icon: "M11.42 15.17l-5.08-3.07a.78.78 0 01-.37-.65V7.79c0-.27.14-.51.37-.65l5.08-3.07a.78.78 0 01.74 0l5.08 3.07c.23.14.37.38.37.65v3.66c0 .27-.14.51-.37.65l-5.08 3.07a.78.78 0 01-.74 0z" },
  { name: "Energietransitie", desc: "Risicomanagement voor windparken, waterstof, zonneparken en netinfra.", live: false, icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  { name: "Vastgoed & FM", desc: "Beheer risico\u2019s in vastgoedportefeuilles en facilitair management.", live: false, icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" },
  { name: "Evenementen", desc: "Veiligheidsrisico\u2019s en vergunningenbeheer voor evenementen.", live: false, icon: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" },
];

const steps = [
  { n: "01", title: "Identificeren", desc: "Breng risico\u2019s in kaart via gestructureerde workshops of imports." },
  { n: "02", title: "Analyseren", desc: "Score kans \u00d7 impact met configureerbare risicomatrices." },
  { n: "03", title: "Beheersen", desc: "Koppel maatregelen, wijs eigenaren toe en stel deadlines in." },
  { n: "04", title: "Monitoren", desc: "Volg voortgang via real-time dashboards, heatmaps en alerts." },
  { n: "05", title: "Rapporteren", desc: "Genereer rapportages voor directie, opdrachtgevers en audits." },
];

const features = [
  { title: "Risico\u00ADregister", desc: "Centraal, doorzoekbaar en filterbaar overzicht van alle risico\u2019s.", icon: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" },
  { title: "Risicomatrix", desc: "Kans \u00d7 impact visualisatie met volledig instelbare schalen.", icon: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" },
  { title: "Dashboards", desc: "Interactieve grafieken, heatmaps en KPI-weergaven op \u00e9\u00e9n plek.", icon: "M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" },
  { title: "Maatregelen", desc: "Koppel beheersmaatregelen aan risico\u2019s en volg de voortgang.", icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" },
  { title: "Samenwerking", desc: "Wijs eigenaren toe, stel deadlines in en werk samen in real-time.", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
  { title: "Audit Trail", desc: "Volledige traceerbaarheid van elke wijziging voor audits en compliance.", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
];

const trustItems = [
  { title: "AVG / GDPR-compliant", desc: "Data wordt verwerkt en opgeslagen binnen de EU conform de privacywetgeving." },
  { title: "Versleuteling", desc: "Alle data is versleuteld in transit (TLS) en at rest (AES-256)." },
  { title: "Rollen & Rechten", desc: "Fijnmazig autorisatiemodel met rollen, teams en projecttoegang." },
  { title: "SSO & MFA", desc: "Single Sign-On via SAML/OIDC en multi-factor authenticatie voor iedere gebruiker." },
];

/* ──────────────────── PAGE ──────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-navy">
        {/* Subtle grid pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-60" />
        {/* Radial glow */}
        <div className="pointer-events-none absolute top-[-30%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm mb-6">
              Platform voor projectrisicomanagement
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Grip op risico&apos;s.
              <br />
              <span className="text-accent">Van inzicht tot actie.</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-slate-300 leading-relaxed">
              RiskBases is het risicomanagementplatform waarmee projectteams
              risico&apos;s identificeren, analyseren, beheersen en bewaken —
              in één centrale omgeving.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link
              href="/book-demo"
              className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]"
            >
              Plan een demo
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/30 active:scale-[.98]"
            >
              Gratis uitproberen
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LOGO BAR ─── */}
      <LogoBar />

      {/* ─── PROBLEM ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Het probleem</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
            Risicomanagement draait nog te vaak op spreadsheets
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Projectteams verliezen overzicht, werken met verouderde informatie
            en missen cruciale signalen. Risico-registers in Excel groeien,
            worden niet bijgewerkt en geven geen inzicht in trends of
            samenhang. Het resultaat: beslissingen op gevoel in plaats van
            op data.
          </p>
        </div>
      </section>

      {/* ─── SOLUTION ─── */}
      <section id="product" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">De oplossing</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
              Eén platform voor je hele risicoproces
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
              RiskBases vervangt losse spreadsheets door een gestructureerde,
              centrale omgeving — gebouwd voor projectteams die grip willen
              op risico&apos;s zonder extra bureaucratie.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Centraal & actueel", desc: "Eén bron van waarheid die altijd up-to-date is — geen versie-chaos meer." },
              { title: "Visueel & inzichtelijk", desc: "Heatmaps, dashboards en trendgrafieken geven direct overzicht." },
              { title: "Gestructureerd", desc: "Volg bewezen methodieken (RISMAN, ISO 31000) in een helder format." },
              { title: "Samenwerken", desc: "Werk samen met je hele projectteam — ieder met de juiste rechten." },
              { title: "Rapportages", desc: "Genereer in één klik rapportages voor directie en opdrachtgevers." },
              { title: "Schaalbaar", desc: "Van één project tot een portfolio met duizenden risico\u2019s." },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <h3 className="text-base font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Hoe het werkt</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
              In vijf stappen van risico naar beheersing
            </h2>
          </div>

          <div className="mt-16 space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className="group relative flex items-start gap-6 py-8"
              >
                {/* Vertical connector */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[23px] top-[60px] bottom-0 w-px bg-slate-200" />
                )}
                {/* Step number */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white font-bold text-sm shadow-lg shadow-navy/20 transition-transform duration-200 group-hover:scale-110">
                  {step.n}
                </div>
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
      <section id="modules" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Modules</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
              Branchespecifieke modules
            </h2>
            <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Gebruik alleen wat je nodig hebt. Elke module bevat
              sectorspecifieke risicotemplates, taxonomieën en rapportages.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map((m) => (
              <div
                key={m.name}
                className={`group relative rounded-xl border bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                  m.live ? "border-slate-200" : "border-dashed border-slate-300"
                }`}
              >
                {/* Badge */}
                <span
                  className={`absolute top-4 right-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    m.live
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {m.live ? "Live" : "Binnenkort"}
                </span>
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${m.live ? "bg-accent/10 text-accent" : "bg-slate-100 text-slate-400"}`}>
                  <Icon d={m.icon} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{m.name}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Functies</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy leading-tight">
              Alles wat je nodig hebt, niets dat je niet nodig hebt
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon d={f.icon} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-navy">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST & SECURITY ─── */}
      <section className="py-24 bg-navy">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Vertrouwen & Beveiliging</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white leading-tight">
              Enterprise-grade beveiliging
            </h2>
            <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Wij nemen beveiliging en privacy serieus. RiskBases is ontworpen
              met enterprise-eisen als uitgangspunt.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {trustItems.map((t) => (
              <div
                key={t.title}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-200 hover:bg-white/[.08]"
              >
                <h3 className="text-base font-semibold text-white">{t.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Klaar om risico&apos;s écht te beheersen?
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Ontdek hoe RiskBases jouw projecten veiliger en voorspelbaarder maakt.
            Start vandaag — zonder verplichtingen.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book-demo"
              className="inline-flex items-center rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[.98]"
            >
              Plan een demo
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]"
            >
              Gratis uitproberen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
