"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import OAuthButtons from "@/components/ui/OAuthButtons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Show message from callback errors or redirect params
  const callbackError = searchParams.get("error");
  const redirectedFrom = searchParams.get("redirectedFrom");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message.includes("Email not confirmed")) {
        setError("Je e-mailadres is nog niet bevestigd. Check je inbox.");
      } else if (authError.message.includes("Invalid login credentials")) {
        setError("Onjuist e-mailadres of wachtwoord.");
      } else {
        setError(authError.message);
      }
      return;
    }

    // Hard redirect — avoids stale React state and double navigation
    window.location.href = redirectedFrom || "/app";
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Welkom terug</h1>
        <p className="mt-1 text-sm text-slate-500">
          Log in op je RiskBases-account.
        </p>

        {/* Error messages */}
        {(error || callbackError) && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error ||
              (callbackError === "auth_callback_failed"
                ? "Er ging iets mis met de e-mailbevestiging. Probeer opnieuw."
                : "Er is een fout opgetreden.")}
          </div>
        )}

        {/* Social login */}
        <div className="mt-6">
          <OAuthButtons />
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 uppercase tracking-wider">of</span>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@bedrijf.nl"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Inloggen…
              </span>
            ) : (
              "Inloggen"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Nog geen account?{" "}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Registreren
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
