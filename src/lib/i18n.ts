/* ─────────────────────────────────────────────────────
   Lightweight i18n — no external deps.
   NL is the default and fully translated.
   EN / DE are placeholder stubs (keys mirror NL for now).
   ────────────────────────────────────────────────────── */

export const SUPPORTED_LOCALES = ["nl", "en", "de"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  nl: "NL",
  en: "EN",
  de: "DE",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  nl: "Nederlands",
  en: "English",
  de: "Deutsch",
};

export const DEFAULT_LOCALE: Locale = "nl";

/* ─── Dictionary type ─── */

export interface Dictionary {
  nav: {
    product: string;
    modules: string;
    pricing: string;
    about: string;
    faq: string;
    login: string;
    bookDemo: string;
    getStarted: string;
  };
  cookie: {
    title: string;
    description: string;
    accept: string;
    reject: string;
    manage: string;
    manageTitle: string;
    necessary: string;
    necessaryDesc: string;
    analytics: string;
    analyticsDesc: string;
    marketing: string;
    marketingDesc: string;
    save: string;
  };
  footer: {
    product: string;
    overview: string;
    modules: string;
    pricing: string;
    about: string;
    faq: string;
    getStarted: string;
    bookDemo: string;
    freeStart: string;
    legal: string;
    privacy: string;
    terms: string;
    tagline: string;
  };
}

/* ─── Dictionaries ─── */

const nl: Dictionary = {
  nav: {
    product: "Product",
    modules: "Modules",
    pricing: "Prijzen",
    about: "Over ons",
    faq: "FAQ",
    bookDemo: "Plan een demo",
    login: "Inloggen",
    getStarted: "Gratis starten",
  },
  cookie: {
    title: "Wij gebruiken cookies",
    description:
      "We gebruiken cookies om je ervaring te verbeteren, verkeer te analyseren en content te personaliseren. Je kunt je voorkeuren hieronder beheren.",
    accept: "Alles accepteren",
    reject: "Alleen noodzakelijk",
    manage: "Beheren",
    manageTitle: "Cookie-voorkeuren",
    necessary: "Noodzakelijk",
    necessaryDesc: "Vereist voor de basisfunctionaliteit van de website.",
    analytics: "Analytisch",
    analyticsDesc: "Helpt ons begrijpen hoe bezoekers de site gebruiken.",
    marketing: "Marketing",
    marketingDesc: "Wordt gebruikt om gepersonaliseerde advertenties te tonen.",
    save: "Voorkeuren opslaan",
  },
  footer: {
    product: "Product",
    overview: "Overzicht",
    modules: "Modules",
    pricing: "Prijzen",
    about: "Over ons",
    faq: "FAQ",
    getStarted: "Aan de slag",
    bookDemo: "Plan een demo",
    freeStart: "Gratis starten",
    legal: "Juridisch",
    privacy: "Privacybeleid",
    terms: "Algemene voorwaarden",
    tagline: "Het risicomanagementplatform voor projectteams in bouw, infra en industrie.",
  },
};

const en: Dictionary = {
  nav: {
    product: "Product",
    modules: "Modules",
    pricing: "Pricing",
    about: "About",
    faq: "FAQ",
    bookDemo: "Book a demo",
    login: "Log in",
    getStarted: "Start free trial",
  },
  cookie: {
    title: "We use cookies",
    description:
      "We use cookies to enhance your experience, analyze traffic, and personalize content. You can manage your preferences below.",
    accept: "Accept all",
    reject: "Necessary only",
    manage: "Manage",
    manageTitle: "Cookie preferences",
    necessary: "Necessary",
    necessaryDesc: "Required for basic website functionality.",
    analytics: "Analytics",
    analyticsDesc: "Helps us understand how visitors use the site.",
    marketing: "Marketing",
    marketingDesc: "Used to show personalized advertisements.",
    save: "Save preferences",
  },
  footer: {
    product: "Product",
    overview: "Overview",
    modules: "Modules",
    pricing: "Pricing",
    about: "About",
    faq: "FAQ",
    getStarted: "Get Started",
    bookDemo: "Book a demo",
    freeStart: "Start for free",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    tagline: "The risk management platform for project teams in construction, infrastructure, and industry.",
  },
};

const de: Dictionary = {
  nav: {
    product: "Produkt",
    modules: "Module",
    pricing: "Preise",
    about: "Über uns",
    faq: "FAQ",
    bookDemo: "Demo buchen",
    login: "Anmelden",
    getStarted: "Kostenlos starten",
  },
  cookie: {
    title: "Wir verwenden Cookies",
    description:
      "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, den Datenverkehr zu analysieren und Inhalte zu personalisieren. Sie können Ihre Einstellungen unten verwalten.",
    accept: "Alle akzeptieren",
    reject: "Nur notwendige",
    manage: "Verwalten",
    manageTitle: "Cookie-Einstellungen",
    necessary: "Notwendig",
    necessaryDesc: "Erforderlich für die grundlegende Website-Funktionalität.",
    analytics: "Analytisch",
    analyticsDesc: "Hilft uns zu verstehen, wie Besucher die Website nutzen.",
    marketing: "Marketing",
    marketingDesc: "Wird verwendet, um personalisierte Werbung anzuzeigen.",
    save: "Einstellungen speichern",
  },
  footer: {
    product: "Produkt",
    overview: "Übersicht",
    modules: "Module",
    pricing: "Preise",
    about: "Über uns",
    faq: "FAQ",
    getStarted: "Loslegen",
    bookDemo: "Demo buchen",
    freeStart: "Kostenlos starten",
    legal: "Rechtliches",
    privacy: "Datenschutz",
    terms: "AGB",
    tagline: "Die Risikomanagement-Plattform für Projektteams in Bau, Infrastruktur und Industrie.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { nl, en, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}
