import type { Metadata } from "next";
import Script from "next/script";
import React from "react";
import { SiteNav } from "@/components/shared/SiteNav";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EV Charge Savings — How Much Will You Save Going Electric?",
    template: "%s | EV Charge Savings",
  },
  description:
    "See exactly how much an EV would save you in your zip code. Real 2026 electricity and gas rates for all 50 US states, 140+ EV models, free forever.",
  metadataBase: new URL("https://www.evchargesavings.com"),
  openGraph: {
    type: "website",
    siteName: "EV Charge Savings",
    url: "https://www.evchargesavings.com",
  },
  twitter: { card: "summary_large_image" },
  other: {
    "google-adsense-account": "ca-pub-6904215876470010",
    "indexnow-key": "ccd656076fbc461f9a711d00e5945297",
    "fo-verify": "8aa31f7b-2e1f-4ace-87c1-61a478a080ec",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}>
      <head>
        {React.createElement("meta", { name: "impact-site-verification", content: "960c3032-0ee0-4b68-ac48-6e69b019dc4c" })}
        <link rel="preconnect" href="https://api.zippopotam.us" />
        {/* Microsoft Clarity — in <head> so verifier finds it in static HTML */}
        <script dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wrvthpzoke");` }} />
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

        {/* Outbound link tracking */}
        <Script id="outbound-tracking" strategy="afterInteractive">{`
          document.addEventListener('click', function(e) {
            var a = e.target.closest('a[target="_blank"]');
            if (!a || !a.href) return;
            try {
              var domain = new URL(a.href).hostname.replace(/^www\\./, '');
              if (typeof window.gtag === 'function') {
                window.gtag('event', 'outbound_click', {
                  link_url: a.href,
                  link_domain: domain,
                  link_text: (a.innerText || '').trim().slice(0, 80),
                });
              }
            } catch(err) {}
          });
        `}</Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6904215876470010"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <SiteNav />

        {children}
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
