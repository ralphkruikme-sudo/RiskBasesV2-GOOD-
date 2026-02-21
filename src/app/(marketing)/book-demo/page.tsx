import type { Metadata } from "next";
import BookDemoContent from "./BookDemoContent";

export const metadata: Metadata = {
  title: "Plan een Demo \u2014 RiskBases",
  description: "Plan een persoonlijke walkthrough van het RiskBases-platform.",
};

export default function BookDemoPage() {
  return <BookDemoContent />;
}
