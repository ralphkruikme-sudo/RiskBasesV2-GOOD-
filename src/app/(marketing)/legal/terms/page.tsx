import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — RiskBases",
};

export default function TermsPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-navy">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-400">
          Last updated: February 2026
        </p>

        <div className="mt-8 space-y-6 text-slate-600 leading-relaxed">
          <p>
            By accessing or using RiskBases, you agree to be bound by these
            Terms of Service. If you do not agree, do not use our services.
          </p>

          <h2 className="text-xl font-bold text-slate-800">Use of Services</h2>
          <p>
            You may use RiskBases only in compliance with these Terms and all
            applicable laws. You are responsible for maintaining the security of
            your account credentials.
          </p>

          <h2 className="text-xl font-bold text-slate-800">Intellectual Property</h2>
          <p>
            All content and materials available on RiskBases are our property or
            licensed to us. You retain ownership of data you upload to the
            platform.
          </p>

          <h2 className="text-xl font-bold text-slate-800">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, RiskBases shall not be liable
            for any indirect, incidental, or consequential damages arising from
            your use of the service.
          </p>

          <h2 className="text-xl font-bold text-slate-800">Contact</h2>
          <p>
            Questions? Email us at{" "}
            <a href="mailto:legal@riskbases.com" className="text-accent hover:underline">
              legal@riskbases.com
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
