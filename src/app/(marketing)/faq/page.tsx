import type { Metadata } from "next";
import FAQContent from "./FAQContent";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen \u2014 RiskBases",
  description: "Antwoorden op de meest gestelde vragen over RiskBases.",
};

export default function FAQPage() {
  return <FAQContent />;
}
