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
  metadataBase: new URL("https://www.evchargesavings.com"),
  openGraph: {
    type: "website",
    siteName: "EV Charge Savings",
    url: "https://www.evchargesavings.com",
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
        {React.createElement("meta", { name: "impact-site-verification", content: "960c3032-0ee0-4b68-ac48-6e69b019dc4c" })}
      </head>
      <body className="pb-20">
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y4V4NBZ0YY"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Y4V4NBZ0YY');
        `}</Script>

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
              <span className="text-cream/30">EIA data</span>
            </span>
            <nav className="flex gap-6" aria-label="Top">
              {[
                { href: "/#calculator", label: "Calculator" },
                { href: "/#public-charging", label: "Networks" },
                { href: "/guides", label: "Guides" },
                { href: "/how-we-calculate", label: "Methodology" },
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
