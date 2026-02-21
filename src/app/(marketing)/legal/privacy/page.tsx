import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — RiskBases",
};

export default function PrivacyPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-slate">
        <h1 className="text-4xl font-extrabold text-navy">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">
          Last updated: February 2026
        </p>

        <div className="mt-8 space-y-6 text-slate-600 leading-relaxed">
          <p>
            RiskBases (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, and share information about you when you use our
            platform and services.
          </p>

          <h2 className="text-xl font-bold text-slate-800">Information We Collect</h2>
          <p>
            We collect information you provide directly, such as account details
            and content you create. We also collect usage data automatically
            through cookies and similar technologies.
          </p>

          <h2 className="text-xl font-bold text-slate-800">How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our
            services, communicate with you, and comply with legal obligations.
          </p>

          <h2 className="text-xl font-bold text-slate-800">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@riskbases.com" className="text-accent hover:underline">
              privacy@riskbases.com
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
