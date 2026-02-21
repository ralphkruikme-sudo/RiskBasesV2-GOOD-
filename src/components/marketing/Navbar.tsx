"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";

export default function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/#product", label: t.nav.product },
    { href: "/#modules", label: t.nav.modules },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,.06)] border-b border-slate-200/80"
          : "bg-white/70 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="RiskBases"
            className="h-8 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-lg font-bold tracking-tight text-navy">RiskBases</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-3 py-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-navy after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-0 after:rounded-full after:bg-accent after:transition-all after:duration-200 hover:after:w-5"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs + Language Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
              aria-label="Change language"
            >
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              {LOCALE_LABELS[locale]}
              <svg className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg animate-fade-in-up">
                {SUPPORTED_LOCALES.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLocale(l);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      locale === l
                        ? "bg-accent/5 text-accent font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-semibold text-xs w-6">{LOCALE_LABELS[l]}</span>
                    <span>{l === "nl" ? "Nederlands" : l === "en" ? "English" : "Deutsch"}</span>
                    {locale === l && (
                      <svg className="ml-auto h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/book-demo"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:shadow-sm active:scale-[.98]"
          >
            {t.nav.bookDemo}
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-navy"
          >
            {t.nav.login}
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[.98]"
          >
            {t.nav.getStarted}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200/80 bg-white px-4 pb-5 pt-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-navy transition-colors"
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="pt-2 pb-1 px-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Taal / Language</p>
            <div className="flex gap-1.5">
              {SUPPORTED_LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    locale === l
                      ? "bg-accent text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/book-demo"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:border-slate-400 transition-colors"
            >
              {t.nav.bookDemo}
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:border-slate-400 transition-colors"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
              {t.nav.getStarted}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
