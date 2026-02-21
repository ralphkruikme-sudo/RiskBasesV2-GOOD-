"use client";

const logos = [
  "Heijmans", "BAM", "VolkerWessels", "Strukton", "Dura Vermeer",
  "Van Oord", "Boskalis", "Arcadis", "Royal HaskoningDHV", "Witteveen+Bos",
  "Fugro", "TBI Holdings", "Ballast Nedam", "Besix", "Mourik",
];

export default function LogoBar() {
  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
          Vertrouwd door toonaangevende organisaties
        </p>
      </div>

      {/* Marquee wrapper */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="marquee-track flex w-max gap-12 items-center">
          {/* Duplicate the set for seamless looping */}
          {[...logos, ...logos].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-10 px-6 rounded-md bg-slate-50 border border-slate-100"
            >
              <span className="text-sm font-semibold text-slate-400 whitespace-nowrap tracking-wide">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
