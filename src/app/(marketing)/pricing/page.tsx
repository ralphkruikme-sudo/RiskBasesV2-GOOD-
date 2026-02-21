import type { Metadata } from "next";
import PricingContent from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing \u2014 RiskBases",
  description: "Simple, transparent pricing. All modules included on every plan.",
};

export default function PricingPage() {
  return <PricingContent />;
}
