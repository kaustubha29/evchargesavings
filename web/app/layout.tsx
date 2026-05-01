import type { Metadata } from "next";
import Script from "next/script";
import React from "react";
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
  other: {
    "google-adsense-account": "ca-pub-6904215876470010",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Impact affiliate verification — uses value= not content=, React.createElement bypasses JSX type check */}
        {React.createElement("meta", { name: "impact-site-verification", value: "9b198be7-1e28-4638-9419-a03122b75d3d" })}
      </head>
      <body className="pb-20">
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6904215876470010"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Top status bar */}
        <div className="bg-[#0d2c1f] text-cream font-mono text-[11px] uppercase tracking-[.08em] px-6 py-2.5 flex justify-between items-center gap-4 flex-wrap">
          {/* Logo / home link */}
          <a href="/" className="text-cream no-underline hover:text-honey transition-colors normal-case whitespace-nowrap font-semibold tracking-wide">
            ⚡ EV Charge Savings
          </a>

          {/* Status + nav */}
          <div className="flex items-center gap-6 flex-wrap">
            <span className="hidden sm:inline text-cream/40 normal-case tracking-normal">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald animate-pulse mr-1.5 align-middle" />
              <span className="text-honey/80">Live rates</span>
              {" · "}
              <span className="text-cream/30">EIA + AAA data</span>
            </span>
            <nav className="flex gap-6" aria-label="Top">
              {[
                { href: "/#calculator", label: "Calculator" },
                { href: "/#public-charging", label: "Networks" },
                { href: "/#guides", label: "Guides" },
              ].map((l) => (
                <a key={l.href} href={l.href} className="text-cream/60 no-underline hover:text-cream transition-colors normal-case">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
