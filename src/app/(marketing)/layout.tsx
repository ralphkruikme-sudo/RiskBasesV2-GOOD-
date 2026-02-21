import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import CookieBanner from "@/components/marketing/CookieBanner";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CookieBanner />
    </LocaleProvider>
  );
}
