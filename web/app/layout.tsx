import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EV Charge Savings — How Much Will You Save Going Electric?",
    template: "%s | EV Charge Savings",
  },
  description:
    "See exactly how much an EV would save you in your zip code. Real 2026 electricity and gas rates for all 50 US states, 130+ EV models, free forever.",
  metadataBase: new URL("https://evchargesavings.com"),
  openGraph: {
    type: "website",
    siteName: "EV Charge Savings",
    url: "https://evchargesavings.com",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="pb-20">
        {/* Top status bar */}
        <div className="bg-[#0d2c1f] text-cream font-mono text-[11px] uppercase tracking-[.08em] px-6 py-2.5 flex justify-between items-center gap-4 flex-wrap">
          <div>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald animate-pulse mr-2 align-middle" />
            <span className="text-honey">Live rates</span>
            {" · "}Updated monthly{" · "}
            <span className="text-cream/50">EIA + AAA data</span>
          </div>
          <nav className="flex gap-6" aria-label="Top">
            {[
              { href: "/#calculator", label: "Calculator" },
              { href: "/#public-charging", label: "Networks" },
              { href: "/#guides", label: "Guides" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="text-cream/70 no-underline hover:text-cream transition-colors normal-case">
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {children}
      </body>
    </html>
  );
}
