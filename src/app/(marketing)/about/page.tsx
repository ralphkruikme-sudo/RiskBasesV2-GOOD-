import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "Over ons \u2014 RiskBases",
  description: "Leer wie er achter RiskBases zit en waarom we dit platform bouwen.",
};

export default function AboutPage() {
  return <AboutContent />;
}
