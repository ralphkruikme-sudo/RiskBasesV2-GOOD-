import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal — RiskBases",
};

export default function LegalIndexPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-navy">Legal</h1>
        <p className="mt-4 text-slate-500">
          Review our legal documents below.
        </p>

        <ul className="mt-10 space-y-4">
          <li>
            <Link
              href="/legal/privacy"
              className="text-accent hover:underline font-medium"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              href="/legal/terms"
              className="text-accent hover:underline font-medium"
            >
              Terms of Service
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
