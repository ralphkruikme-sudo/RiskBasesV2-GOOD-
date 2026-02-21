"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

/* ─── Types ─── */

export interface CookieConsent {
  necessary: boolean; // always true
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "rb_cookie_consent";
const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

/* ─── Helpers ─── */

function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Also set a real cookie so server can read it
    return { necessary: true, analytics: !!parsed.analytics, marketing: !!parsed.marketing };
  } catch {
    return null;
  }
}

function writeConsent(consent: CookieConsent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  // Set a real 1st-party cookie (365 days)
  const value = encodeURIComponent(JSON.stringify(consent));
  document.cookie = `rb_consent=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

/* ─── Toggle component ─── */

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${checked ? "bg-accent" : "bg-slate-200"}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ─── Banner ─── */

export default function CookieBanner() {
  const { t } = useLocale();
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [draft, setDraft] = useState<CookieConsent>(DEFAULT_CONSENT);

  // On mount: check if consent was already given
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  function accept() {
    const full: CookieConsent = { necessary: true, analytics: true, marketing: true };
    writeConsent(full);
    setConsent(full);
    setVisible(false);
    setShowManage(false);
  }

  function reject() {
    const minimal: CookieConsent = { necessary: true, analytics: false, marketing: false };
    writeConsent(minimal);
    setConsent(minimal);
    setVisible(false);
    setShowManage(false);
  }

  function saveDraft() {
    const final: CookieConsent = { ...draft, necessary: true };
    writeConsent(final);
    setConsent(final);
    setVisible(false);
    setShowManage(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop for manage panel */}
      {showManage && (
        <div
          className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setShowManage(false)}
        />
      )}

      {/* Main banner */}
      <div className="fixed bottom-0 inset-x-0 z-[9999] p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          {/* Manage panel (slides up above the banner) */}
          {showManage && (
            <div className="mb-3 rounded-2xl border border-slate-200 bg-white shadow-xl p-6 animate-fade-in-up">
              <h3 className="text-base font-bold text-navy">{t.cookie.manageTitle}</h3>

              <div className="mt-5 space-y-4">
                {/* Necessary — always on */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.cookie.necessary}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.cookie.necessaryDesc}</p>
                  </div>
                  <Toggle checked disabled />
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.cookie.analytics}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.cookie.analyticsDesc}</p>
                  </div>
                  <Toggle
                    checked={draft.analytics}
                    onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
                  />
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.cookie.marketing}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.cookie.marketingDesc}</p>
                  </div>
                  <Toggle
                    checked={draft.marketing}
                    onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveDraft}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover active:scale-[.98]"
                >
                  {t.cookie.save}
                </button>
              </div>
            </div>
          )}

          {/* Cookie bar */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-5 sm:p-6">
            <div className="sm:flex sm:items-start sm:gap-4">
              {/* Icon */}
              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-navy">{t.cookie.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  {t.cookie.description}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-end">
              <button
                onClick={() => setShowManage(!showManage)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[.98]"
              >
                {t.cookie.manage}
              </button>
              <button
                onClick={reject}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[.98]"
              >
                {t.cookie.reject}
              </button>
              <button
                onClick={accept}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover active:scale-[.98]"
              >
                {t.cookie.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
